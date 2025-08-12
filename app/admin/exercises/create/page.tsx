"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Equipment,
  Exercise,
  ExerciseCategory,
  MovementPlane,
} from "@/types/Exercise";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Dumbbell,
  Info,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

function generateExerciseId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .trim()
    .replace(/\s+/g, "_"); // replace spaces with underscores
}

const defaultExercise: Partial<Exercise> = {
  id: "",
  name: "",
  aliases: [],
  category: "other",
  movement_plane: "sagittal",
  load_profile: "mixed",
  equipment: [],
  skill_requirement: "low",
  compound: false,
  unilateral: false,
  ballistic: false,
  rom_rating: "medium",
  force_curve: "flat",
  ideal_rep_range: [5, 10],
  cns_demand: 0,
  fatigue_index: 0,
  intensity_ceiling: 0,
  recovery_days: 0,
  base_calorie_cost: 8,
  activation_map: {},
  energy_system: "Glycolytic",
  volume_per_set: { strength: 100, hypertrophy: 80 },
  cues: [],
  variations: [],
  contra_indications: [],
  external_links: [],
};

const categories: {
  value: ExerciseCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "squat",
    label: "Squat",
    description: "Knee-dominant movement patterns",
  },
  {
    value: "hinge",
    label: "Hip Hinge",
    description: "Hip-dominant movement patterns",
  },
  {
    value: "lunge",
    label: "Lunge",
    description: "Single-leg movement patterns",
  },
  {
    value: "push_horizontal",
    label: "Horizontal Push",
    description: "Pushing away from body",
  },
  {
    value: "push_vertical",
    label: "Vertical Push",
    description: "Pushing overhead",
  },
  {
    value: "pull_horizontal",
    label: "Horizontal Pull",
    description: "Pulling toward body",
  },
  {
    value: "pull_vertical",
    label: "Vertical Pull",
    description: "Pulling from overhead",
  },
  {
    value: "hinge_horizontal",
    label: "Horizontal Hinge",
    description: "Horizontal hip hinge patterns",
  },
  { value: "carry", label: "Carry", description: "Loaded carrying movements" },
  { value: "jump", label: "Jump", description: "Explosive jumping movements" },
  { value: "brace", label: "Brace", description: "Core stability and bracing" },
  { value: "other", label: "Other", description: "Miscellaneous exercises" },
];

const equipmentOptions: { value: Equipment; label: string; icon: string }[] = [
  { value: "barbell", label: "Barbell", icon: "🏋️" },
  { value: "rack", label: "Rack", icon: "🏗️" },
  { value: "bench", label: "Bench", icon: "🪑" },
  { value: "box", label: "Box", icon: "📦" },
  { value: "pause", label: "Pause", icon: "⏸️" },
  { value: "bar", label: "Bar", icon: "➖" },
  { value: "kettlebell", label: "Kettlebell", icon: "🔔" },
  { value: "cable", label: "Cable", icon: "🔗" },
  { value: "dumbbell", label: "Dumbbell", icon: "💪" },
  { value: "machine", label: "Machine", icon: "⚙️" },
  { value: "bodyweight", label: "Bodyweight", icon: "🧘" },
  { value: "other", label: "Other", icon: "❓" },
];

const movementPlanes: {
  value: MovementPlane;
  label: string;
  description: string;
}[] = [
  {
    value: "sagittal",
    label: "Sagittal",
    description: "Forward/backward movement",
  },
  { value: "frontal", label: "Frontal", description: "Side-to-side movement" },
  {
    value: "transverse",
    label: "Transverse",
    description: "Rotational movement",
  },
];

const skillLevels = [
  { value: "low", label: "Low", description: "Easy to learn and perform" },
  {
    value: "medium",
    label: "Medium",
    description: "Moderate technical requirements",
  },
  { value: "high", label: "High", description: "Complex movement patterns" },
];

const loadProfiles = [
  { value: "axial", label: "Axial", description: "Load through spine" },
  {
    value: "anterior",
    label: "Anterior",
    description: "Load in front of body",
  },
  { value: "posterior", label: "Posterior", description: "Load behind body" },
  { value: "mixed", label: "Mixed", description: "Variable load positioning" },
];

