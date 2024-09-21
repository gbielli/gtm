"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { facebookEvent } from "../facebookEvent";
import { Checkbox } from "../ui/checkbox";
import { createFacebookJsonObject } from "./createFacebookJson";

const FacebookEventTracker = () => {
  const [facebook, setFacebook] = useState({
    pixelId: "",
    events: {},
    parameters: {},
  });

  useEffect(() => {
    console.log("État Facebook mis à jour:", facebook);
  }, [facebook]);

  const eventTypes = Object.keys(facebookEvent);

  const handlePixelIdChange = (value) => {
    setFacebook((prev) => ({
      ...prev,
      pixelId: value,
    }));
  };

  const handleEventCheckboxChange = (eventType) => {
    setFacebook((prev) => {
      const newEvents = { ...prev.events };
      const newParameters = { ...prev.parameters };

      if (newEvents[eventType]) {
        delete newEvents[eventType];
        delete newParameters[eventType];
      } else {
        newEvents[eventType] = true;
        newParameters[eventType] = {};
        Object.keys(facebookEvent[eventType]).forEach((param) => {
          newParameters[eventType][param] =
            facebookEvent[eventType][param].placeholder || "";
        });
      }

      return {
        ...prev,
        events: newEvents,
        parameters: newParameters,
      };
    });
  };

  const handleParameterChange = (eventType, parameter, value) => {
    setFacebook((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [eventType]: {
          ...prev.parameters[eventType],
          [parameter]: value,
        },
      },
    }));
  };

  const handleExportJSON = () => {
    console.log("État Facebook avant export:", facebook);
    if (!facebook.pixelId) {
      console.warn(
        "L'ID du pixel Facebook n'est pas défini. Aucun JSON ne sera généré."
      );
      return;
    }
    const jsonObj = createFacebookJsonObject(facebook);
    if (jsonObj === null) {
      console.error("Échec de la génération du JSON.");
      return;
    }
    console.log("JSON généré:", jsonObj);
    const jsonString = JSON.stringify(jsonObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "Facebook_Event_Tracking.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderParametersTable = () => (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Paramètres des événements</h4>
      {Object.entries(facebook.events).map(
        ([eventType, isSelected]) =>
          isSelected && (
            <div key={eventType} className="mb-4">
              <h5 className="font-semibold">{eventType}</h5>
              <div className="space-y-2">
                {Object.entries(facebookEvent[eventType]).map(
                  ([param, paramData]) => (
                    <div key={param} className="flex items-center space-x-2">
                      <Label
                        htmlFor={`facebook-param-${eventType}-${param}`}
                        className="w-1/3"
                      >
                        {param}
                      </Label>
                      <Input
                        id={`facebook-param-${eventType}-${param}`}
                        type="text"
                        value={facebook.parameters[eventType]?.[param] || ""}
                        onChange={(e) =>
                          handleParameterChange(
                            eventType,
                            param,
                            e.target.value
                          )
                        }
                        placeholder={paramData.placeholder || `Entrez ${param}`}
                        className="w-2/3"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )
      )}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Suivi d'événements Facebook</h2>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">ID du Pixel Facebook</h3>
        <Input
          type="text"
          value={facebook.pixelId}
          onChange={(e) => handlePixelIdChange(e.target.value)}
          placeholder="Entrez l'ID du Pixel Facebook"
          className="w-full"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Types d'événements</h3>
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
        {renderParametersTable()}
      </div>

      <Button onClick={handleExportJSON} className="mt-4">
        Exporter en JSON
      </Button>
    </div>
  );
};

export default FacebookEventTracker;
