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

  // ────────────────────────────────────────────
  // Template 2 – Upper Lower (4-day, strength)
  // ────────────────────────────────────────────
  {
    id: "template-upper-lower-4day",
    name: "Upper Lower",
    description: `<p><strong>Overview:</strong></p>
<p>A classic 4-day Upper/Lower split designed for building strength and size. Two upper-body days alternate with two lower-body days, balancing push/pull volume while allowing adequate recovery between sessions.</p>
<p><strong>Best for:</strong> Intermediate lifters looking to build strength with moderate volume.</p>`,
    goal: "strength",
    mode: "days",
    created_at: new Date() as unknown as any,
    updated_at: new Date() as unknown as any,
    days: [
      // Day 1 – Upper A
      {
        id: uuidv4(),
        name: "Upper A",
        description:
          "Heavy pressing emphasis with back and arm accessory work.",
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
                  "Retract scapula, arch slightly, controlled 2-3s eccentric. Drive through feet.",
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
                "bent_over_row_bb",
                "Bent-Over Barbell Row",
                0,
                "rpe",
                {
                  notes:
                    "Flat back, brace core, pull to belt line. No momentum.",
                  reps: 5,
                  rest: 180,
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
                    "Neutral spine, avoid excessive arch. Control the eccentric.",
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
                "face_pull_cable",
                "Face Pull (Cable)",
                0,
                "rpe",
                {
                  notes:
                    "External rotate at end range. Squeeze rear delts. Light and controlled.",
                  reps: 15,
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
              buildExercise("z_curl_bb", "EZ-Bar Curl", 0, "rpe", {
                notes:
                  "Elbows pinned, strict form. 2s eccentric, brief squeeze at top.",
                reps: 10,
                rest: 60,
              }),
            ],
          },
        ],
      },

      // Day 2 – Lower A
      {
        id: uuidv4(),
        name: "Lower A",
        description:
          "Squat-dominant lower body day with posterior chain and calf work.",
        order_num: 1,
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
                  "Strong brace, controlled descent to parallel or just below. Drive through mid-foot.",
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
              buildExercise("hip_thrust_bb", "Barbell Hip Thrust", 0, "rpe", {
                notes:
                  "Posterior pelvic tilt at the top. 1-2s squeeze. No hyperextension.",
                reps: 8,
                rest: 120,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 2,
            notes: "",
            exercises: [
              buildExercise(
                "leg_extension_machine",
                "Leg Extension (Machine)",
                0,
                "rpe",
                {
                  notes:
                    "Slow eccentric, pause at top to maximize quad contraction.",
                  reps: 12,
                  rest: 60,
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
                "lying_hamstring_curl_machine",
                "Lying Hamstring Curl (Machine)",
                0,
                "rpe",
                {
                  notes:
                    "Full range of motion. Control the negative. Don't let the weight slam.",
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
                "calf_raise_machine",
                "Standing Calf Raise (Machine)",
                0,
                "rpe",
                {
                  notes:
                    "Full stretch at the bottom, 2s hold at top. Straight knees.",
                  reps: 15,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 3 – Upper B
      {
        id: uuidv4(),
        name: "Upper B",
        description:
          "Volume-focused upper body with more isolation and hypertrophy work.",
        order_num: 2,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise(
                "incline_press_db",
                "Incline Dumbbell Press",
                0,
                "rpe",
                {
                  notes:
                    "30-45° bench. 3s eccentric, slight pause at bottom, controlled press.",
                  reps: 8,
                  rest: 90,
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
                "Cable Lat Pulldown",
                0,
                "rpe",
                {
                  notes:
                    "Drive elbows down and back. Full stretch at top, squeeze at bottom.",
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
              buildExercise(
                "cable_chest_fly",
                "Cable Chest Fly",
                0,
                "rpe",
                {
                  notes:
                    "Slight bend in elbows throughout. Squeeze pecs at peak contraction.",
                  reps: 12,
                  rest: 60,
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
                "row_seated_cable",
                "Seated Cable Row",
                0,
                "rpe",
                {
                  notes:
                    "Drive elbows back, squeeze shoulder blades. Full stretch forward.",
                  reps: 10,
                  rest: 90,
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
                    "Elbows pinned to sides. Full lockout, controlled return.",
                  reps: 12,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 4 – Lower B
      {
        id: uuidv4(),
        name: "Lower B",
        description:
          "Deadlift-dominant lower body day with unilateral and core work.",
        order_num: 3,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise(
                "conventional_deadlift_bb",
                "Barbell Deadlift",
                0,
                "rpe",
                {
                  notes:
                    "Brace hard, push the floor away. Hips and shoulders rise together. Reset each rep.",
                  reps: 5,
                  rest: 180,
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
                "bulgarian_split_squat_db",
                "Bulgarian Split Squat (DB)",
                0,
                "rpe",
                {
                  notes:
                    "Drop straight down, slight forward lean for glute emphasis. 2-3s eccentric.",
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
              buildExercise(
                "leg_press_machine",
                "Leg Press (Machine)",
                0,
                "rpe",
                {
                  notes:
                    "Feet shoulder width, medium-high placement. Full range, don't lock knees.",
                  reps: 10,
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
                "seated_calf_raise_machine",
                "Seated Calf Raise",
                0,
                "rpe",
                {
                  notes:
                    "Full stretch at bottom, 2s pause at top. Target soleus.",
                  reps: 15,
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
              buildExercise("cable_crunch", "Cable Crunch", 0, "rpe", {
                notes:
                  "Round the spine, exhale hard at contraction. Don't pull with arms.",
                reps: 15,
                rest: 60,
              }),
            ],
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────
  // Template 3 – Full Body (3-day, hypertrophy)
  // ────────────────────────────────────────────
  {
    id: "template-full-body-3day",
    name: "Full Body",
    description: `<p><strong>Overview:</strong></p>
<p>A 3-day full body program that trains all major muscle groups each session. Each day uses a different exercise selection to provide varied stimulus while maintaining high frequency. Ideal for beginners to intermediates who want efficient, well-rounded training.</p>
<p><strong>Best for:</strong> Lifters with 3 days per week to train who want balanced hypertrophy and strength development.</p>`,
    goal: "hypertrophy",
    mode: "days",
    created_at: new Date() as unknown as any,
    updated_at: new Date() as unknown as any,
    days: [
      // Day 1 – Full Body A
      {
        id: uuidv4(),
        name: "Full Body A",
        description:
          "Squat and bench emphasis with pulling and arm accessories.",
        order_num: 0,
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
                  "Shoulder-width stance, strong brace. Controlled descent to parallel. Drive up explosively.",
                reps: 8,
                rest: 150,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 1,
            notes: "",
            exercises: [
              buildExercise("bench_press_bb", "Barbell Bench Press", 0, "rpe", {
                notes:
                  "Retract scapula, plant feet. Controlled eccentric, press with power.",
                reps: 8,
                rest: 150,
              }),
            ],
          },
          {
            id: uuidv4(),
            type: "standard",
            order_num: 2,
            notes: "",
            exercises: [
              buildExercise(
                "bent_over_row_bb",
                "Bent-Over Barbell Row",
                0,
                "rpe",
                {
                  notes:
                    "Flat back, pull to belt line. Squeeze shoulder blades at top.",
                  reps: 8,
                  rest: 120,
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
                    "Slight lean forward, controlled tempo. Minimize momentum.",
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
                "hammer_curl_db",
                "Hammer Curl (DB)",
                0,
                "rpe",
                {
                  notes:
                    "Neutral grip, elbows pinned. Targets brachioradialis and brachialis.",
                  reps: 12,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 2 – Full Body B
      {
        id: uuidv4(),
        name: "Full Body B",
        description:
          "Deadlift and incline press emphasis with back and tricep accessories.",
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
                "conventional_deadlift_bb",
                "Barbell Deadlift",
                0,
                "rpe",
                {
                  notes:
                    "Tight brace, push the floor away. Hips and shoulders rise together. Reset each rep.",
                  reps: 6,
                  rest: 180,
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
                "incline_press_db",
                "Incline Dumbbell Press",
                0,
                "rpe",
                {
                  notes:
                    "30-45° incline. Slow eccentric, slight pause at bottom. Upper chest focus.",
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
              buildExercise(
                "lat_pulldown_cable",
                "Cable Lat Pulldown",
                0,
                "rpe",
                {
                  notes:
                    "Wide grip, pull to upper chest. Full stretch at top, squeeze lats at bottom.",
                  reps: 10,
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
                "face_pull_cable",
                "Face Pull (Cable)",
                0,
                "rpe",
                {
                  notes:
                    "External rotation at end range. Light weight, focus on rear delt and rotator cuff.",
                  reps: 15,
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
                "skullcrusher_bb",
                "EZ-Bar Skullcrusher",
                0,
                "rpe",
                {
                  notes:
                    "Lower to forehead, elbows pointing forward. Full extension at top.",
                  reps: 10,
                  rest: 60,
                }
              ),
            ],
          },
        ],
      },

      // Day 3 – Full Body C
      {
        id: uuidv4(),
        name: "Full Body C",
        description:
          "Leg press and shoulder press emphasis with rowing and curl accessories.",
        order_num: 2,
        type: "workout",
        groups: [
          {
            id: uuidv4(),
            type: "standard",
            order_num: 0,
            notes: "",
            exercises: [
              buildExercise(
                "leg_press_machine",
                "Leg Press (Machine)",
                0,
                "rpe",
                {
                  notes:
                    "Feet shoulder-width, medium-high placement. Full ROM, no locking out.",
                  reps: 10,
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
                "flat_press_db",
                "Flat Dumbbell Press",
                0,
                "rpe",
                {
                  notes:
                    "Full ROM, squeeze chest at top. Keep shoulders pinned back.",
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
              buildExercise(
                "row_seated_cable",
                "Seated Cable Row",
                0,
                "rpe",
                {
                  notes:
                    "Drive elbows back, full scapular retraction. Stretch forward on eccentric.",
                  reps: 10,
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
                "shoulder_press_db",
                "Dumbbell Shoulder Press",
                0,
                "rpe",
                {
                  notes:
                    "Neutral spine, maintain constant tension. Control 2-3s eccentric.",
                  reps: 10,
                  rest: 90,
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
                "curl_alt_db",
                "Alternating DB Curl",
                0,
                "rpe",
                {
                  notes:
                    "Strict form, full supination. Brief squeeze at top, controlled negative.",
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
          "Full recovery day. Light walking, stretching, or mobility work optional.",
        groups: [],
        order_num: 3,
        type: "rest",
      },
    ],
  },
];
