import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FIELD_INFO } from "@/constants/exercise-info";
import { HelpCircle } from "lucide-react";

export const InfoIcon = ({ field }: { field: keyof typeof FIELD_INFO }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="w-3 h-3 ml-1 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{FIELD_INFO[field].description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
