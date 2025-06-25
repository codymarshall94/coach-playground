"use client";

import { InfoIcon } from "@/components/InfoIcon";
import { MuscleActivationChart } from "@/components/MuscleActivationChart";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Exercise } from "@/data/exercises";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Clock,
  ExternalLink,
  Flame,
  Heart,
  BoneIcon as Muscle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export function ExerciseDetailModal({ exercise }: { exercise: Exercise }) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-3 hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                {exercise.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                <span className="font-medium">Also known as:</span>{" "}
                {exercise.aliases.join(", ")}
              </DialogDescription>
            </div>
            <Badge
              className={`${getDifficultyColor(exercise.loadProfile)} border`}
            >
              {exercise.loadProfile}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{exercise.recoveryDays} days</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Flame className="w-4 h-4" />
              <span>{exercise.baseCalorieCost} kcal/set</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              {getEnergySystemIcon(exercise.energySystem)}
              <span>{exercise.energySystem}</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-gray-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="anatomy"
              className="data-[state=active]:bg-white"
            >
              <Muscle className="w-4 h-4 mr-2" />
              Anatomy
            </TabsTrigger>
            <TabsTrigger
              value="technique"
              className="data-[state=active]:bg-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Technique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Fatigue Demands
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressIndicator
                    value={exercise.fatigue.cnsDemand * 10}
                    label="CNS Demand"
                    max={10}
                  />
                  <ProgressIndicator
                    value={exercise.fatigue.metabolicDemand * 10}
                    label="Metabolic Demand"
                    max={10}
                  />
                  <ProgressIndicator
                    value={exercise.fatigue.jointStress * 10}
                    label="Joint Stress"
                    max={10}
                  />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Exercise Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getEnergySystemIcon(exercise.energySystem)}
                      <span className="font-medium">Energy System</span>
                      <InfoIcon field="energySystem" />
                    </div>
                    <Badge variant="secondary">{exercise.energySystem}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Recovery Time</span>
                    </div>
                    <Badge variant="outline">
                      {exercise.recoveryDays} days
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">Calorie Burn</span>
                    </div>
                    <Badge variant="outline">
                      {exercise.baseCalorieCost} kcal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anatomy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    Muscle Activation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MuscleActivationChart
                    activationMap={exercise.activationMap}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Primary Muscles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {exercise.primaryMuscles.map((muscle, i) => (
                        <Badge
                          key={i}
                          className="bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Secondary Muscles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {exercise.secondaryMuscles.map((muscle, i) => (
                        <Badge key={i} variant="secondary">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Movement Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Load Profile</span>
                        <InfoIcon field="loadProfile" />
                      </div>
                      <Badge variant="outline">{exercise.loadProfile}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Force Curve</span>
                        <InfoIcon field="forceCurve" />
                      </div>
                      <Badge variant="outline">{exercise.forceCurve}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ROM Rating</span>
                        <InfoIcon field="romRating" />
                      </div>
                      <Badge variant="outline">{exercise.romRating}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technique" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Technique Cues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exercise.cues.map((cue, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{cue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Variations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {exercise.variations.map((variation, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {variation}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {exercise.contraIndications.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="w-5 h-5" />
                        Contraindications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {exercise.contraIndications.map((contra, i) => (
                          <Badge
                            key={i}
                            className="bg-orange-200 text-orange-800"
                          >
                            {contra}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {exercise.externalLinks.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-green-600" />
                        External Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {exercise.externalLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors group"
                          >
                            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{link.label}</span>
                          </a>
                        ))}
                      </div>
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
