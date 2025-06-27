"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, Bolt, Bone, Brain, Flame, Info } from "lucide-react";

export default function HowWeScoreExercisesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollArea className="p-8 max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            HOW WE SCORE EXERCISES
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
            Our exercise scoring system is designed to reflect how a movement
            impacts your body across multiple dimensions — fatigue, recovery
            demand, joint stress, neurological load, and metabolic cost. Here's
            how we quantify those attributes to give you clarity, structure, and
            actionable insights with every movement you program.
          </p>
        </div>

        {/* Fatigue Index Section */}
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <Bolt className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Fatigue Index (0–1)</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            The fatigue index estimates the overall toll of a set on your body,
            combining central nervous system (CNS) demand, metabolic stress,
            joint strain, and range of motion.
          </p>
          <div className="text-gray-400 space-y-1">
            <div>• 0.9+ → Max-effort compound lifts</div>
            <div>• 0.5–0.7 → Most hypertrophy work</div>
            <div>• &lt; 0.4 → Warmups, accessories, recovery sets</div>
          </div>
        </section>

        {/* CNS Demand Section */}
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">CNS Demand (0–1)</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Reflects how neurologically taxing a lift is. High CNS demand comes
            from heavy, skillful, or explosive movements.
          </p>
          <p className="text-gray-400">
            Deadlifts, cleans, and low-rep overhead presses tend to score 0.8+.
          </p>
        </section>

        {/* Metabolic Demand Section */}
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Metabolic Demand (0–1)</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Indicates how much local muscular fatigue, burn, and energy usage is
            accumulated in a set.
          </p>
          <p className="text-gray-400">
            Exercises like split squats, push-ups, or tempo presses can have
            high metabolic cost even with lower weights.
          </p>
        </section>

        {/* Joint Stress Section */}
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <Bone className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold">Joint Stress (0–1)</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Estimates the load and biomechanical stress placed on joints.
            Influenced by depth, angles, load vectors, and complexity.
          </p>
          <p className="text-gray-400">
            Higher scores are typical for deep-loaded lifts (e.g. squats, good
            mornings), lower for planks or machine work.
          </p>
        </section>

        {/* Activation Map Section */}
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">
              Activation Map (0–1 per muscle)
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            We assign a 0–1 activation score to each muscle group involved in a
            lift. This helps visualize what the exercise is primarily or
            secondarily targeting.
          </p>
          <p className="text-gray-400">
            For example, the back squat might activate quadriceps (0.95), glutes
            (0.9), and erector spinae (0.8).
          </p>
        </section>

        {/* How Is Training Load Calculated Section */}
        <section className="space-y-8 mt-12">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            HOW IS TRAINING LOAD CALCULATED?
          </h2>
        </section>

        {/* Example Table */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Example Comparison Table</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Exercise</TableHead>
                  <TableHead className="text-gray-300">Fatigue</TableHead>
                  <TableHead className="text-gray-300">CNS</TableHead>
                  <TableHead className="text-gray-300">Metabolic</TableHead>
                  <TableHead className="text-gray-300">Joint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-700">
                  <TableCell className="text-white">Barbell Deadlift</TableCell>
                  <TableCell className="text-white">0.9</TableCell>
                  <TableCell className="text-white">0.9</TableCell>
                  <TableCell className="text-white">0.5</TableCell>
                  <TableCell className="text-white">0.7</TableCell>
                </TableRow>
                <TableRow className="border-gray-700">
                  <TableCell className="text-white">Push-Up</TableCell>
                  <TableCell className="text-white">0.5</TableCell>
                  <TableCell className="text-white">0.4</TableCell>
                  <TableCell className="text-white">0.6</TableCell>
                  <TableCell className="text-white">0.2</TableCell>
                </TableRow>
                <TableRow className="border-gray-700">
                  <TableCell className="text-white">Hip Thrust</TableCell>
                  <TableCell className="text-white">0.55</TableCell>
                  <TableCell className="text-white">0.45</TableCell>
                  <TableCell className="text-white">0.6</TableCell>
                  <TableCell className="text-white">0.25</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <p className="text-gray-400 text-center pt-8">
          Our goal is to give you clarity, structure, and actionable insights
          with every movement you program.
        </p>
      </ScrollArea>
    </div>
  );
}
