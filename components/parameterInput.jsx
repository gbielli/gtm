import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

// Assurez-vous que parameterDescriptions est importé ou défini quelque part
import { parameterDescriptions } from "@/lib/facebookParamsList";

export const ParameterInput = ({ param, value, onChange, placeholder }) => {
  const description = parameterDescriptions[param];

  return (
    <div className="flex items-center space-x-2">
      <Label
        htmlFor={`facebook-param-${param}`}
        className="w-1/3 flex items-center"
      >
        {param}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <QuestionMarkCircledIcon className="h-4 w-4 ml-1 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Input
        id={`facebook-param-${param}`}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(param, e.target.value)}
        placeholder={placeholder}
        className="w-2/3"
      />
    </div>
  );
};
