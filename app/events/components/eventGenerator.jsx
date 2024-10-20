"use client";

import { Notification } from "@/components/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { jsonObj } from "@/lib/createEventsJson";
import { Download } from "lucide-react";
import { useState } from "react";

const EventsGenerator = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const generateEvents = async () => {
    setIsExporting(true);
    setError("");
    setShowErrorAlert(false);
    try {
      const lines = input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      if (lines.length === 0) {
        throw new Error("Aucune entrée trouvée");
      }

      const gtmVariables = lines.map((line) => {
        const [key] = line.split(/\s+|\t+/).map((item) => item.trim());

        return {
          accountId: "6247820543",
          containerId: "195268723",
          triggerId: `${Math.floor(Math.random() * 1000)}`,
          name: `CUST - ${key}`,
          type: "CUSTOM_EVENT",
          customEventFilter: [
            {
              type: "EQUALS",
              parameter: [
                {
                  type: "TEMPLATE",
                  key: "arg0",
                  value: "{{_event}}",
                },
                {
                  type: "TEMPLATE",
                  key: "arg1",
                  value: key,
                },
              ],
            },
          ],
          fingerprint: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        };
      });

      const json = JSON.stringify(jsonObj(gtmVariables), null, 2);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gtm_variables.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000); // Auto-hide after 5 seconds
    } catch (err) {
      setError(err.message);
      setShowErrorAlert(true); // show error alert when there's an error
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="">
      <Card className="container mx-auto mb-8">
        <CardHeader className="px-7 text-xl">
          <h3 className="font-semibold">Renseignez vos events custom</h3>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ajoutez un event custom par ligne"
          />
          <div>
            <h3 className="mb-2">Exemple :</h3>
            <pre className="bg-gray-800 text-sm text-white p-4 rounded language-json">
              <code className="language-json">
                click_on_faq{" "}
                <span className="text-gray-400">
                  {"/* créer un trigger event custom click_on_faq  */"}
                </span>
                <br />
                submit_newsletter{" "}
                <span className="text-gray-400">
                  {"/* créer un trigger event custom submit_newsletter  */"}
                </span>
                <br />
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button
          onClick={generateEvents}
          disabled={isExporting}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exportation en cours..." : "Télécharger les events"}
        </Button>
      </div>

      {showErrorAlert && ( // show error notification if there is an error
        <Notification
          title="Erreur"
          isVisible={showErrorAlert}
          description={error}
          type="error"
          onClose={() => setShowErrorAlert(false)}
        />
      )}

      {showSuccessAlert && ( // show success notification if the export was successful
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

export default EventsGenerator;
