"use client";

import { Notification } from "@/components/notification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buildExport } from "@/lib/gtmContainer";
import { Download, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const CONST_VAR_NAME = "CONST - GA4 ID";
const EVENT_SETTINGS_VAR_NAME = "Event Settings Variable";
const UPD_VAR_NAME = "JS - UPD";

// ─── Param classification ──────────────────────────────────────────────────────
const isEcommerce = (p) => p.startsWith("ecommerce.");

const UPD_FIELD_MAP = {
  "user_data.email_address": { key: "email", level: "top" },
  "user_data.email": { key: "email", level: "top" },
  "user_data.phone_number": { key: "phone_number", level: "top" },
  "user_data.first_name": { key: "first_name", level: "address" },
  "user_data.last_name": { key: "last_name", level: "address" },
  "user_data.address.first_name": { key: "first_name", level: "address" },
  "user_data.address.last_name": { key: "last_name", level: "address" },
  "user_data.address.street": { key: "street", level: "address" },
  "user_data.street": { key: "street", level: "address" },
  "user_data.address.city": { key: "city", level: "address" },
  "user_data.city": { key: "city", level: "address" },
  "user_data.address.postal_code": { key: "postal_code", level: "address" },
  "user_data.postal_code": { key: "postal_code", level: "address" },
  "user_data.country": { key: "country", level: "address" },
  "user_data.address.country": { key: "country", level: "address" },
};

const EVENT_SETTINGS_DIRECT_MAP = {
  "user_data.user_id": "user_id",
  "user_data.new_customer": "new_customer",
};

const isUDP = (p) => p in UPD_FIELD_MAP;
const isEventSettingsDirect = (p) => p in EVENT_SETTINGS_DIRECT_MAP;

const DEFAULT_COOKIES = [
  { name: "_fbc", decode: false },
  { name: "_fbp", decode: false },
  { name: "_gcl_aw", decode: true },
  { name: "_epik", decode: false },
  { name: "_scid", decode: false },
  { name: "_ttp", decode: false },
  { name: "ttclid", decode: false },
];

// ─── CSV parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [],
    cell = "",
    inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i],
      next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (char === '"') inQuotes = false;
      else cell += char;
    } else {
      if (char === '"') inQuotes = true;
      else if (char === ",") {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\n") {
        row.push(cell.trim());
        cell = "";
        if (row.some((c) => c !== "")) rows.push(row);
        row = [];
      } else if (char !== "\r") cell += char;
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c !== "")) rows.push(row);
  }
  return rows;
}

function parseTrackingPlan(text) {
  const rows = parseCSV(text);
  const dataRows = rows.slice(3);
  const events = [];
  let current = null;
  for (const row of dataRows) {
    if (row[1]) {
      current = { name: row[1], params: [] };
      events.push(current);
    }
    if (current && row[4]) current.params.push(row[4]);
  }
  return events;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
let _counter = 100000;
function uid() {
  return String(++_counter);
}

function extractDLVPaths(value = "") {
  return [...value.matchAll(/\{\{DLV - ([^}]+)\}\}/g)].map((m) => m[1]);
}

// ─── UPD JS generator ─────────────────────────────────────────────────────────
function buildUPDJavascript(updFields) {
  const top = {},
    addr = {};
  updFields.forEach(({ ga4Key, ga4Level, value }) => {
    const b = ga4Level === "top" ? top : addr;
    if (!(ga4Key in b)) b[ga4Key] = value;
  });
  const topE = Object.entries(top),
    addrE = Object.entries(addr),
    hasAddr = addrE.length > 0;
  const lines = ["function() {", "  return {"];
  topE.forEach(([k, v], i) =>
    lines.push(`    "${k}": ${v}${i < topE.length - 1 || hasAddr ? "," : ""}`),
  );
  if (hasAddr) {
    lines.push('    "address": {');
    addrE.forEach(([k, v], i) =>
      lines.push(`      "${k}": ${v}${i < addrE.length - 1 ? "," : ""}`),
    );
    lines.push("    }");
  }
  lines.push("  };", "}");
  return lines.join("\n");
}

