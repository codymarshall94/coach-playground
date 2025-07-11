"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templateConfigs } from "@/config/templateConfigs";
import { motion } from "framer-motion";
import { ArrowLeft, Bolt, Dumbbell, Flame, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";

const goalSections = {
  hypertrophy: {
    label: "Hypertrophy Programs",
    icon: <Dumbbell className="text-pink-500 w-5 h-5" />,
    badgeStyle: "bg-pink-100 text-pink-700",
    accent: "from-pink-400 to-pink-600",
  },
  strength: {
    label: "Strength Programs",
    icon: <Flame className="text-blue-500 w-5 h-5" />,
    badgeStyle: "bg-blue-100 text-blue-700",
    accent: "from-blue-400 to-blue-600",
  },
  power: {
    label: "Athletic Power Programs",
    icon: <Bolt className="text-orange-500 w-5 h-5" />,
    badgeStyle: "bg-orange-100 text-orange-700",
    accent: "from-orange-400 to-orange-600",
  },
  endurance: {
    label: "Conditioning & Endurance",
    icon: <HeartPulse className="text-green-500 w-5 h-5" />,
    badgeStyle: "bg-green-100 text-green-700",
    accent: "from-green-400 to-green-600",
  },
};

export default function TemplateChooserPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Button variant="outline" className="mb-8" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold mb-4 tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Choose a Template
        </motion.h1>
      </div>

      <motion.p
        className="text-muted-foreground text-base mb-12 max-w-xl"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Start quickly with a structured layout. You can fully customize your
        program later.
      </motion.p>

      {Object.entries(goalSections).map(([goalKey, meta], sectionIndex) => {
        const templates = templateConfigs.filter((t) => t.goal === goalKey);
        if (!templates.length) return null;

        return (
          <motion.section
            key={goalKey}
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sectionIndex * 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-muted">{meta.icon}</div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                {meta.label}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() =>
                      router.push(`/programs/builder?template=${template.id}`)
                    }
                    className="cursor-pointer group border border-border bg-background/70 backdrop-blur-lg rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Accent bar */}
                    <div
                      className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${meta.accent}`}
                    />

                    <CardHeader className="relative z-10">
                      <CardTitle className="text-lg font-bold group-hover:text-foreground">
                        {template.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={meta.badgeStyle}>{meta.label}</Badge>
                        <Badge variant="secondary">
                          {template.mode === "blocks" ? "Blocks" : "Days"}
                        </Badge>
                        <Badge variant="outline">
                          {template.mode === "blocks"
                            ? `${template.blocks?.[0]?.days.length ?? 0} Days`
                            : `${template.days?.length ?? 0} Days`}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground z-10 relative px-6 pb-6 min-h-[72px]">
                      <RichTextRenderer html={template.description} truncate />
                    </CardContent>

                    {/* Optional icon watermark */}
                    <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity z-0">
                      {meta.icon}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
