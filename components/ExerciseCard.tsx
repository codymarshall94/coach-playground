import { ExerciseDetailModal } from "@/components/ExerciseDetailModal";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/data/exercises";
import { Activity, AlertTriangle, Brain, Clock, Zap } from "lucide-react";

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: () => void;
}

export const ExerciseCard = ({ exercise, onAdd }: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue <= 3) return "text-green-600";
    if (fatigue <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <div
        className={`
        group relative p-4 bg-white border border-gray-200 rounded-xl shadow-sm
        hover:shadow-lg hover:border-gray-300 transition-all duration-200
         mb-3
      `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {exercise.name}
              </h3>
              {exercise.aliases?.[0] && (
                <span className="text-xs text-gray-400">
                  ({exercise.aliases[0]})
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{exercise.recoveryDays}d recovery</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap
                  className={`w-4 h-4 ${getFatigueColor(
                    exercise.fatigue.index * 10
                  )}`}
                />
                <span className={getFatigueColor(exercise.fatigue.index * 10)}>
                  {(exercise.fatigue.index * 10).toFixed(1)}/10 Fatigue
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              {exercise.loadProfile.toUpperCase()} •{" "}
              {exercise.movementPlane.toUpperCase()} • {exercise.forceCurve}{" "}
              curve
            </div>

            <div className="flex flex-wrap gap-1 mt-2 text-[10px] font-medium text-gray-600">
              {exercise.compound && (
                <span className="px-1 py-0.5 bg-gray-100 rounded">
                  Compound
                </span>
              )}
              {exercise.unilateral && (
                <span className="px-1 py-0.5 bg-gray-100 rounded">
                  Unilateral
                </span>
              )}
              {exercise.ballistic && (
                <span className="px-1 py-0.5 bg-orange-100 text-orange-800 rounded">
                  Ballistic
                </span>
              )}
              <span className="px-1 py-0.5 bg-gray-100 rounded capitalize">
                ROM: {exercise.romRating}
              </span>
              <span className="px-1 py-0.5 bg-gray-100 rounded">
                Skill: {exercise.skillRequirement}
              </span>
            </div>

            <div className="flex gap-3 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>CNS: {(exercise.fatigue.cnsDemand * 10).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>
                  Met: {(exercise.fatigue.metabolicDemand * 10).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>
                  Joint: {(exercise.fatigue.jointStress * 10).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {exercise.category}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                  exercise.skillRequirement
                )}`}
              >
                {exercise.skillRequirement}
              </span>
            </div>
          </div>
          <Button onClick={onAdd} variant="outline">
            Add
          </Button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <ExerciseDetailModal exercise={exercise} />
      </div>
    </div>
  );
};