// ─── GTM builders ────────────────────────────────────────────────────────────
function buildDLV(path) {
  return {
    variableId: uid(),
    name: `DLV - ${path}`,
    type: "v",
    parameter: [
      { type: "INTEGER", key: "dataLayerVersion", value: "2" },
      { type: "BOOLEAN", key: "setDefaultValue", value: "false" },
      { type: "TEMPLATE", key: "name", value: path },
    ],
    fingerprint: Date.now().toString(),
    formatValue: {},
  };
}

function buildCookieVariable({ name, decode }) {
  return {
    variableId: uid(),
    name: `Cookie - ${name}`,
    type: "k",
    parameter: [
      { type: "BOOLEAN", key: "decodeCookie", value: String(decode) },
      { type: "TEMPLATE", key: "name", value: name },
    ],
    fingerprint: Date.now().toString(),
    formatValue: {},
  };
}

function buildTrigger(eventName) {
  return {
    triggerId: uid(),
    name: `CUST - ${eventName}`,
    type: "CUSTOM_EVENT",
    customEventFilter: [
      {
        type: "EQUALS",
        parameter: [
          { type: "TEMPLATE", key: "arg0", value: "{{_event}}" },
          { type: "TEMPLATE", key: "arg1", value: eventName },
        ],
      },
    ],
    fingerprint: Date.now().toString(),
  };
}

function buildGA4Tag({ eventName, params, triggerId, tagPrefix }) {
  const eventParameters = params.map(({ key, value }) => ({
    type: "MAP",
    map: [
      { type: "TEMPLATE", key: "parameter", value: key },
      { type: "TEMPLATE", key: "parameterValue", value: value },
    ],
  }));
  return {
    tagId: uid(),
    name: `${tagPrefix}${eventName}`,
    type: "gaawe",
    parameter: [
      { type: "BOOLEAN", key: "sendEcommerceData", value: "false" },
      { type: "TEMPLATE", key: "eventName", value: eventName },
      {
        type: "TEMPLATE",
        key: "measurementIdOverride",
        value: `{{${CONST_VAR_NAME}}}`,
      },
      {
        type: "TEMPLATE",
        key: "eventSettingsVariable",
        value: `{{${EVENT_SETTINGS_VAR_NAME}}}`,
      },
      ...(eventParameters.length > 0
        ? [{ type: "LIST", key: "eventParameters", list: eventParameters }]
        : []),
    ],
    fingerprint: Date.now().toString(),
    firingTriggerId: [triggerId],
    tagFiringOption: "ONCE_PER_EVENT",
    monitoringMetadata: { type: "MAP" },
    consentSettings: { consentStatus: "NOT_SET" },
  };
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────
function VarSelect({ value, onChange, options }) {
  return (
    <NativeSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-[13px]"
    >
      <option value="">— sélectionner —</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </NativeSelect>
  );
}

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
    {children}
  </p>
);

const Arrow = () => (
  <span className="text-gray-300 shrink-0 text-sm select-none">→</span>
);

