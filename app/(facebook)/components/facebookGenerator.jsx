"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ParameterInput } from "@/components/parameterInput";
import { SuccessAlert } from "@/components/sucessAlert";
import { createFacebookJsonObject } from "@/lib/createFacebookJson";
import { facebookParamsList } from "@/lib/facebookParamsList";
import { getDefaultTrigger } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { TriggerTable } from "./triggerTable";

export default function FacebookGenerator() {
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col bg-[#fafafa]">
        <Header />
        <main className="flex flex-1 flex-col gap-4 px-4 lg:gap-6 lg:px-10 pb-8">
          <div className="w-full  mx-auto">
            <Card className="container mx-auto mb-8">
              <CardHeader className="px-7 text-xl">
                <h3 className="font-semibold">Facebook Pixel ID</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
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
              </CardContent>
            </Card>

            <div className="mb-4">
              <Card className="mb-8">
                <CardHeader className="px-7">
                  <h3 className="text-xl font-semibold mb-4">
                    Types d&apos;événements
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                    {eventTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`facebook-${type}`}
                          checked={!!facebook.events[type]}
                          onCheckedChange={() =>
                            handleEventCheckboxChange(type)
                          }
                        />
                        <Label htmlFor={`facebook-${type}`}>
                          {type.replace(/_/g, " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {hasSelectedEvents && hasParameters && (
                <Card className="mb-8">
                  <CardHeader className="px-7">
                    <h3 className="text-xl font-semibold mb-4">
                      Paramètres des événements
                    </h3>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              )}

              {hasSelectedEvents && hasTriggers && (
                <Card className="mb-8">
                  <CardHeader className="px-7">
                    <h3 className="text-xl font-semibold mb-4">
                      Triggers des événements
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <TriggerTable
                      events={facebook.events}
                      triggers={facebook.triggers}
                      onTriggerChange={handleTriggerChange}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <Button
              onClick={handleExportJSON}
              disabled={isExporting || !hasSelectedEvents}
              className="mt-2"
            >
              {isExporting ? "Exportation en cours..." : "Exporter en JSON"}
            </Button>

            <SuccessAlert
              isVisible={showSuccessAlert}
              onClose={() => setShowSuccessAlert(false)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
