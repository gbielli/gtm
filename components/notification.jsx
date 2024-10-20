import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export const Notification = ({ type, isVisible, title, description }) => (
  <Alert
    className={`fixed bottom-4 right-4 w-96 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }  text-white transition-opacity duration-300 ${
      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    {type === "success" ? (
      <CheckCircledIcon color="white" className="h-4 w-4" />
    ) : (
      <ExclamationTriangleIcon color="white" className="h-4 w-4" />
    )}
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);
