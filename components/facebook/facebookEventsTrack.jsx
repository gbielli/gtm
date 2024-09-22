"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { createFacebookJsonObject } from "./createFacebookJson";
import { facebookEvent } from "./facebookEvent";

const FacebookEventTracker = () => {
  const [facebook, setFacebook] = useState({
    pixelId: "",
    events: {},
    parameters: {},
  });
  const [error, setError] = useState("");

  const eventTypes = Object.keys(facebookEvent);

  const handlePixelIdChange = (value) => {
    setFacebook((prev) => ({
      ...prev,
      pixelId: value,
    }));
    setError("");
  };

  const handleEventCheckboxChange = (eventType) => {
    setFacebook((prev) => {
      const newEvents = { ...prev.events };
      newEvents[eventType] = !newEvents[eventType];

      // Mettre à jour les paramètres en fonction des événements sélectionnés
      const newParameters = { ...prev.parameters };
      if (newEvents[eventType]) {
        Object.keys(facebookEvent[eventType]).forEach((param) => {
          if (!newParameters[param]) {
            newParameters[param] =
              facebookEvent[eventType][param].placeholder || "";
          }
        });
      } else {
        // Optionnel : supprimer les paramètres qui ne sont plus utilisés
        Object.keys(newParameters).forEach((param) => {
          if (
            !Object.entries(newEvents).some(
              ([et, isSelected]) => isSelected && facebookEvent[et][param]
            )
          ) {
            delete newParameters[param];
          }
        });
      }

      return { ...prev, events: newEvents, parameters: newParameters };
    });
  };

  const handleParameterChange = (parameter, value) => {
    setFacebook((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameter]: value,
      },
    }));
  };

  const handleExportJSON = () => {
    if (!facebook.pixelId.trim()) {
      setError("L'ID du pixel Facebook est obligatoire.");
      return;
    }

    console.log("État Facebook avant export:", facebook);
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

  const renderParametersTable = () => {
    const relevantParameters = Object.entries(facebook.events)
      .filter(([_, isSelected]) => isSelected)
      .flatMap(([eventType, _]) => Object.keys(facebookEvent[eventType]))
      .filter((value, index, self) => self.indexOf(value) === index);

    return (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Paramètres des événements</h4>
        <div className="space-y-2">
          {relevantParameters.map((param) => (
            <div key={param} className="flex items-center space-x-2">
              <Label htmlFor={`facebook-param-${param}`} className="w-1/3">
                {param}
              </Label>
              <Input
                id={`facebook-param-${param}`}
                type="text"
                value={facebook.parameters[param] || ""}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Entrez ${param}`}
                className="w-2/3"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          className={`w-full ${error ? "border-red-500" : ""}`}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
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
