"use client";

import { Notification } from "@/components/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildConsentSetup } from "@/lib/buildConsentSetup";
import { buildExport } from "@/lib/gtmContainer";
import { Download } from "lucide-react";
import { useState } from "react";

const GA4_EVENTS = [
  { name: "page_view", hasEcommerce: false },
  { name: "view_item", hasEcommerce: true },
  { name: "view_item_list", hasEcommerce: true },
  { name: "add_to_cart", hasEcommerce: true },
  { name: "view_cart", hasEcommerce: true },
  { name: "select_item", hasEcommerce: true },
  { name: "begin_checkout", hasEcommerce: true },
  { name: "add_payment_info", hasEcommerce: true },
  { name: "add_shipping_info", hasEcommerce: true },
  { name: "purchase", hasEcommerce: true },
  { name: "remove_from_cart", hasEcommerce: true },
];

// GTM built-in triggers
const INIT_TRIGGER_ID = "2147479573"; // Initialization - All Pages

const CONST_VAR_NAME = "CONST - GA4 ID";
const EVENT_SETTINGS_VAR_NAME = "Event Settings Variable";

const DEFAULT_DIDOMI_SCRIPT = `<script type="text/javascript">(function(){(function(e,i,o){var n=document.createElement("link");n.rel="preconnect";n.as="script";var t=document.createElement("link");t.rel="dns-prefetch";t.as="script";var r=document.createElement("script");r.id="spcloader";r.type="text/javascript";r["async"]=true;r.charset="utf-8";window.didomiConfig=window.didomiConfig||{};window.didomiConfig.sdkPath=window.didomiConfig.sdkPath||o||"https://sdk.privacy-center.org/";var d=window.didomiConfig.sdkPath;var a=d+e+"/loader.js?target_type=notice&target="+i;if(window.didomiConfig&&window.didomiConfig.user){var c=window.didomiConfig.user;var s=c.country;var f=c.region;if(s){a=a+"&country="+s;if(f){a=a+"&region="+f}}}n.href=d;t.href=d;r.src=a;var m=document.getElementsByTagName("script")[0];m.parentNode.insertBefore(n,m);m.parentNode.insertBefore(t,m);m.parentNode.insertBefore(r,m)})("VOTRE_API_KEY","VOTRE_NOTICE_ID")})();<\/script>`;

