"use client";

import { Notification } from "@/components/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { jsonObj } from "@/lib/createall";
import { Download } from "lucide-react";
import { useState } from "react";

const GTMVariableGenerator = () => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").slice(1); // Ignorer la première ligne (en-têtes)

      const parsedData = lines
        .map((line) => {
          if (line.trim() === "") return null;

          const [eventName, variables] = line
            .split(",")
            .map((item) => item.trim());

          return { eventName, variables: variables.split(" ") };
        })
        .filter(Boolean);

      setCsvData(parsedData);
    };

    reader.readAsText(file);
  };

  const generateAndDownloadGTMVariables = async () => {
    setIsExporting(true);
    setError("");
    setShowErrorAlert(false);
    try {
      if (csvData.length === 0) {
        throw new Error("Aucune donnée CSV trouvée");
      }

      const triggers = [];
      const vars = [];

      csvData.forEach(({ eventName, variables }) => {
        triggers.push({
          accountId: "6247820543",
          containerId: "194603635",
          triggerId: `${Math.floor(Math.random() * 1000)}`,
          name: `CUST - ${eventName}`,
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
                  value: eventName,
                },
              ],
            },
          ],
          fingerprint: Date.now().toString(),
        });

        variables.forEach((variable) => {
          vars.push({
            accountId: "6247820543",
            containerId: "194603635",
            variableId: `${Math.floor(Math.random() * 1000)}`,
            name: `DLV - ${variable}`,
            type: "v",
            parameter: [
              {
                type: "INTEGER",
                key: "dataLayerVersion",
                value: "2",
              },
              {
                type: "BOOLEAN",
                key: "setDefaultValue",
                value: "false",
              },
              {
                type: "TEMPLATE",
                key: "name",
                value: variable,
              },
            ],
            fingerprint: Date.now().toString(),
            formatValue: {},
          });
        });
      });

      const json = JSON.stringify(jsonObj(triggers, vars), null, 2);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gtm_variables_and_triggers.json";
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
    <div className="container mx-auto">
      <Card className="mb-8">
        <CardHeader className="px-7 text-xl">
          <h3 className="font-semibold">Importer un fichier CSV</h3>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
          />
          <div>
            <h4 className="font-semibold mb-2">Format CSV attendu :</h4>
            <pre className="bg-gray-800 text-white p-4 rounded language-csv">
              <code className="w-full">
                nom_evenement,variable1 variable2 variable3
                <br />
                submit_demo_request,user_phone user_email user_nb_employee
                <br />
                view_session_overview,session_name session_id
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 && (
        <Card className="mb-8">
          <CardHeader className="px-7 text-xl">
            <h3 className="font-semibold">Données CSV importées</h3>
          </CardHeader>
          <CardContent>
            <ul>
              {csvData.map((item, index) => (
                <li key={index}>
                  <strong>{item.eventName}</strong>: {item.variables.join(", ")}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-2">
        <Button
          onClick={generateAndDownloadGTMVariables}
          disabled={isExporting || csvData.length === 0}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting
            ? "Exportation en cours..."
            : "Générer et Télécharger le JSON"}
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

export default GTMVariableGenerator;
