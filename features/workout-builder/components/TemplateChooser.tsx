"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { templateConfigs } from "@/config/templateConfigs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
        Start fast with a structured outline. You can modify everything inside
        later.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateConfigs.map((template, index) => (
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
                <CardTitle className="text-xl font-semibold flex flex-col gap-1">
                  {template.name}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.goal}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {template.mode === "blocks" ? "Blocks" : "Days"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.mode === "blocks"
                        ? `${template.blocks?.[0]?.days.length ?? 0} Days`
                        : `${template.days?.length ?? 0} Days`}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground min-h-[60px]">
                {template.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-muted-foreground mr-4">
          Want to build something from scratch?
        </span>
        <Button onClick={() => router.push("/programs/builder")}>
          Start from Scratch
        </Button>
      </motion.div>
    </div>
  );
}
