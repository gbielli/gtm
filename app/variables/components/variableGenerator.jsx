"use client";

import { Notification } from "@/components/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { jsonObj } from "@/lib/createVariablesJson";
import { Download } from "lucide-react";
import { useState } from "react";

const GTMVariableGenerator = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const generateAndDownloadGTMVariables = async () => {
    setIsExporting(true);
    setError("");
    setShowErrorAlert(false);

    try {
      const lines = input
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        throw new Error("Aucune entrée trouvée");
      }

      const gtmVariables = lines.map((line) => ({
        accountId: "6247820543",
        containerId: "194603635",
        variableId: `${Math.floor(Math.random() * 1000)}`,
        name: `DLV - ${line}`,
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
            value: line,
          },
        ],
        fingerprint: `${Date.now()}${Math.floor(
          Math.random() * 1000
        )}`.substring(0, 13),
        formatValue: {},
      }));

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
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err) {
      setError(err.message);
      setShowErrorAlert(true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="">
      <Card className="container mx-auto mb-8">
        <CardHeader className="px-7 text-xl">
          <h3 className="font-semibold">Renseignez vos clés</h3>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Entrez vos variables (une par ligne)"
          />
          <div>
            <h3 className="mb-2">Exemples de format accepté :</h3>
            <pre className="bg-gray-800 text-sm text-white p-4 rounded language-json">
              <code className="language-json">
                user_data.user_name
                <br />
                ecommerce.value
                <br />
                page_category
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button
          onClick={generateAndDownloadGTMVariables}
          disabled={isExporting}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting
            ? "Exportation en cours..."
            : "Télécharger les variables"}
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
