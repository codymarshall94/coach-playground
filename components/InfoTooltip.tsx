import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FIELD_INFO } from "@/constants/exercise-info";
import { HelpCircle } from "lucide-react";

export const InfoTooltip = ({
  field,
  text,
}: {
  field?: keyof typeof FIELD_INFO;
  text?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">
            {field ? FIELD_INFO[field].description : text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