function calculateDerivedMetrics(
  exercise: Partial<Exercise>
): Partial<Exercise> {
  const {
    compound,
    skill_requirement,
    force_curve,
    load_profile,
    ballistic,
    ideal_rep_range,
    equipment,
  } = exercise;

  const highSkill = skill_requirement === "high";
  const axialLoad = load_profile === "axial";
  const isMachine = equipment?.includes("machine");
  const isCable = equipment?.includes("cable");

  const cns_demand = Math.min(
    1,
    (compound ? 0.4 : 0) +
      (highSkill ? 0.2 : 0) +
      (axialLoad ? 0.2 : 0) +
      (force_curve === "ascending" ? 0.1 : 0)
  );

  const intensity_ceiling = isMachine || isCable ? 0.75 : 0.9;

  const fatigue_index = Math.min(
    1,
    (compound ? 0.3 : 0.1) +
      (ballistic ? 0.2 : 0) +
      ((ideal_rep_range?.[1] ?? 10) > 8 ? 0.2 : 0.1)
  );

  const recovery_days = 0.5 + cns_demand + fatigue_index;

  return {
    cns_demand,
    intensity_ceiling,
    fatigue_index,
    recovery_days: Math.min(7, Math.round(recovery_days * 10) / 10),
  };
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  percentage,
}: {
  title: string;
  value: string;
  icon: any;
  description: string;
  percentage: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <Progress value={percentage} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function CreateExerciseAdminPage() {
  const [exercise, setExercise] = useState<Partial<Exercise>>(defaultExercise);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (key: keyof Exercise, value: any) => {
    const updated = { ...exercise, [key]: value };
    const derived = calculateDerivedMetrics(updated);
    const finalExercise = { ...updated, ...derived };
    setExercise(finalExercise);

    // Basic validation
    setIsValid(!!(finalExercise.name && finalExercise.category));
  };

  const handleToggle = (key: keyof Exercise) => {
    const updated = { ...exercise, [key]: !exercise[key] };
    const derived = calculateDerivedMetrics(updated);
    setExercise({ ...updated, ...derived });
  };

  const handleSubmit = () => {
    console.log("Submit", exercise);
    // TODO: call backend API
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Exercise
          </h1>
          <p className="text-muted-foreground mt-1">
            Define a new exercise with its movement patterns and characteristics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Ready to save
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Incomplete
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about the exercise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Exercise Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Barbell Back Squat"
                    value={exercise.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      handleChange("name", name);
                      handleChange("id", generateExerciseId(name));
                    }}
                  />
                  {exercise.id && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Generated ID:{" "}
                      <code className="bg-muted px-1 py-0.5 rounded">
                        {exercise.id}
                      </code>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={exercise.category}
                    onValueChange={(val) => handleChange("category", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div>
                            <div className="font-medium">{cat.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {cat.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="movement-plane">Movement Plane</Label>
                  <Select
                    value={exercise.movement_plane}
                    onValueChange={(val) => handleChange("movement_plane", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plane" />
                    </SelectTrigger>
                    <SelectContent>
                      {movementPlanes.map((plane) => (
                        <SelectItem key={plane.value} value={plane.value}>
                          <div>
                            <div className="font-medium">{plane.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {plane.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skill-requirement">Skill Requirement</Label>
                  <Select
                    value={exercise.skill_requirement}
                    onValueChange={(val) =>
                      handleChange("skill_requirement", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((skill) => (
                        <SelectItem key={skill.value} value={skill.value}>
                          <div>
                            <div className="font-medium capitalize">
                              {skill.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {skill.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="load-profile">Load Profile</Label>
                  <Select
                    value={exercise.load_profile}
                    onValueChange={(val) => handleChange("load_profile", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select load profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadProfiles.map((profile) => (
                        <SelectItem key={profile.value} value={profile.value}>
                          <div>
                            <div className="font-medium">{profile.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {profile.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="aliases">Alternative Names</Label>
                  <Input
                    id="aliases"
                    placeholder="e.g., Back Squat, High Bar Squat (comma separated)"
                    value={exercise.aliases?.join(", ")}
                    onChange={(e) =>
                      handleChange(
                        "aliases",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movement Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Movement Characteristics
              </CardTitle>
              <CardDescription>
                Define the movement patterns and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compound"
                    checked={exercise.compound}
                    onCheckedChange={() => handleToggle("compound")}
                  />
                  <Label htmlFor="compound" className="text-sm font-medium">
                    Compound Movement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unilateral"
                    checked={exercise.unilateral}
                    onCheckedChange={() => handleToggle("unilateral")}
                  />
                  <Label htmlFor="unilateral" className="text-sm font-medium">
                    Unilateral
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ballistic"
                    checked={exercise.ballistic}
                    onCheckedChange={() => handleToggle("ballistic")}
                  />
                  <Label htmlFor="ballistic" className="text-sm font-medium">
                    Ballistic/Explosive
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rep-range-min">Ideal Rep Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="rep-range-min"
                      type="number"
                      placeholder="Min"
                      value={exercise.ideal_rep_range?.[0] || ""}
                      onChange={(e) => {
                        const min = Number.parseInt(e.target.value) || 0;
                        const max = exercise.ideal_rep_range?.[1] || 10;
                        handleChange("ideal_rep_range", [min, max]);
                      }}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={exercise.ideal_rep_range?.[1] || ""}
                      onChange={(e) => {
                        const max = Number.parseInt(e.target.value) || 10;
                        const min = exercise.ideal_rep_range?.[0] || 0;
                        handleChange("ideal_rep_range", [min, max]);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Equipment Required
              </CardTitle>
              <CardDescription>
                Select all equipment needed for this exercise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {equipmentOptions.map((eq) => (
                  <div key={eq.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={eq.value}
                      checked={exercise.equipment?.includes(eq.value)}
                      onCheckedChange={(checked) => {
                        const newEq = checked
                          ? [...(exercise.equipment ?? []), eq.value]
                          : (exercise.equipment ?? []).filter(
                              (e) => e !== eq.value
                            );
                        handleChange("equipment", newEq);
                      }}
                    />
                    <Label
                      htmlFor={eq.value}
                      className="text-sm flex items-center gap-1"
                    >
                      <span>{eq.icon}</span>
                      {eq.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Coaching cues and additional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cues">Coaching Cues</Label>
                <Textarea
                  id="cues"
                  placeholder="Enter coaching cues, one per line&#10;e.g., Keep chest up&#10;Drive through heels&#10;Maintain neutral spine"
                  rows={4}
                  value={exercise.cues?.join("\n")}
                  onChange={(e) =>
                    handleChange(
                      "cues",
                      e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Calculated Metrics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Auto-calculated based on exercise characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricCard
                title="CNS Demand"
                value={exercise.cns_demand?.toFixed(2) || "0.00"}
                icon={Zap}
                description="Central nervous system stress"
                percentage={(exercise.cns_demand || 0) * 100}
              />

              <MetricCard
                title="Fatigue Index"
                value={exercise.fatigue_index?.toFixed(2) || "0.00"}
                icon={Activity}
                description="How much fatigue this exercise generates"
                percentage={(exercise.fatigue_index || 0) * 100}
              />

              <MetricCard
                title="Intensity Ceiling"
                value={`${((exercise.intensity_ceiling || 0) * 100).toFixed(
                  0
                )}%`}
                icon={TrendingUp}
                description="Maximum safe intensity level"
                percentage={(exercise.intensity_ceiling || 0) * 100}
              />

              <MetricCard
                title="Recovery Time"
                value={`${exercise.recovery_days?.toFixed(1) || "0.0"} days`}
                icon={Clock}
                description="Recommended recovery period"
                percentage={Math.min(
                  ((exercise.recovery_days || 0) / 7) * 100,
                  100
                )}
              />
            </CardContent>
          </Card>

          {/* Selected Equipment Preview */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.equipment.map((eq) => {
                    const equipmentInfo = equipmentOptions.find(
                      (e) => e.value === eq
                    );
                    return (
                      <Badge key={eq} variant="secondary" className="text-xs">
                        {equipmentInfo?.icon} {equipmentInfo?.label}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="lg"
          className="min-w-32"
        >
          {isValid ? "Save Exercise" : "Complete Required Fields"}
        </Button>
      </div>
    </div>
  );
}
