"use client";

import { InfoIcon } from "@/components/InfoIcon";
import { MuscleActivationChart } from "@/components/MuscleActivationChart";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MUSCLE_DISPLAY_MAP } from "@/constants/muscles";
import type { EXERCISES } from "@/data/exercises";
import { getPrimaryAndSecondaryMuscles } from "@/utils/getPrimaryAndSecondaryMuscles";
import {
  Activity,
  AlertTriangle,
  BoneIcon,
  BookOpen,
  Clock,
  ExternalLink,
  Eye,
  Flame,
  Heart,
  Target,
  Zap,
} from "lucide-react";

export function ExerciseDetailModal({
  exercise,
}: {
  exercise: (typeof EXERCISES)[number];
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "border-green-300 text-green-700 bg-green-50";
      case "intermediate":
        return "border-yellow-300 text-yellow-700 bg-yellow-50";
      case "advanced":
        return "border-red-300 text-red-700 bg-red-50";
      default:
        return "border-gray-300 text-gray-700 bg-gray-50";
    }
  };

  const getEnergySystemIcon = (system: string) => {
    switch (system.toLowerCase()) {
      case "aerobic":
        return <Heart className="w-4 h-4" />;
      case "anaerobic":
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const { primary, secondary } = getPrimaryAndSecondaryMuscles(
    exercise.activationMap
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {exercise.name}
            <Badge
              className={
                getDifficultyColor(exercise.loadProfile) +
                " border text-xs ml-auto"
              }
            >
              {exercise.loadProfile}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-3 bg-muted mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="anatomy">Anatomy</TabsTrigger>
            <TabsTrigger value="technique">Technique</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Fatigue Demands
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressIndicator
                    value={exercise.fatigue.cnsDemand * 10}
                    label="CNS Demand"
                    max={10}
                    field="cnsDemand"
                  />
                  <ProgressIndicator
                    value={exercise.fatigue.metabolicDemand * 10}
                    label="Metabolic Demand"
                    max={10}
                    field="metabolicDemand"
                  />
                  <ProgressIndicator
                    value={exercise.fatigue.jointStress * 10}
                    label="Joint Stress"
                    max={10}
                    field="jointStress"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Recovery Time{" "}
                      <InfoIcon field="recoveryDays" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {exercise.recoveryDays} days
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Flame className="w-4 h-4" /> Calorie Burn{" "}
                      <InfoIcon field="baseCalorieCost" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {exercise.baseCalorieCost} kcal
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      {getEnergySystemIcon(exercise.energySystem)} Energy System{" "}
                      <InfoIcon field="energySystem" />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {exercise.energySystem}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anatomy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BoneIcon className="w-5 h-5 text-primary" /> Activation Map
                  </CardTitle>
                  <CardDescription>
                    The activation map shows the percentage of the exercise that
                    is used to activate each muscle.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MuscleActivationChart
                    activationMap={exercise.activationMap}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Primary Muscles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {primary.map((m, i) => (
                      <Badge key={i} variant="secondary">
                        {
                          MUSCLE_DISPLAY_MAP[
                            m as keyof typeof MUSCLE_DISPLAY_MAP
                          ]
                        }
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Secondary Muscles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {secondary.map((m, i) => (
                      <Badge key={i} variant="outline">
                        {
                          MUSCLE_DISPLAY_MAP[
                            m as keyof typeof MUSCLE_DISPLAY_MAP
                          ]
                        }
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Movement Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        Load Profile <InfoIcon field="loadProfile" />
                      </span>
                      <Badge variant="outline">{exercise.loadProfile}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        Force Curve <InfoIcon field="forceCurve" />
                      </span>
                      <Badge variant="outline">{exercise.forceCurve}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium flex items-center gap-1">
                        ROM Rating <InfoIcon field="romRating" />
                      </span>
                      <Badge variant="outline">{exercise.romRating}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technique">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Technique Cues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {exercise.cues.map((cue, i) => (
                    <div
                      key={i}
                      className="text-sm text-muted-foreground pl-2 border-l-2 border-muted"
                    >
                      {cue}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Variations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {exercise.variations.map((v, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                {exercise.contraIndications.length > 0 && (
                  <Card className="border border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-sm text-orange-800 flex gap-2 items-center">
                        <AlertTriangle className="w-4 h-4" /> Contraindications
                      </CardTitle>
                      <CardDescription>
                        Exercises may not be suitable under certain conditions
                        or injuries. If any of the following apply, consult a
                        coach or medical professional before performing.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {exercise.contraIndications.map((c, i) => (
                        <Badge
                          key={i}
                          className="bg-orange-200 text-orange-800 text-xs"
                        >
                          {c}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {exercise.externalLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />{" "}
                        External Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {exercise.externalLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary underline hover:opacity-80"
                        >
                          {link.label}
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
