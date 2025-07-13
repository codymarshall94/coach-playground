import { IntensitySystem, Program, SetType } from "@/types/Workout";
import { v4 as uuidv4 } from "uuid";

export function buildExercise(
  exercise_id: string,
  name: string,
  order_num: number,
  notes: string,
  reps: number = 10,
  intensity: IntensitySystem = "rpe",
  rest: number = 60,
  rpe: number = 8,
  set_type: SetType = "standard"
) {
  return {
    id: uuidv4(),
    exercise_id,
    order_num,
    name,
    notes,
    sets: Array(3)
      .fill(0)
      .map((_, index) => ({
        reps,
        rest,
        rpe,
        rir: null,
        one_rep_max_percent: null,
        set_type,
      })),
    intensity,
  };
}

export const templateConfigs: Program[] = [
  {
    id: "template-ppl-3day",
    name: "Push Pull Legs",
    description: `<p><strong>Overview:</strong></p>
<p>Push Pull Legs (PPL) is a balanced 3-day training split that targets all major muscle groups across the week. It’s designed to promote strength, hypertrophy, and recovery by organizing workouts based on movement patterns.</p>
<hr />
<p><strong>Structure:</strong></p>
<ul>
  <li><strong>Day 1 – Push:</strong> Focuses on the chest, shoulders, and triceps. Includes both compound pressing movements and isolation work for full anterior upper-body stimulation.</li>
  <li><strong>Day 2 – Pull:</strong> Emphasizes the back and biceps. Prioritizes horizontal and vertical pulling along with grip and forearm development.</li>
  <li><strong>Day 3 – Legs:</strong> Covers the quads, hamstrings, glutes, and calves through a mix of squats, hinges, and accessory lifts.</li>
</ul>
<hr />
<p><strong>Recommended Weekly Flow:</strong></p>
<ul>
  <li>Monday – Push</li>
  <li>Wednesday – Pull</li>
  <li>Friday – Legs</li>
</ul>
<p>This structure allows for full recovery between muscle groups while maintaining intensity and frequency for optimal growth.</p>
<hr />
<p><strong>Ideal For:</strong></p>
<ul>
  <li>Lifters seeking balanced upper/lower body development</li>
  <li>Anyone training 3 days/week with consistent recovery</li>
  <li>Intermediate-level athletes who want progression without program fatigue</li>
</ul>
<hr />
<p><strong>Progression Strategy:</strong></p>
<p>Focus on progressive overload using linear or double progression methods. Most exercises fall within an 8–12 rep range, but compound lifts may go as low as 5 reps or up to 15 depending on phase and load. Track performance weekly and aim to increase weight, reps, or control each session.</p>
<hr />
<p><strong>Optional Add-Ons:</strong></p>
<ul>
  <li>Add cardio or mobility work on off-days</li>
  <li>Insert rest-pause or tempo sets for advanced intensity</li>
  <li>Rotate push/pull days for specific focus phases (e.g., shoulder-emphasis push)</li>
</ul>
<p><em>Tip:</em> This plan can easily evolve into a 6-day version by repeating the cycle (Push, Pull, Legs x2), with slight volume adjustments to prevent fatigue.</p>`,
    goal: "hypertrophy",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Push",
        description:
          "On this day, we’re going to build pressing strength and upper-body mass by targeting your chest, shoulders, and triceps. The goal is to move heavy on compounds and finish with high-tension isolation work.",
        order_num: 0,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercise_groups: [
              {
                id: uuidv4(),
                type: "standard",
                order_num: 0,
                exercises: [
                  buildExercise(
                    "bench_press_bb",
                    "Barbell Bench Press",
                    0,
                    "Drive the bar explosively off the chest, but control the descent for 2–3 seconds. Feet planted, scapula retracted, elbows at ~45°."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 1,
                exercises: [
                  buildExercise(
                    "incline_press_db",
                    "Incline Dumbbell Press",
                    1,
                    "Slow the eccentric (~3 sec), pause at the bottom, and drive up with control. Elbows should stay just under the wrist path to hit upper chest."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 2,
                exercises: [
                  buildExercise(
                    "shoulder_press_db",
                    "Dumbbell Shoulder Press",
                    2,
                    "Seated with a neutral spine. Avoid locking out fully; aim for constant tension. Lower with control (2-3 sec) and don’t flare elbows too wide."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 3,
                exercises: [
                  buildExercise(
                    "lateral_raise_db",
                    "Dumbbell Lateral Raise",
                    3,
                    "Use light to moderate weight. Raise with a slight lean forward, control the eccentric (3 sec), and avoid using momentum. Focus on the side delts."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 4,
                exercises: [
                  buildExercise(
                    "triceps_pushdown_cable",
                    "Triceps Pushdown (Cable)",
                    4,
                    "Keep elbows tight to your sides. Use a 1–2 second pause at the bottom of each rep and focus on full lockout with wrist control."
                  ),
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Pull",
        description:
          "Today is all about pulling. We’re going to build upper-back thickness, lat width, and arm strength with a mix of heavy rows, vertical pulls, and controlled isolation.",
        order_num: 1,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercise_groups: [
              {
                id: uuidv4(),
                type: "standard",
                order_num: 0,
                exercises: [
                  buildExercise(
                    "bent_over_row_bb",
                    "Bent-Over Barbell Row",
                    0,
                    "Keep a flat back, core braced, and pull toward your belt line. Control the weight—don’t jerk. Use straps if grip limits intensity."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 1,
                exercises: [
                  buildExercise(
                    "lat_pulldown_cable",
                    "Lat Pulldown (Cable)",
                    1,
                    "Pull elbows down and in. Pause briefly at the bottom and stretch fully at the top. Slight lean back is OK, but no swinging."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 2,
                exercises: [
                  buildExercise(
                    "trx_row",
                    "TRX Row",
                    2,
                    "Bodyweight row to hit mid-back. Keep a neutral neck and row with scapular retraction. Slow the tempo to increase time under tension."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 3,
                exercises: [
                  buildExercise(
                    "curl_alt_db",
                    "Alternating DB Curl",
                    3,
                    "Control each rep and fully supinate (turn palm up) as you curl. Don’t sway—keep your elbow tucked and strict. Pause at the top for contraction."
                  ),
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Legs",
        description:
          "Leg day — our focus is on building strength and size through squats, unilateral work, hip extension, and calf training. Brace hard and move with intent.",
        order_num: 2,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercise_groups: [
              {
                id: uuidv4(),
                type: "standard",
                order_num: 0,
                exercises: [
                  buildExercise(
                    "back_squat_bb",
                    "Barbell Back Squat",
                    0,
                    "Use a shoulder-width stance. Brace hard, descend under control (~3 sec), and drive up without bouncing. Depth should be just below parallel."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 1,
                exercises: [
                  buildExercise(
                    "bulgarian_split_squat_db",
                    "Bulgarian Split Squat (DB)",
                    1,
                    "Elevate rear foot and drop straight down (not forward). Slight forward lean helps hit glutes. Use slow controlled reps (2–3 sec down)."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 2,
                exercises: [
                  buildExercise(
                    "hip_thrust_bb",
                    "Barbell Hip Thrust",
                    2,
                    "Brace core and avoid hyperextending. Thrust up and pause for 1–2 sec at top for glute contraction. Control tempo—avoid bouncing."
                  ),
                ],
              },
              {
                id: uuidv4(),
                type: "standard",
                order_num: 3,
                exercises: [
                  buildExercise(
                    "seated_calf_raise_machine",
                    "Seated Calf Raise (Machine)",
                    3,
                    "Pause at the top for 1 sec and stretch fully at the bottom. Use slow controlled tempo (2–1–2) for best growth."
                  ),
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Rest",
        description:
          "Full recovery day. Light walking, stretching, or mobility is optional — don’t skip rest. It’s when we actually grow.",
        workout: [],
        order_num: 3,
        type: "rest",
      },
    ],
  },
];
