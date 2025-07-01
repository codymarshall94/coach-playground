import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Workout Sandbox",
  description:
    "Build, preview, and customize your training sessions in the Workout Sandbox.",
  icons: {
    icon: "/favicon.ico",
  },
};

const liveMetrics = [
  {
    name: "Fatigue & CNS Demand",
    description: "Real-time fatigue modeling",
    icon: <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />,
  },
  {
    name: "Energy Expenditure",
    description: "Calorie burn estimates",
    icon: <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />,
  },

  {
    name: "Volume & Load",
    description: "Total training stress",
    icon: <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-3" />,
  },
  {
    name: "Recovery Window",
    description: "Predicted recovery time",
    icon: <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />,
  },
];
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Hero - Actual Workout Builder Interface */}
      <section className="relative min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Logo size="lg" />

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build. Test. Simulate. Perfect your training before you sweat.
            </p>
          </div>

          {/* Mock Workout Builder Interface */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {/* Exercise Builder */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">
                    Exercise Builder
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      Squat
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>315lbs × 5</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      Bench Press
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>225lbs × 8</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">
                      Deadlift
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-500"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-xs text-blue-700 w-16 text-center font-medium">
                        405lbs × 3
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-500"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Metrics */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-600 mb-4">
                  Live Impact
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">CNS Fatigue</span>
                      <span className="text-orange-600 font-semibold">73%</span>
                    </div>
                    <Progress value={73} className="h-2 bg-gray-100" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Energy Cost</span>
                      <span className="text-red-600 font-semibold">
                        847 kcal
                      </span>
                    </div>
                    <Progress value={85} className="h-2 bg-gray-100" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Recovery Time</span>
                      <span className="text-green-600 font-semibold">48h</span>
                    </div>
                    <Progress value={60} className="h-2 bg-gray-100" />
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">
                      Muscle Activation
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Quads</span>
                        <span className="text-blue-600 font-semibold">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Glutes</span>
                        <span className="text-purple-600 font-semibold">
                          87%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Chest</span>
                        <span className="text-green-600 font-semibold">
                          76%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Back</span>
                        <span className="text-yellow-600 font-semibold">
                          82%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Summary */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4">
                  Session Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Volume</span>
                    <span className="font-semibold text-gray-900">
                      12,450 lbs
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Duration</span>
                    <span className="font-semibold text-gray-900">67 min</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Intensity</span>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      High
                    </Badge>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">
                      Optimization Score
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="flex-1 h-2 bg-gray-100" />
                      <span className="text-sm font-semibold text-green-600">
                        89/100
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Simulate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-600 bg-transparent"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/builder">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg mr-4"
              >
                <Target className="w-5 h-5 mr-2" />
                Start Experimenting
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to smarter programming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  1. Add Exercises, Sets, and Load
                </h3>
                <p className="text-gray-600">
                  Build workouts like you normally would — select movements, set
                  reps, weights, and rest periods from our comprehensive
                  exercise library.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  2. Watch Real-Time Impact
                </h3>
                <p className="text-gray-600">
                  Get instant feedback on fatigue, joint stress, muscle
                  activation, energy cost, and projected recovery time as you
                  build.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  3. Optimize Until Perfect
                </h3>
                <p className="text-gray-600">
                  Test variations, add notes, adjust tempo or structure — until
                  your session fits your exact goals and constraints.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Metrics Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Metrics, Real-Time Feedback
            </h2>
            <p className="text-xl text-gray-600">
              Workout intelligence, baked in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {liveMetrics.map((metric) => (
              <Card
                key={metric.name}
                className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200"
              >
                <CardContent className="p-6">
                  {metric.icon}
                  <h3 className="font-semibold mb-2 text-gray-900">
                    {metric.name}
                  </h3>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-600">
              Everything updates live as you make changes — just like a real
              simulation.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stop guessing. Start simulating.
            </h2>

            <p className="text-xl text-blue-100 mb-8">
              Build your first workout in under 60 seconds. Try it free — no
              signup required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Launch The Sandbox
                </Button>
              </Link>
            </div>

            <p className="text-blue-100">
              Advanced tools for coaches. Simple enough for athletes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">© The Workout Sandbox 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