function ParamRow({ keyContent, valueContent, action }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-48 shrink-0">{keyContent}</div>
      <Arrow />
      <div className="flex-1 min-w-0">{valueContent}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function DeleteBtn({ onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

// ─── Event Drawer ─────────────────────────────────────────────────────────────
function EventDrawer({
  ev,
  availableVars,
  onClose,
  onUpdateParam,
  onAddParam,
  onRemoveParam,
  onPromoteEcomParam,
}) {
  if (!ev) return null;
  return (
    <Sheet
      open={!!ev}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-[40%] sm:max-w-none flex flex-col p-0 overflow-hidden">
        <SheetHeader className="border-b border-gray-100 px-6 py-5 shrink-0">
          <SheetTitle className="font-mono text-[15px] text-gray-900">
            {ev.name}
          </SheetTitle>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {ev.params.length} paramètre{ev.params.length > 1 ? "s" : ""}
            {ev.ecomParams.length > 0 &&
              ` · ${ev.ecomParams.length} ecom disponible${ev.ecomParams.length > 1 ? "s" : ""}`}
          </p>
        </SheetHeader>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          {/* Regular params */}
          <div>
            <SectionLabel>Paramètres event</SectionLabel>
            <div className="space-y-2">
              {ev.params.map((p) => (
                <ParamRow
                  key={p.id}
                  keyContent={
                    <div className="flex items-center gap-2">
                      <Input
                        value={p.key}
                        onChange={(e) =>
                          onUpdateParam(ev.id, p.id, "key", e.target.value)
                        }
                        placeholder="nom_param"
                        className="h-9 font-mono text-[13px] border-gray-200"
                      />
                    </div>
                  }
                  valueContent={
                    <VarSelect
                      value={p.value}
                      onChange={(val) =>
                        onUpdateParam(ev.id, p.id, "value", val)
                      }
                      options={availableVars}
                    />
                  }
                  action={
                    <DeleteBtn
                      onClick={() => onRemoveParam(ev.id, p.id)}
                      title={
                        p._ecomPath ? "Renvoyer dans ecommerce" : "Supprimer"
                      }
                    />
                  }
                />
              ))}
              {ev.params.length === 0 && (
                <p className="text-[13px] text-gray-400 italic py-1">
                  Aucun paramètre
                </p>
              )}
            </div>
            <button
              onClick={() => onAddParam(ev.id)}
              className="mt-3 flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter un paramètre
            </button>
          </div>

          {/* Ecommerce params */}
          {ev.ecomParams.length > 0 && (
            <div>
              <SectionLabel>
                Ecommerce — cliquer pour créer une DLV
              </SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {ev.ecomParams.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onPromoteEcomParam(ev.id, e.id)}
                    className="font-mono text-[12px] text-gray-500 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    {e.path}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-4 shrink-0">
          <Button
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
            onClick={onClose}
          >
            Enregistrer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TrackingPlanGenerator() {
  const [events, setEvents] = useState([]);
  const [updFields, setUpdFields] = useState([]);
  const [settingsRows, setSettingsRows] = useState([]);
  const [availableVars, setAvailableVars] = useState([]);
  const [drawerEventId, setDrawerEventId] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const [ga4Id, setGa4Id] = useState("");
  const [tagPrefix, setTagPrefix] = useState("GA4 - ");
  const [serverSideEnabled, setServerSideEnabled] = useState(false);
  const [serverContainerUrl, setServerContainerUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const drawerEvent = events.find((ev) => ev.id === drawerEventId) ?? null;

  // ── Import ──────────────────────────────────────────────────────────────────
  const buildWorkingState = (parsed) => {
    const allParams = [...new Set(parsed.flatMap((ev) => ev.params))];
    const allUDP = allParams.filter(isUDP);
    const allDirect = allParams.filter(isEventSettingsDirect);
    const allEcom = allParams.filter(isEcommerce);
    const allNonEcom = allParams.filter((p) => !isEcommerce(p));

    const vars = [
      ...allNonEcom.map((p) => `{{DLV - ${p}}}`),
      ...allEcom.map((p) => `{{DLV - ${p}}}`),
      ...DEFAULT_COOKIES.map((c) => `{{Cookie - ${c.name}}}`),
      ...(allUDP.length > 0 ? [`{{${UPD_VAR_NAME}}}`] : []),
      `{{${CONST_VAR_NAME}}}`,
    ];
    setAvailableVars([...new Set(vars)].sort());

    setEvents(
      parsed.map((ev) => ({
        id: uid(),
        name: ev.name,
        params: ev.params
          .filter(
            (p) => !isEcommerce(p) && !isUDP(p) && !isEventSettingsDirect(p),
          )
          .map((p) => ({
            id: uid(),
            key: p.split(".").pop(),
            value: `{{DLV - ${p}}}`,
          })),
        ecomParams: [...new Set(ev.params.filter(isEcommerce))].map((p) => ({
          id: uid(),
          path: p,
        })),
      })),
    );

    setUpdFields(
      allUDP.map((p) => ({
        id: uid(),
        dlvPath: p,
        ga4Key: UPD_FIELD_MAP[p].key,
        ga4Level: UPD_FIELD_MAP[p].level,
        value: `{{DLV - ${p}}}`,
      })),
    );

    const rows = [];
    if (allUDP.length > 0)
      rows.push({ id: uid(), key: "user_data", value: `{{${UPD_VAR_NAME}}}` });
    allDirect.forEach((p) =>
      rows.push({
        id: uid(),
        key: EVENT_SETTINGS_DIRECT_MAP[p],
        value: `{{DLV - ${p}}}`,
      }),
    );
    setSettingsRows(rows);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseTrackingPlan(ev.target.result);
        if (!parsed.length) throw new Error("Aucun événement trouvé");
        buildWorkingState(parsed);
        setError("");
        setShowError(false);
      } catch (err) {
        setError(err.message);
        setShowError(true);
        setEvents([]);
      }
    };
    reader.readAsText(file);
  };

  // ── Event editing ───────────────────────────────────────────────────────────
  const updateParam = (evId, paramId, field, val) =>
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id !== evId
          ? ev
          : {
              ...ev,
              params: ev.params.map((p) =>
                p.id === paramId ? { ...p, [field]: val } : p,
              ),
            },
      ),
    );

  const addParam = (evId) =>
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id !== evId
          ? ev
          : {
              ...ev,
              params: [...ev.params, { id: uid(), key: "", value: "" }],
            },
      ),
    );

  const removeParam = (evId, paramId) =>
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== evId) return ev;
        const param = ev.params.find((p) => p.id === paramId);
        if (param?._ecomPath) {
          return {
            ...ev,
            params: ev.params.filter((p) => p.id !== paramId),
            ecomParams: [
              ...ev.ecomParams,
              { id: uid(), path: param._ecomPath },
            ],
          };
        }
        return { ...ev, params: ev.params.filter((p) => p.id !== paramId) };
      }),
    );

  const promoteEcomParam = (evId, ecomId) =>
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== evId) return ev;
        const ecom = ev.ecomParams.find((e) => e.id === ecomId);
        if (!ecom) return ev;
        return {
          ...ev,
          params: [
            ...ev.params,
            {
              id: uid(),
              key: ecom.path.split(".").pop(),
              value: `{{DLV - ${ecom.path}}}`,
              _ecomPath: ecom.path,
            },
          ],
          ecomParams: ev.ecomParams.filter((e) => e.id !== ecomId),
        };
      }),
    );

  // ── UPD editing ─────────────────────────────────────────────────────────────
  const updateUpdField = (id, val) =>
    setUpdFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value: val } : f)),
    );

  // ── Event Settings editing ──────────────────────────────────────────────────
  const updateSettingsRow = (id, field, val) =>
    setSettingsRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );

  const addSettingsRow = () =>
    setSettingsRows((prev) => [...prev, { id: uid(), key: "", value: "" }]);

  const removeSettingsRow = (id) =>
    setSettingsRows((prev) => prev.filter((r) => r.id !== id));

  // ── Export ──────────────────────────────────────────────────────────────────
  const generateAndDownload = () => {
    setIsExporting(true);
    setError("");
    setShowError(false);
    try {
      if (!ga4Id.trim()) throw new Error("Veuillez renseigner votre GA4 ID");
      if (serverSideEnabled && !serverContainerUrl.trim())
        throw new Error("Veuillez renseigner l'URL du server container");
      if (!events.length) throw new Error("Aucun événement chargé");

      const variables = [],
        triggers = [],
        tags = [];

      const dlvPaths = new Set();
      events.forEach((ev) => {
        ev.params.forEach((p) =>
          extractDLVPaths(p.value).forEach((path) => dlvPaths.add(path)),
        );
      });
      updFields.forEach((f) => dlvPaths.add(f.dlvPath));
      settingsRows.forEach((r) =>
        extractDLVPaths(r.value).forEach((path) => dlvPaths.add(path)),
      );

      variables.push({
        variableId: uid(),
        name: CONST_VAR_NAME,
        type: "c",
        parameter: [{ type: "TEMPLATE", key: "value", value: ga4Id.trim() }],
        fingerprint: Date.now().toString(),
        formatValue: {},
      });

      DEFAULT_COOKIES.forEach((c) => variables.push(buildCookieVariable(c)));
      [...dlvPaths].forEach((path) => variables.push(buildDLV(path)));

      if (updFields.length > 0)
        variables.push({
          variableId: uid(),
          name: UPD_VAR_NAME,
          type: "jsm",
          parameter: [
            {
              type: "TEMPLATE",
              key: "javascript",
              value: buildUPDJavascript(updFields),
            },
          ],
          fingerprint: Date.now().toString(),
          formatValue: {},
        });

      const settingsList = [];
      if (serverSideEnabled && serverContainerUrl.trim())
        settingsList.push({
          type: "MAP",
          map: [
            {
              type: "TEMPLATE",
              key: "parameter",
              value: "server_container_url",
            },
            {
              type: "TEMPLATE",
              key: "parameterValue",
              value: serverContainerUrl.trim(),
            },
          ],
        });
      settingsRows
        .filter((r) => r.key && r.value)
        .forEach((r) =>
          settingsList.push({
            type: "MAP",
            map: [
              { type: "TEMPLATE", key: "parameter", value: r.key },
              { type: "TEMPLATE", key: "parameterValue", value: r.value },
            ],
          }),
        );
      variables.push({
        variableId: uid(),
        name: EVENT_SETTINGS_VAR_NAME,
        type: "gtes",
        parameter: [
          { type: "LIST", key: "eventSettingsTable", list: settingsList },
        ],
        fingerprint: Date.now().toString(),
      });

      events.forEach((ev) => {
        const trigger = buildTrigger(ev.name);
        triggers.push(trigger);
        const allParams = ev.params.filter((p) => p.key && p.value);
        tags.push(
          buildGA4Tag({
            eventName: ev.name,
            params: allParams,
            triggerId: trigger.triggerId,
            tagPrefix,
          }),
        );
      });

      const json = JSON.stringify(
        buildExport({ tag: tags, trigger: triggers, variable: variables }),
        null,
        2,
      );
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gtm_tracking_plan.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setIsExporting(false);
    }
  };

  const updTop = updFields.filter((f) => f.ga4Level === "top");
  const updAddr = updFields.filter((f) => f.ga4Level === "address");
  const hasData = events.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* ── Import ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Importer le plan de tracking
        </h2>
        <div className="space-y-1.5">
          <Label className="text-[13px] text-gray-600">
            Fichier CSV (format Addingwell)
          </Label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="h-9 text-sm"
          />
        </div>
        <p className="text-[12px] text-gray-400">
          <span className="font-mono bg-gray-100 rounded px-1.5 py-0.5">
            colonne B
          </span>{" "}
          Nom des événements &nbsp;·&nbsp;{" "}
          <span className="font-mono bg-gray-100 rounded px-1.5 py-0.5">
            col E
          </span>{" "}
          Nom des paramètres
        </p>
      </div>

      {/* ── Configuration ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Configuration
          </h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-gray-600">GA4 ID</Label>
              <Input
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="h-9 text-[13px] border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-gray-600">
                Préfixe des tags
              </Label>
              <Input
                value={tagPrefix}
                onChange={(e) => setTagPrefix(e.target.value)}
                placeholder="GA4 - "
                className="h-9 text-[13px] border-gray-200"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={serverSideEnabled}
                onChange={(e) => setServerSideEnabled(e.target.checked)}
                className="h-4 w-4 accent-gray-800 cursor-pointer rounded"
              />
              <span className="text-[13px] font-medium text-gray-700">
                Server-side tagging
              </span>
            </label>
            {serverSideEnabled && (
              <div className="space-y-1.5 pt-1">
                <Label className="text-[13px] text-gray-600">
                  URL du server container
                </Label>
                <Input
                  value={serverContainerUrl}
                  onChange={(e) => setServerContainerUrl(e.target.value)}
                  placeholder="https://sst.mondomaine.com"
                  className="h-9 text-[13px] border-gray-200"
                />
                <p className="text-[12px] text-gray-400">
                  Ajouté en première position de l&apos;Event Settings Variable
                  comme <span className="font-mono">server_container_url</span>
                </p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-[13px] font-medium text-gray-700">
              Variables cookie générées par défaut
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_COOKIES.map(({ name }) => (
                <span
                  key={name}
                  className="font-mono text-[12px] bg-gray-50 text-gray-500 border border-gray-200 rounded-md px-2 py-0.5"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Events table ── */}
      {hasData &&
        (() => {
          const pageCount = Math.ceil(events.length / PAGE_SIZE);
          const paginated = events.slice(
            page * PAGE_SIZE,
            (page + 1) * PAGE_SIZE,
          );
          return (
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6 font-semibold text-gray-900 text-[13px]">
                        Événement
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 text-[13px]">
                        Paramètres
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 text-[13px] w-28">
                        Ecom
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-[13px] text-gray-400 py-8"
                        >
                          Aucun événement
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginated.map((ev) => (
                        <TableRow
                          key={ev.id}
                          className="cursor-pointer hover:bg-gray-50/80"
                          onClick={() => setDrawerEventId(ev.id)}
                        >
                          <TableCell className="pl-6 font-mono text-[13px] font-semibold text-gray-900">
                            {ev.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {ev.params.slice(0, 5).map((p) => (
                                <span
                                  key={p.id}
                                  className="font-mono text-[11px] bg-gray-100 text-gray-500 rounded-md px-1.5 py-0.5"
                                >
                                  {p.key || "…"}
                                </span>
                              ))}
                              {ev.params.length > 5 && (
                                <span className="text-[11px] text-gray-400">
                                  +{ev.params.length - 5}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {ev.ecomParams.length > 0 ? (
                              <span className="text-[12px] font-medium text-orange-500">
                                {ev.ecomParams.length} dispo
                              </span>
                            ) : (
                              <span className="text-[12px] text-gray-300">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {events.length > PAGE_SIZE && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">
                    {page * PAGE_SIZE + 1}–
                    {Math.min((page + 1) * PAGE_SIZE, events.length)} sur{" "}
                    {events.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="h-8 text-[12px]"
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(pageCount - 1, p + 1))
                      }
                      disabled={page >= pageCount - 1}
                      className="h-8 text-[12px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* ── User Provided Data ── */}
      {hasData && updFields.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-gray-900">
              User Provided Data
            </h2>
            <span className="text-[12px] text-gray-400 font-mono">
              {UPD_VAR_NAME}
            </span>
          </div>
          <div className="px-6 py-5 space-y-5">
            <div className="font-mono text-[12px] bg-gray-950 text-gray-100 rounded-lg p-4 leading-relaxed space-y-0.5">
              <p className="text-gray-500 mb-2">{"// JS - UPD"}</p>
              <p>{"{"}</p>
              {updTop.map((f) => (
                <p key={f.id} className="pl-4">
                  <span className="text-amber-300">&quot;{f.ga4Key}&quot;</span>
                  <span className="text-gray-600">: </span>
                  <span className="text-emerald-400">{f.value || "…"}</span>
                  <span className="text-gray-600">,</span>
                </p>
              ))}
              {updAddr.length > 0 && (
                <>
                  <p className="pl-4">
                    <span className="text-amber-300">&quot;address&quot;</span>
                    <span className="text-gray-600">: {"{"}</span>
                  </p>
                  {updAddr.map((f) => (
                    <p key={f.id} className="pl-8">
                      <span className="text-amber-300">
                        &quot;{f.ga4Key}&quot;
                      </span>
                      <span className="text-gray-600">: </span>
                      <span className="text-emerald-400">{f.value || "…"}</span>
                      <span className="text-gray-600">,</span>
                    </p>
                  ))}
                  <p className="pl-4 text-gray-600">{"}"}</p>
                </>
              )}
              <p>{"}"}</p>
            </div>
            <div className="space-y-2">
              {updTop.map((f) => (
                <ParamRow
                  key={f.id}
                  keyContent={
                    <Input
                      readOnly
                      value={f.ga4Key}
                      className="h-9 font-mono text-[13px] bg-gray-50 text-gray-500 border-gray-200 cursor-default"
                    />
                  }
                  valueContent={
                    <VarSelect
                      value={f.value}
                      onChange={(val) => updateUpdField(f.id, val)}
                      options={availableVars}
                    />
                  }
                />
              ))}
              {updAddr.length > 0 && (
                <>
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 pt-2">
                    address
                  </p>
                  {updAddr.map((f) => (
                    <ParamRow
                      key={f.id}
                      keyContent={
                        <Input
                          readOnly
                          value={f.ga4Key}
                          className="h-9 font-mono text-[13px] bg-gray-50 text-gray-500 border-gray-200 cursor-default"
                        />
                      }
                      valueContent={
                        <VarSelect
                          value={f.value}
                          onChange={(val) => updateUpdField(f.id, val)}
                          options={availableVars}
                        />
                      }
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Event Settings Variable ── */}
      {hasData && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">
              Event Settings Variable
            </h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            {serverSideEnabled && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 text-[13px] text-blue-600">
                <span className="font-mono font-medium">
                  server_container_url
                </span>
                <Arrow />
                <span className="font-mono flex-1">
                  {serverContainerUrl || "(URL non définie)"}
                </span>
                <span className="text-[11px] text-blue-400 italic">
                  depuis la config
                </span>
              </div>
            )}
            <div className="space-y-2">
              {settingsRows.map((r) => (
                <ParamRow
                  key={r.id}
                  keyContent={
                    <Input
                      value={r.key}
                      onChange={(e) =>
                        updateSettingsRow(r.id, "key", e.target.value)
                      }
                      placeholder="clé"
                      className="h-9 font-mono text-[13px] border-gray-200"
                    />
                  }
                  valueContent={
                    <VarSelect
                      value={r.value}
                      onChange={(val) => updateSettingsRow(r.id, "value", val)}
                      options={availableVars}
                    />
                  }
                  action={<DeleteBtn onClick={() => removeSettingsRow(r.id)} />}
                />
              ))}
              {settingsRows.length === 0 && !serverSideEnabled && (
                <p className="text-[13px] text-gray-400 italic py-1">
                  Aucune entrée
                </p>
              )}
            </div>
            <button
              onClick={addSettingsRow}
              className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter une entrée
            </button>
          </div>
        </div>
      )}

      {/* ── Export ── */}
      <Button
        onClick={generateAndDownload}
        disabled={isExporting || !events.length || !ga4Id.trim()}
        className="w-full h-10 text-[13px] font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
      >
        <Download className="h-4 w-4" />
        {isExporting
          ? "Exportation en cours…"
          : "Télécharger la configuration GTM"}
      </Button>

      {/* ── Event Drawer ── */}
      <EventDrawer
        ev={drawerEvent}
        availableVars={availableVars}
        onClose={() => setDrawerEventId(null)}
        onUpdateParam={updateParam}
        onAddParam={addParam}
        onRemoveParam={removeParam}
        onPromoteEcomParam={promoteEcomParam}
      />

      {showError && (
        <Notification
          title="Erreur"
          isVisible={showError}
          description={error}
          type="error"
          onClose={() => setShowError(false)}
        />
      )}
      {showSuccess && (
        <Notification
          isVisible={showSuccess}
          title="Exportation réussie"
          description="Le fichier gtm_tracking_plan.json a été téléchargé"
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
