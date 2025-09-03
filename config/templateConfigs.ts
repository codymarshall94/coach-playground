import type { Program } from "@/types/Workout";
import { buildExercise } from "@/utils/buildExercise";
import { v4 as uuidv4 } from "uuid";

export const templateConfigs: Program[] = [
  {
    id: "template-ppl-3day",
    name: "Push Pull Legs",
    description: `<p><strong>Overview:</strong></p>
<p>Push Pull Legs (PPL) is a balanced 3-day training split that targets all major muscle groups...</p>`,
    goal: "hypertrophy",
    mode: "days",
    created_at: new Date() as unknown as any, // If your Program type expects Date, keep Date; if Supabase rows, these will be server-set.
    updated_at: new Date() as unknown as any,
    days: [
      // Day 1 – Push
      {
        id: uuidv4(),
        name: "Push",
        description:
          "Pressing strength + upper-body mass (chest, shoulders, triceps). Heavy compounds + controlled isolation.",
        order_num: 0,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise("bench_press_bb", "Barbell Bench Press", 0, "rpe", {
                notes:
                  "Drive explosively off the chest; 2–3s eccentric; feet planted; scapula retracted; ~45° elbows.",
                reps: 6,
                rest: 120,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 1,
            notes: "",
            exercises: [
              buildExercise(
                "incline_press_db",
                "Incline Dumbbell Press",
                0,
                "rpe",
                {
                  notes:
                    "3s eccentric, pause bottom, drive up with control. Keep elbows slightly under wrists.",
                  reps: 8,
                  rest: 90,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 2,
            notes: "",
            exercises: [
              buildExercise(
                "shoulder_press_db",
                "Dumbbell Shoulder Press",
                0,
                "rpe",
                {
                  notes:
                    "Neutral spine, avoid full lockout, maintain constant tension; control 2–3s down.",
                  reps: 8,
                  rest: 90,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 3,
            notes: "",
            exercises: [
              buildExercise(
                "lateral_raise_db",
                "Dumbbell Lateral Raise",
                0,
                "rpe",
                {
                  notes:
                    "Slight forward lean, strict control, minimize momentum. Target side delts.",
                  reps: 12,
                  rest: 60,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 4,
            notes: "",
            exercises: [
              buildExercise(
                "triceps_pushdown_cable",
                "Triceps Pushdown (Cable)",
                0,
                "rpe",
                {
                  notes:
                    "Elbows tight. 1–2s pause at lockout. Full control throughout.",
                  reps: 12,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 2 – Pull
      {
        id: uuidv4(),
        name: "Pull",
        description:
          "Upper-back thickness, lat width, and arm strength via rows, vertical pulls, and isolation.",
        order_num: 1,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise(
                "bent_over_row_bb",
                "Bent-Over Barbell Row",
                0,
                "rpe",
                {
                  notes:
                    "Flat back, braced core, pull to belt line. Control, no jerking.",
                  reps: 6,
                  rest: 120,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 1,
            notes: "",
            exercises: [
              buildExercise(
                "lat_pulldown_cable",
                "Lat Pulldown (Cable)",
                0,
                "rpe",
                {
                  notes:
                    "Elbows down/in, brief pause bottom, full stretch top. Slight lean ok; avoid swinging.",
                  reps: 10,
                  rest: 90,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 2,
            notes: "",
            exercises: [
              buildExercise("trx_row", "TRX Row", 0, "rpe", {
                notes: "Neutral neck, strict retraction. Slow tempo.",
                reps: 12,
                rest: 60,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 3,
            notes: "",
            exercises: [
              buildExercise("curl_alt_db", "Alternating DB Curl", 0, "rpe", {
                notes:
                  "Strict. Full supination; elbow tucked; brief squeeze at the top.",
                reps: 12,
                rest: 60,
              }),
            ],
          },
        ],
      },

      // Day 3 – Legs
      {
        id: uuidv4(),
        name: "Legs",
        description:
          "Squats, unilateral work, hip extension, calves. Brace hard, control eccentrics.",
        order_num: 2,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise("back_squat_bb", "Barbell Back Squat", 0, "rpe", {
                notes:
                  "Shoulder-width stance, strong brace, ~3s down, no bounce. Aim slight below parallel.",
                reps: 5,
                rest: 180,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 1,
            notes: "",
            exercises: [
              buildExercise(
                "bulgarian_split_squat_db",
                "Bulgarian Split Squat (DB)",
                0,
                "rpe",
                {
                  notes:
                    "Drop straight down; slight forward lean for glute bias. Controlled 2–3s down.",
                  reps: 10,
                  rest: 90,
                }
              ),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 2,
            notes: "",
            exercises: [
              buildExercise("hip_thrust_bb", "Barbell Hip Thrust", 0, "rpe", {
                notes:
                  "Brace; avoid hyperextension. 1–2s pause at top. No bouncing.",
                reps: 8,
                rest: 120,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 3,
            notes: "",
            exercises: [
              buildExercise(
                "seated_calf_raise_machine",
                "Seated Calf Raise (Machine)",
                0,
                "rpe",
                {
                  notes: "Pause at top, full stretch bottom. 2–1–2 tempo.",
                  reps: 12,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 4 – Rest
      {
        id: uuidv4(),
        name: "Rest",
        description:
          "Full recovery day. Optional light walking, stretching, mobility.",
        groups: [],
        order_num: 3,
        type: "rest",
      },
    ],
  },
];
