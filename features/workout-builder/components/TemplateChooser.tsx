"use client";

import { RichTextRenderer } from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templateConfigs } from "@/config/templateConfigs";
import { motion } from "framer-motion";
import { Bolt, Dumbbell, Flame, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";

const goalSections = {
  hypertrophy: {
    label: "Hypertrophy Programs",
    icon: <Dumbbell className="text-pink-500 w-5 h-5" />,
    badgeStyle: "bg-pink-100 text-pink-700",
  },
  strength: {
    label: "Strength Programs",
    icon: <Flame className="text-blue-500 w-5 h-5" />,
    badgeStyle: "bg-blue-100 text-blue-700",
  },
  power: {
    label: "Athletic Power Programs",
    icon: <Bolt className="text-orange-500 w-5 h-5" />,
    badgeStyle: "bg-orange-100 text-orange-700",
  },
  endurance: {
    label: "Conditioning & Endurance",
    icon: <HeartPulse className="text-green-500 w-5 h-5" />,
    badgeStyle: "bg-green-100 text-green-700",
  },
};

export default function TemplateChooserPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.h1
        className="text-4xl font-bold mb-6 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose a Template
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-base mb-10 max-w-xl"
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
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: sectionIndex * 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              {meta.icon}
              <h2 className="text-xl font-semibold">{meta.label}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="cursor-pointer group border-border transition-all hover:shadow-xl hover:-translate-y-1 bg-background/80 backdrop-blur rounded-xl"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {template.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
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
                    <CardContent className="text-sm text-muted-foreground min-h-[60px]">
                      <RichTextRenderer
                        html={template.description}
                        truncate={true}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        );
      })}

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-muted-foreground mr-4">
          Prefer to start from scratch?
        </span>
        <Button onClick={() => router.push("/programs/builder")}>
          Create Custom Plan
        </Button>
      </motion.div>
    </div>
  );
}
