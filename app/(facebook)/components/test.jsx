"use client";
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

import { SuccessAlert } from "@/components/sucessAlert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { facebookParamsList } from "@/lib/facebookParamsList";
import { useCallback, useMemo, useState } from "react";
import { ParameterInput } from "../../../components/parameterInput";
import { createFacebookJsonObject } from "../../../lib/createFacebookJson";

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";
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
export default function Dashboard() {
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
      <div className="hidden border-r bg-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-18 items-center border-b px-4 lg:h-[75px] lg:px-6 py-4 ">
            <Link href="/" className="flex items-center gap-2  font-semibold">
              <Image
                src={"/images/logo-boryl.svg"}
                alt="Company Logo"
                width={300}
                height={100}
                className="h-8 w-auto mx-auto"
              />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 bg-muted rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Facebook
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Tiktok
                <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                  coming soon
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Linkedin
                <Badge className="ml-auto flex h-6 shrink-0 items-center justify-center rounded-full">
                  coming soon
                </Badge>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-[#fafafa]">
        <header className="flex h-14 items-center gap-4   px-4 lg:h-[75px] lg:px-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-3 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-3 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <h2 className="text-2xl font-bold">
            Création du suivi Facebook Client Side
          </h2>
        </header>

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
