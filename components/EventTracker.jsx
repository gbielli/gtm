"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { createJsonObject } from "./createJsonObject";

const EventTracker = () => {
  const [adPlatforms, setAdPlatforms] = useState({
    facebook: { selected: false, conversionId: "", events: {} },
    tiktok: { selected: false, conversionId: "", events: {} },
    googleAds: { selected: false, conversionId: "", events: {} },
  });

  const eventTypes = [
    "view_promotion",
    "select_promotion",
    "view_item_list",
    "select_item",
    "view_item",
    "add_to_cart",
    "add_to_wishlist",
  ];

  const handlePlatformChange = (platform) => {
    setAdPlatforms((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], selected: !prev[platform].selected },
    }));
  };

  const handleConversionIdChange = (platform, value) => {
    setAdPlatforms((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], conversionId: value },
    }));
  };

  const handleEventCheckboxChange = (platform, eventType) => {
    setAdPlatforms((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        events: {
          ...prev[platform].events,
          [eventType]: prev[platform].events[eventType]
            ? undefined
            : { conversionLabel: "" },
        },
      },
    }));
  };

  const handleConversionLabelChange = (platform, eventType, value) => {
    setAdPlatforms((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        events: {
          ...prev[platform].events,
          [eventType]: {
            ...prev[platform].events[eventType],
            conversionLabel: value,
          },
        },
      },
    }));
  };

  const handleExportJSON = () => {
    const jsonObj = createJsonObject(adPlatforms);

    const jsonString = JSON.stringify(jsonObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "GTM_Label_Conversions.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Suivi d&apos;événements e-commerce
      </h2>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Régies publicitaires</h3>
        {Object.entries(adPlatforms).map(([platform, data]) => (
          <div key={platform} className="flex items-center space-x-2">
            <Switch
              id={platform}
              checked={data.selected}
              onCheckedChange={() => handlePlatformChange(platform)}
            />
            <Label htmlFor={platform}>{platform}</Label>
            {data.selected && (
              <Input
                type="text"
                value={data.conversionId}
                onChange={(e) =>
                  handleConversionIdChange(platform, e.target.value)
                }
                placeholder="Conversion ID"
                className="ml-2 w-48"
              />
            )}
          </div>
        ))}
      </div>

      {Object.entries(adPlatforms).map(
        ([platform, data]) =>
          data.selected && (
            <div key={platform} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{platform}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {eventTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${platform}-${type}`}
                      checked={!!data.events[type]}
                      onCheckedChange={() =>
                        handleEventCheckboxChange(platform, type)
                      }
                    />
                    <Label htmlFor={`${platform}-${type}`}>
                      {type.replace(/_/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type d'événement</TableHead>
                      <TableHead>Conversion Label</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(data.events).map(([type, eventData]) => (
                      <TableRow key={type}>
                        <TableCell>{type}</TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={eventData.conversionLabel}
                            onChange={(e) =>
                              handleConversionLabelChange(
                                platform,
                                type,
                                e.target.value
                              )
                            }
                            placeholder="Entrez un Conversion Label"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
      )}

      {Object.values(adPlatforms).some((p) => p.selected) && (
        <Button onClick={handleExportJSON} className="mt-4">
          Exporter en JSON
        </Button>
      )}
    </div>
  );
};

export default EventTracker;