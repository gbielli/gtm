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
  const [showErrorAlert, setShowErrorAlert] = useState(false); // new state for error alert

  const generateAndDownloadGTMVariables = async () => {
    setIsExporting(true);
    setError("");
    setShowErrorAlert(false); // hide error alert on retry
    try {
      const lines = input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      if (lines.length === 0) {
        throw new Error("Aucune entrée trouvée");
      }

      const gtmVariables = lines.map((line) => {
        const [key, type] = line.split(/\s+|\t+/).map((item) => item.trim());
        let nameValue = key;

        if (type === "user") {
          nameValue = `user_data.${key}`;
        } else if (type === "ecommerce") {
          nameValue = `ecommerce.${key}`;
        }

        return {
          accountId: "6247820543",
          containerId: "194603635",
          variableId: `${Math.floor(Math.random() * 1000)}`,
          name: `DLV - ${key}`,
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
              value: nameValue,
            },
          ],
          fingerprint: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
          formatValue: {},
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
          <h3 className="font-semibold">Renseignez vos clés et types</h3>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="nom du paramètre [espace] ecommerce/user/global"
          />
          <div>
            <h3>Exemple</h3>
            <pre className="bg-gray-800 text-white p-4 rounded language-json">
              <code className="language-json">
                user_name user{" "}
                <span className="text-green-500">
                  {"/* créer une variable user_data.user_name  */"}
                </span>
                <br />
                value ecommerce{" "}
                <span className="text-green-500">
                  {"/* créer une variable ecommerce.value  */"}
                </span>
                <br />
                page_category{" "}
                <span className="text-green-500">
                  {"/* créer une variable page_category  */"}
                </span>
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
            : "Générer et Télécharger le JSON"}
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
          description="Le fichier a été téléchargé dans votre téléphone"
          type="success"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default GTMVariableGenerator;
