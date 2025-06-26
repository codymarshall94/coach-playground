import { SortAsc } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const SortPopover = ({
  sortKey,
  setSortKey,
}: {
  sortKey: "recovery" | "fatigue" | "name";
  setSortKey: (sortKey: "recovery" | "fatigue" | "name") => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2">
          <SortAsc className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" text-sm">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setSortKey("name")}
          >
            Name
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setSortKey("fatigue")}
          >
            Fatigue (High → Low)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setSortKey("recovery")}
          >
            Recovery (Low → High)
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
