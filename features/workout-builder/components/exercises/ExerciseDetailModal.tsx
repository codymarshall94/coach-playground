"use client";

import { InfoTooltip } from "@/components/InfoTooltip";
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
import type { Exercise } from "@/types/Exercise";
import { getPrimaryAndSecondaryMuscles } from "@/utils/muscles/getPrimaryAndSecondaryMuscles";
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
  BarChart3,
} from "lucide-react";
import { MuscleActivationChart } from "../insights/MuscleActivationChart";

export function ExerciseDetailModal({ exercise }: { exercise: Exercise }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-50 text-green-700 border-green-200";
      case "intermediate":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "advanced":
        return "bg-gray-800 text-white border-gray-700";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getEnergySystemIcon = (system: string) => {
    switch (system.toLowerCase()) {
      case "aerobic":
        return <Heart className="w-4 h-4 text-gray-600" />;
      case "anaerobic":
        return <Zap className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const { primary, secondary } = getPrimaryAndSecondaryMuscles(
    exercise.activation_map
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-green-50 hover:border-green-200 bg-transparent"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              {exercise.name}
            </DialogTitle>
            <Badge
              className={`${getDifficultyColor(
                exercise.load_profile
              )} px-3 py-1 text-sm font-medium`}
            >
              {exercise.load_profile}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 p-1 rounded-lg mb-6">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="anatomy"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
            >
              Anatomy
            </TabsTrigger>
            <TabsTrigger
              value="technique"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
            >
              Technique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fatigue Demands Card */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-gray-600" />
                    </div>
                    Fatigue Demands
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        CNS Demand <InfoTooltip field="cnsDemand" />
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(exercise.cns_demand * 10).toFixed(1)}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exercise.cns_demand * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Metabolic Demand <InfoTooltip field="metabolicDemand" />
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(exercise.metabolic_demand * 10).toFixed(1)}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exercise.metabolic_demand * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Joint Stress <InfoTooltip field="jointStress" />
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(exercise.joint_stress * 10).toFixed(1)}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exercise.joint_stress * 10}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Card */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                    </div>
                    Exercise Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Recovery Time <InfoTooltip field="recoveryDays" />
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {exercise.recovery_days} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Calorie Burn <InfoTooltip field="baseCalorieCost" />
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {exercise.base_calorie_cost} kcal
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getEnergySystemIcon(exercise.energy_system)}
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Energy System <InfoTooltip field="energySystem" />
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {exercise.energy_system}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anatomy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BoneIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    Muscle Activation
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Percentage breakdown of muscle activation during this
                    exercise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MuscleActivationChart
                    activationMap={exercise.activation_map}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Primary Muscles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {primary.map((m, i) => (
                        <Badge
                          key={i}
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {
                            MUSCLE_DISPLAY_MAP[
                              m as keyof typeof MUSCLE_DISPLAY_MAP
                            ]
                          }
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Secondary Muscles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {secondary.map((m, i) => (
                        <Badge
                          key={i}
                          className="bg-gray-100 text-gray-700 border-gray-200"
                        >
                          {
                            MUSCLE_DISPLAY_MAP[
                              m as keyof typeof MUSCLE_DISPLAY_MAP
                            ]
                          }
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Movement Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Load Profile <InfoTooltip field="loadProfile" />
                      </span>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {exercise.load_profile}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Force Curve <InfoTooltip field="forceCurve" />
                      </span>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {exercise.force_curve}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        ROM Rating <InfoTooltip field="romRating" />
                      </span>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {exercise.rom_rating}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technique" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                    </div>
                    Technique Cues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exercise.cues.map((cue, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-green-600">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {cue}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      Exercise Variations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {exercise.variations.map((v, i) => (
                        <Badge
                          key={i}
                          className="bg-gray-100 text-gray-700 border-gray-200 text-xs"
                        >
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {exercise.contra_indications.length > 0 && (
                  <Card className="border border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-red-800 flex gap-2 items-center">
                        <AlertTriangle className="w-4 h-4" />
                        Contraindications
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        Consult a professional if any of these conditions apply
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {exercise.contra_indications.map((c, i) => (
                          <Badge
                            key={i}
                            className="bg-red-100 text-red-800 border-red-200 text-xs"
                          >
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {exercise.external_links.length > 0 && (
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                        External Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {exercise.external_links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
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
