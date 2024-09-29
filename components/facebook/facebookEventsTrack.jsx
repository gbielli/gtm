"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  facebookParamsList,
  parameterDescriptions,
} from "@/lib/facebookParamsList";
import {
  CheckCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { useCallback, useMemo, useState } from "react";
import { createFacebookJsonObject } from "./createFacebookJson";

const ParameterInput = ({ param, value, onChange, placeholder }) => {
  const description = parameterDescriptions[param];

  return (
    <div className="flex items-center space-x-2">
      <Label
        htmlFor={`facebook-param-${param}`}
        className="w-1/3 flex items-center"
      >
        {param}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <QuestionMarkCircledIcon className="h-4 w-4 ml-1 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Input
        id={`facebook-param-${param}`}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(param, e.target.value)}
        placeholder={placeholder}
        className="w-2/3"
      />
    </div>
  );
};

const SuccessAlert = ({ isVisible }) => (
  <Alert
    className={`fixed bottom-4 right-4 w-96 bg-green-500 text-white transition-opacity duration-300 ${
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <CheckCircledIcon color="white" className="h-4 w-4" />
    <AlertTitle>Succès</AlertTitle>
    <AlertDescription>
      Le fichier JSON a été généré et téléchargé avec succès.
    </AlertDescription>
  </Alert>
);

const getDefaultTrigger = (eventType) => {
  return eventType
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};

const TriggerTable = ({ events, triggers, onTriggerChange }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/3">Événement</TableHead>
        <TableHead>Trigger</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Object.entries(events)
        .filter(([_, isSelected]) => isSelected)
        .map(([eventType, _]) => (
          <TableRow key={eventType}>
            <TableCell className="font-medium">{eventType}</TableCell>
            <TableCell>
              <Input
                type="text"
                value={triggers[eventType] || ""}
                onChange={(e) => onTriggerChange(eventType, e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

export default function FacebookEventTracker() {
  const [facebook, setFacebook] = useState({
    pixelId: "",
    events: {},
    parameters: {},
    triggers: {}, // Nouvel état pour gérer les triggers
  });
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const eventTypes = useMemo(() => Object.keys(facebookParamsList), []);

  const handlePixelIdChange = useCallback((value) => {
    setFacebook((prev) => ({
      ...prev,
      pixelId: value,
    }));
    setError("");
  }, []);

  const handleEventCheckboxChange = useCallback((eventType) => {
    setFacebook((prev) => {
      const newEvents = { ...prev.events };
      newEvents[eventType] = !newEvents[eventType];

      const newParameters = { ...prev.parameters };
      const newTriggers = { ...prev.triggers };

      if (newEvents[eventType]) {
        // Ajouter le trigger par défaut lors de la sélection de l'événement
        newTriggers[eventType] = getDefaultTrigger(eventType);

        Object.keys(facebookParamsList[eventType]).forEach((param) => {
          if (!newParameters[param]) {
            newParameters[param] =
              facebookParamsList[eventType][param].placeholder || "";
          }
        });
      } else {
        // Supprimer le trigger si l'événement est désélectionné
        delete newTriggers[eventType];

        Object.keys(newParameters).forEach((param) => {
          if (
            !Object.entries(newEvents).some(
              ([et, isSelected]) => isSelected && facebookParamsList[et][param]
            )
          ) {
            delete newParameters[param];
          }
        });
      }

      return {
        ...prev,
        events: newEvents,
        parameters: newParameters,
        triggers: newTriggers,
      };
    });
  }, []);

  const handleParameterChange = useCallback((parameter, value) => {
    setFacebook((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameter]: value,
      },
    }));
  }, []);

  const handleTriggerChange = useCallback((eventType, value) => {
    setFacebook((prev) => ({
      ...prev,
      triggers: {
        ...prev.triggers,
        [eventType]: value,
      },
    }));
  }, []);

  const handleExportJSON = useCallback(async () => {
    if (!facebook.pixelId.trim()) {
      setError("L'ID du pixel Facebook est obligatoire.");
      return;
    }

    setIsExporting(true);
    try {
      const jsonObj = createFacebookJsonObject(facebook);
      if (jsonObj === null) {
        throw new Error("Échec de la génération du JSON.");
      }

      const jsonString = JSON.stringify(jsonObj, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Facebook_Event_Tracking.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000); // Auto-hide after 5 seconds
    } catch (error) {
      console.error("L'exportation a échoué:", error);
      setError("L'exportation a échoué. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  }, [facebook]);

  const relevantParameters = useMemo(() => {
    return Object.entries(facebook.events)
      .filter(([_, isSelected]) => isSelected)
      .flatMap(([eventType, _]) => Object.keys(facebookParamsList[eventType]))
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [facebook.events]);

  const hasSelectedEvents = useMemo(() => {
    return Object.values(facebook.events).some((isSelected) => isSelected);
  }, [facebook.events]);

  const hasParameters = useMemo(() => {
    return relevantParameters.length > 0;
  }, [relevantParameters]);

  const hasTriggers = useMemo(() => {
    return Object.keys(facebook.triggers).length > 0;
  }, [facebook.triggers]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Suivi d&apos;événements Facebook
      </h2>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">ID du Pixel Facebook</h3>
        <Input
          type="text"
          value={facebook.pixelId}
          onChange={(e) => handlePixelIdChange(e.target.value)}
          placeholder="Entrez l'ID du Pixel Facebook"
          className={`w-full ${error ? "border-red-500" : ""}`}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Types d&apos;événements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {eventTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`facebook-${type}`}
                checked={!!facebook.events[type]}
                onCheckedChange={() => handleEventCheckboxChange(type)}
              />
              <Label htmlFor={`facebook-${type}`}>
                {type.replace(/_/g, " ")}
              </Label>
            </div>
          ))}
        </div>

        {hasSelectedEvents && hasParameters && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Paramètres des événements</h4>
            <div className="space-y-2">
              {relevantParameters.map((param) => (
                <ParameterInput
                  key={param}
                  param={param}
                  value={facebook.parameters[param]}
                  onChange={handleParameterChange}
                />
              ))}
            </div>
          </div>
        )}

        {hasSelectedEvents && hasTriggers && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Triggers des événements</h4>
            <TriggerTable
              events={facebook.events}
              triggers={facebook.triggers}
              onTriggerChange={handleTriggerChange}
            />
          </div>
        )}
      </div>

      <Button
        onClick={handleExportJSON}
        disabled={isExporting || !hasSelectedEvents}
        className="mt-4"
      >
        {isExporting ? "Exportation en cours..." : "Exporter en JSON"}
      </Button>

      <SuccessAlert
        isVisible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
      />
    </div>
  );
}
