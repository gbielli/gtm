"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { facebookEvent } from "../facebookEvent";
import { Checkbox } from "../ui/checkbox";
import { createFacebookJsonObject } from "./createFacebookJson";

const FacebookEventTracker = () => {
  const [facebook, setFacebook] = useState({
    selected: false,
    conversionId: "",
    events: {},
  });

  const eventTypes = [
    "complete_registration",
    "add_to_cart",
    "add_to_wishlist",
    "initiate_checkout",
    "add_payment_info",
    "purchase",
    "lead",
  ];

  const handleFacebookChange = () => {
    setFacebook((prev) => ({
      ...prev,
      selected: !prev.selected,
    }));
  };

  const handleConversionIdChange = (value) => {
    setFacebook((prev) => ({
      ...prev,
      conversionId: value,
    }));
  };

  const handleEventCheckboxChange = (eventType) => {
    setFacebook((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventType]: prev.events[eventType] ? undefined : { parameters: {} },
      },
    }));
  };

  const handleParameterChange = (
    eventType,
    parameter,
    value,
    subParam = null
  ) => {
    setFacebook((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [eventType]: {
          ...prev.events[eventType],
          parameters: {
            ...prev.events[eventType].parameters,
            [parameter]: subParam
              ? {
                  ...prev.events[eventType].parameters[parameter],
                  [subParam]: value,
                }
              : value,
          },
        },
      },
    }));
  };

  const handleExportJSON = () => {
    const jsonObj = createFacebookJsonObject(facebook);
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

  const renderFacebookEvents = () => (
    <div className="max-h-[600px] overflow-y-auto">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(facebook.events).map(([type, eventData]) => (
          <AccordionItem key={type} value={type}>
            <AccordionTrigger>{type}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Paramètres de l'événement
                  </h4>
                  {Object.entries(facebookEvent[type] || {}).map(
                    ([param, paramData]) => (
                      <div key={param} className="mb-2">
                        <Label htmlFor={`facebook-${type}-${param}`}>
                          {param}
                        </Label>
                        <Input
                          id={`facebook-${type}-${param}`}
                          type={paramData.type === "number" ? "number" : "text"}
                          value={eventData.parameters?.[param] || ""}
                          onChange={(e) =>
                            handleParameterChange(type, param, e.target.value)
                          }
                          placeholder={
                            paramData.placeholder || `Entrez ${param}`
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Suivi d'événements Facebook</h2>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Facebook Ads</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="facebook"
            checked={facebook.selected}
            onCheckedChange={handleFacebookChange}
          />
          <Label htmlFor="facebook">Facebook</Label>
          {facebook.selected && (
            <Input
              type="text"
              value={facebook.conversionId}
              onChange={(e) => handleConversionIdChange(e.target.value)}
              placeholder="Conversion ID"
              className="ml-2 w-48"
            />
          )}
        </div>
      </div>

      {facebook.selected && (
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
          {renderFacebookEvents()}
        </div>
      )}

      {facebook.selected && (
        <Button onClick={handleExportJSON} className="mt-4">
          Exporter en JSON
        </Button>
      )}
    </div>
  );
};

export default FacebookEventTracker;
