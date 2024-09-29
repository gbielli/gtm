import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export const SuccessAlert = ({ isVisible }) => (
  <Alert
    className={`fixed bottom-4 right-4 w-96 bg-green-500 text-white transition-opacity duration-300 ${
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <CheckCircledIcon color="white" className="h-4 w-4" />
    <AlertTitle>Succès</AlertTitle>
    <AlertDescription>
      Le fichier JSON a été généré et téléchargé avec succès.
    </AlertDescription>
  </Alert>
);
