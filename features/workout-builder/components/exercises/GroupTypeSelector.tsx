import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WorkoutExerciseGroup } from "@/types/Workout";
import { AnimatePresence } from "framer-motion";
import { motion } from "motion/react";
import { useState } from "react";

export const GROUP_CONFIG: Record<
  WorkoutExerciseGroup["type"],
  {
    label: string;
    color: string;
    borderColor: string;
    description: string;
    maxExercises: number;
  }
> = {
  standard: {
    label: "Standard",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    borderColor: "border-gray-300",
    description: "Individual exercises performed with standard rest periods.",
    maxExercises: 1,
  },
  superset: {
    label: "Superset",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    borderColor: "border-blue-500",
    description: "Two exercises done back to back without rest.",
    maxExercises: 2,
  },
  giant_set: {
    label: "Giant Set",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    borderColor: "border-yellow-500",
    description:
      "3+ exercises for the same muscle group performed consecutively.",
    maxExercises: 3,
  },

  circuit: {
    label: "Circuit",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    borderColor: "border-green-500",
    description: "A full-body rotation with minimal rest between exercises.",
    maxExercises: 6,
  },
};

export function GroupTypeSelector({
  groupType,
  onGroupTypeChange,
}: {
  groupType: WorkoutExerciseGroup["type"];
  onGroupTypeChange: (groupType: WorkoutExerciseGroup["type"]) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentConfig = GROUP_CONFIG[groupType];

  const handleTypeChange = (type: WorkoutExerciseGroup["type"]) => {
    onGroupTypeChange(type);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Badge
            className={cn(
              "cursor-pointer transition-all duration-200 border-0",
              currentConfig.color
            )}
          >
            <motion.span
              key={groupType}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentConfig.label}
            </motion.span>
          </Badge>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          <h3 className="font-semibold mb-3 text-sm">Choose Group Type</h3>
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {Object.entries(GROUP_CONFIG).map(([type, config]) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <motion.button
                    onClick={() =>
                      handleTypeChange(type as WorkoutExerciseGroup["type"])
                    }
                    className={cn(
                      "w-full text-left p-3 rounded-lg border-2 transition-all duration-200",
                      groupType === type
                        ? `${config.borderColor.replace(
                            "border-",
                            "border-"
                          )} bg-opacity-20`
                        : "border-transparent hover:border-gray-200",
                      config.color.replace("hover:", "")
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          {config.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {config.description}
                        </div>
                      </div>
                      <AnimatePresence>
                        {groupType === type && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                            className="w-2 h-2 bg-current rounded-full"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
