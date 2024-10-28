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

  const sanitizeVariableName = (name) => {
    // Remplacer les caractères spéciaux par des underscores
    return name.replace(/[\[\]\/\s]/g, "_");
  };

  const generateAndDownloadGTMVariables = async () => {
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
        // Récupérer la clé d'origine pour l'utiliser comme nom de variable
        const originalKey = line.trim();
        // Nettoyer la clé pour l'utilisation dans GTM
        const sanitizedKey = sanitizeVariableName(originalKey);

        // Par défaut, on considère que c'est une variable globale
        let nameValue = originalKey;

        // Vérifier si la ligne contient un type spécifique
        if (line.toLowerCase().includes("user")) {
          nameValue = `user_data.${sanitizedKey}`;
        } else if (line.toLowerCase().includes("ecommerce")) {
          nameValue = `ecommerce.${sanitizedKey}`;
        }

        return {
          accountId: "6247820543",
          containerId: "194603635",
          variableId: `${Math.floor(Math.random() * 1000)}`,
          name: `DLV - ${nameValue}`,
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
          <h3 className="font-semibold">Renseignez vos clés et types</h3>
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
                user_name user{" "}
                <span className="text-gray-400">
                  {"/* créer une variable user_data.user_name  */"}
                </span>
                <br />
                value ecommerce{" "}
                <span className="text-gray-400">
                  {"/* créer une variable ecommerce.value  */"}
                </span>
                <br />
                page_category{" "}
                <span className="text-gray-400">
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