const GA4Generator = () => {
  const [selectedEvents, setSelectedEvents] = useState(
    new Set(GA4_EVENTS.map((e) => e.name)),
  );
  const [ga4Id, setGa4Id] = useState("");
  // const [triggerPrefix, setTriggerPrefix] = useState("");
  const [serverContainer, setServerContainer] = useState("");
  const [triggerSuffix, setTriggerSuffix] = useState("_aw");
  const [tagPrefix, setTagPrefix] = useState("GA4 - ");
  const [tagSuffix, setTagSuffix] = useState("");

  // Consent
  const [includeConsent, setIncludeConsent] = useState(false);
  const [includeDidomiTag, setIncludeDidomiTag] = useState(false);
  const [didomiScript, setDidomiScript] = useState(DEFAULT_DIDOMI_SCRIPT);

  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState("");

  const toggleEvent = (eventName) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventName)) {
        next.delete(eventName);
      } else {
        next.add(eventName);
      }
      return next;
    });
  };

  const selectAll = () =>
    setSelectedEvents(new Set(GA4_EVENTS.map((e) => e.name)));
  const selectNone = () => setSelectedEvents(new Set());

  const getTriggerEventName = (eventName) => `${eventName}${triggerSuffix}`;

  const getTagName = (eventName) => `${tagPrefix}${eventName}${tagSuffix}`;

  const previewEvent =
    selectedEvents.size > 0 ? [...selectedEvents][0] : "purchase";

  const generateAndDownload = async () => {
    setIsExporting(true);
    setError("");
    setShowErrorAlert(false);
    try {
      if (!ga4Id.trim()) {
        throw new Error("Veuillez renseigner votre GA4 ID");
      }
      if (selectedEvents.size === 0) {
        throw new Error("Aucun évènement sélectionné");
      }

      const tags = [];
      const triggers = [];
      const variables = [];
      const customTemplates = [];

      // Variable constante GA4 ID
      variables.push({
        variableId: `${Math.floor(Math.random() * 90000) + 10000}`,
        name: CONST_VAR_NAME,
        type: "c",
        parameter: [{ type: "TEMPLATE", key: "value", value: ga4Id.trim() }],
        fingerprint: Date.now().toString(),
        formatValue: {},
      });

      // Event Settings Variable vide
      variables.push({
        variableId: `${Math.floor(Math.random() * 90000) + 10000}`,
        name: EVENT_SETTINGS_VAR_NAME,
        type: "gtes",
        parameter: [{ type: "LIST", key: "eventSettingsTable", list: [] }],
        fingerprint: Date.now().toString(),
      });

      // Google Tag — se déclenche à l'initialisation
      tags.push({
        tagId: `${Math.floor(Math.random() * 90000) + 10000}`,
        name: `${tagPrefix}Google Tag${tagSuffix}`,
        type: "googtag",
        parameter: [
          { type: "TEMPLATE", key: "tagId", value: `{{${CONST_VAR_NAME}}}` },
          {
            type: "LIST",
            key: "configSettingsTable",
            list: [
              {
                type: "MAP",
                map: [
                  {
                    type: "TEMPLATE",
                    key: "parameter",
                    value: "send_page_view",
                  },
                  { type: "TEMPLATE", key: "parameterValue", value: "false" },
                ],
              },
            ],
          },
          {
            type: "TEMPLATE",
            key: "eventSettingsVariable",
            value: `{{${EVENT_SETTINGS_VAR_NAME}}}`,
          },
        ],
        fingerprint: Date.now().toString(),
        firingTriggerId: [INIT_TRIGGER_ID],
        tagFiringOption: "ONCE_PER_EVENT",
        monitoringMetadata: { type: "MAP" },
        consentSettings: { consentStatus: "NOT_SET" },
      });

      // Tags et triggers GA4 pour chaque évènement sélectionné
      GA4_EVENTS.filter((e) => selectedEvents.has(e.name)).forEach((event) => {
        const triggerId = `${Math.floor(Math.random() * 90000) + 10000}`;
        const tagId = `${Math.floor(Math.random() * 90000) + 10000}`;
        const triggerEventName = getTriggerEventName(event.name);

        triggers.push({
          triggerId,
          name: `${triggerEventName}`,
          type: "CUSTOM_EVENT",
          customEventFilter: [
            {
              type: "EQUALS",
              parameter: [
                { type: "TEMPLATE", key: "arg0", value: "{{_event}}" },
                { type: "TEMPLATE", key: "arg1", value: triggerEventName },
              ],
            },
          ],
          fingerprint: Date.now().toString(),
        });

        const tagParameters = event.hasEcommerce
          ? [
              { type: "BOOLEAN", key: "sendEcommerceData", value: "true" },
              {
                type: "TEMPLATE",
                key: "getEcommerceDataFrom",
                value: "dataLayer",
              },
            ]
          : [{ type: "BOOLEAN", key: "sendEcommerceData", value: "false" }];

        tagParameters.push(
          { type: "TEMPLATE", key: "eventName", value: event.name },
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
        );

        tags.push({
          tagId,
          name: getTagName(event.name),
          type: "gaawe",
          parameter: tagParameters,
          fingerprint: Date.now().toString(),
          firingTriggerId: [triggerId],
          tagFiringOption: "ONCE_PER_EVENT",
          monitoringMetadata: { type: "MAP" },
          consentSettings: { consentStatus: "NOT_SET" },
        });
      });

      // Setup Didomi / Consent Mode
      if (includeConsent) {
        const consent = buildConsentSetup({
          includeDidomiTag,
          didomiScript,
          tagPrefix,
          tagSuffix,
        });
        tags.push(...consent.tags);
        triggers.push(...consent.triggers);
        variables.push(...consent.variables);
        customTemplates.push(consent.customTemplate);
      }

      const exportData = {
        tag: tags,
        trigger: triggers,
        variable: variables,
      };
      if (customTemplates.length > 0) {
        exportData.customTemplate = customTemplates;
      }

      const json = JSON.stringify(buildExport(exportData), null, 2);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gtm_ga4_events.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err) {
      setError(err.message);
      setShowErrorAlert(true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* GA4 ID */}
      <Card className="container mx-auto mb-6">
        <CardHeader className="px-7 text-xl">
          <h3 className="font-semibold">GA4 ID</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-w-sm">
            <Label>Identifiant GA4</Label>
            <Input
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Crée la variable <strong>{CONST_VAR_NAME}</strong> et
              l&apos;associe au Google Tag et à tous les évènements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration des noms */}
      <Card className="container mx-auto mb-6">
        <CardHeader className="px-7 text-xl">
          <h3 className="font-semibold">Configuration</h3>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Préfixe des tags</Label>
              <Input
                value={tagPrefix}
                onChange={(e) => setTagPrefix(e.target.value)}
                placeholder="ex: GA4 - "
              />
            </div>
            <div className="space-y-1">
              <Label>Suffixe de l&apos;évènement dataLayer</Label>
              <Input
                value={triggerSuffix}
                onChange={(e) => setTriggerSuffix(e.target.value)}
                placeholder="ex: _aw"
              />
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm space-y-1">
            <p className="text-gray-400 mb-2">
              {`// Aperçu pour "${previewEvent}"`}
            </p>
            <p>
              <span className="text-blue-400">Tag :</span>{" "}
              <span className="text-green-400">
                &quot;{getTagName(previewEvent)}&quot;
              </span>
            </p>
            <p>
              <span className="text-blue-400">Nom du déclencheur :</span>{" "}
              <span className="text-green-400">
                &quot;{getTriggerEventName(previewEvent)}&quot;
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des évènements */}
      <Card className="container mx-auto mb-6">
        <CardHeader className="px-7 text-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold">Sélection des évènements GA4</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Tout sélectionner
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Tout désélectionner
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GA4_EVENTS.map((event) => (
              <div
                key={event.name}
                className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleEvent(event.name)}
              >
                <Checkbox
                  checked={selectedEvents.has(event.name)}
                  onCheckedChange={() => toggleEvent(event.name)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {event.name}
                  </p>
                  {event.hasEcommerce && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ecommerce
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestion du consentement */}
      <Card className="container mx-auto mb-6">
        <CardHeader className="px-7 text-xl">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIncludeConsent(!includeConsent)}
          >
            <Checkbox
              checked={includeConsent}
              onCheckedChange={setIncludeConsent}
            />
            <h3 className="font-semibold">Gestion du consentement — Didomi</h3>
          </div>
        </CardHeader>

        {includeConsent && (
          <CardContent className="space-y-5">
            {/* Ce qui est inclus */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 rounded p-3 space-y-1">
                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Variables (6)
                </p>
                {[
                  "Cookie - didomi_token",
                  "JS - Parsed didomi_token",
                  "JS - Didomi - ad_* consent",
                  "JS - Didomi - Analytics consent",
                  "JS - Didomi - enabled vendors",
                  "JS - is didomi consented",
                ].map((v) => (
                  <p key={v} className="text-xs text-muted-foreground truncate">
                    {v}
                  </p>
                ))}
              </div>
              <div className="bg-gray-50 rounded p-3 space-y-1">
                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Triggers (2)
                </p>
                {[
                  "CE - didomi-consent",
                  "CE - All events - without consent",
                ].map((t) => (
                  <p key={t} className="text-xs text-muted-foreground">
                    {t}
                  </p>
                ))}
              </div>
              <div className="bg-gray-50 rounded p-3 space-y-1">
                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Tags + Template
                </p>
                {[
                  `${tagPrefix}Consent mode - default${tagSuffix}`,
                  `${tagPrefix}Consent mode - update${tagSuffix}`,
                  "Consent Mode (Simo Ahava)",
                ].map((t) => (
                  <p key={t} className="text-xs text-muted-foreground truncate">
                    {t}
                  </p>
                ))}
              </div>
            </div>

            {/* Balise Didomi CMP */}
            <div className="border rounded p-4 space-y-3">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIncludeDidomiTag(!includeDidomiTag)}
              >
                <Checkbox
                  checked={includeDidomiTag}
                  onCheckedChange={setIncludeDidomiTag}
                />
                <div>
                  <p className="font-medium text-sm">
                    Inclure la balise Didomi CMP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tag HTML qui charge le script d&apos;initialisation Didomi
                    (déclenché au consent init)
                  </p>
                </div>
              </div>

              {includeDidomiTag && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Code d&apos;initialisation Didomi — remplacez{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      VOTRE_API_KEY
                    </code>{" "}
                    et{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      VOTRE_NOTICE_ID
                    </code>
                  </Label>
                  <Textarea
                    value={didomiScript}
                    onChange={(e) => setDidomiScript(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export */}
      <div>
        <Button
          onClick={generateAndDownload}
          disabled={isExporting || selectedEvents.size === 0 || !ga4Id.trim()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting
            ? "Exportation en cours..."
            : `Télécharger (${selectedEvents.size} évènement${selectedEvents.size > 1 ? "s" : ""}${includeConsent ? " + consent" : ""})`}
        </Button>
      </div>

      {showErrorAlert && (
        <Notification
          title="Erreur"
          isVisible={showErrorAlert}
          description={error}
          type="error"
          onClose={() => setShowErrorAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <Notification
          isVisible={showSuccessAlert}
          title="Exportation réussie"
          description="Le fichier a bien été téléchargé"
          type="success"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default GA4Generator;
