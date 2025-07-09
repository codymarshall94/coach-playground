import { IntensitySystem, Program } from "@/types/Workout";
import { v4 as uuidv4 } from "uuid";

export function buildExercise(
  exercise_id: string,
  name: string,
  order_num: number,
  reps: number = 10,
  intensity: IntensitySystem = "rpe",
  rest: number = 60,
  rpe: number = 8
) {
  return {
    id: uuidv4(),
    exercise_id,
    order_num,
    name,
    notes: `${3} sets of ${reps} reps`,
    sets: [
      {
        reps,
        rest,
        rpe,
        rir: null,
        one_rep_max_percent: null,
      },
      {
        reps,
        rest,
        rpe,
        rir: null,
        one_rep_max_percent: null,
      },
      {
        reps,
        rest,
        rpe,
        rir: null,
        one_rep_max_percent: null,
      },
    ],
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

<p><em>Tip:</em> This plan can easily evolve into a 6-day version by repeating the cycle (Push, Pull, Legs x2), with slight volume adjustments to prevent fatigue.</p>
`,
    goal: "hypertrophy",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Push",
        description: "Chest, shoulders, triceps.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "bench_press_bb",
                order_num: 0,
                name: "Barbell Bench Press",
                notes: "3 sets of 8–12 reps",
                sets: [
                  {
                    reps: 8,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "incline_press_db",
                order_num: 1,
                name: "Incline Dumbbell Press",
                notes: "3 sets of 10–12 reps",
                sets: [
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "shoulder_press_db",
                order_num: 2,
                name: "Dumbbell Shoulder Press",
                notes: "3 sets of 8–10 reps",
                sets: [
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "lateral_raise_db",
                order_num: 3,
                name: "Dumbbell Lateral Raise",
                notes: "3 sets of 12–15 reps",
                sets: [
                  {
                    reps: 15,
                    rest: 45,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 15,
                    rest: 45,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 15,
                    rest: 45,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "triceps_pushdown_cable",
                order_num: 4,
                name: "Triceps Pushdown (Cable)",
                notes: "3 sets of 12–15 reps",
                sets: [
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 0,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Pull",
        description: "Back and biceps.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "bent_over_row_bb",
                order_num: 0,
                name: "Bent-Over Barbell Row",
                notes: "3 sets of 8–10 reps",
                sets: [
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "lat_pulldown_cable",
                order_num: 1,
                name: "Lat Pulldown (Cable)",
                notes: "3 sets of 10–12 reps",
                sets: [
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "trx_row",
                order_num: 2,
                name: "TRX Row",
                notes: "3 sets of 10–12 reps",
                sets: [
                  {
                    reps: 12,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 60,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "curl_alt_db",
                order_num: 3,
                name: "Alternating DB Curl",
                notes: "3 sets of 12–15 reps",
                sets: [
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 45,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 1,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Legs",
        description: "Quads, glutes, hamstrings.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "back_squat_bb",
                order_num: 0,
                name: "Barbell Back Squat",
                notes: "3 sets of 8 reps",
                sets: [
                  {
                    reps: 8,
                    rest: 120,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 120,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 8,
                    rest: 120,
                    rpe: 9,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "bulgarian_split_squat_db",
                order_num: 1,
                name: "Bulgarian Split Squat (DB)",
                notes: "3 sets of 10 reps each leg",
                sets: [
                  {
                    reps: 10,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 10,
                    rest: 90,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "hip_thrust_bb",
                order_num: 2,
                name: "Barbell Hip Thrust",
                notes: "3 sets of 10–12 reps",
                sets: [
                  {
                    reps: 12,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 12,
                    rest: 75,
                    rpe: 8,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "seated_calf_raise_machine",
                order_num: 3,
                name: "Seated Calf Raise (Machine)",
                notes: "3 sets of 15–20 reps",
                sets: [
                  {
                    reps: 20,
                    rest: 30,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 20,
                    rest: 30,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                  {
                    reps: 20,
                    rest: 30,
                    rpe: 7,
                    rir: null,
                    one_rep_max_percent: null,
                  },
                ],
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 2,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Rest",
        description: "Rest day",
        workout: [],
        order: 3,
        type: "rest",
      },
    ],
  },

  {
    id: "template-upper-lower-4day",
    name: "Upper Lower",
    description: "Classic upper/lower split with recovery built in.",
    goal: "strength",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Upper A",
        description: "Bench, row, overhead press.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "bench_press_bb",
                order_num: 0,
                name: "Barbell Bench Press",
                notes: "4 sets of 5–8 reps",
                sets: Array(4).fill({
                  reps: 5,
                  rest: 120,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "bent_over_row_bb",
                order_num: 1,
                name: "Bent-Over Barbell Row",
                notes: "4 sets of 6–8 reps",
                sets: Array(4).fill({
                  reps: 6,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "shoulder_press_db",
                order_num: 2,
                name: "Dumbbell Shoulder Press",
                notes: "3 sets of 8 reps",
                sets: Array(3).fill({
                  reps: 8,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "face_pull_cable",
                order_num: 3,
                name: "Face Pull (Cable)",
                notes: "3 sets of 12–15 reps",
                sets: Array(3).fill({
                  reps: 15,
                  rest: 45,
                  rpe: 7,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 0,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Lower A",
        description: "Squat focused day.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "back_squat_bb",
                order_num: 0,
                name: "Barbell Back Squat",
                notes: "4 sets of 5 reps",
                sets: Array(4).fill({
                  reps: 5,
                  rest: 150,
                  rpe: 8.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "leg_press_machine",
                order_num: 1,
                name: "Leg Press (Machine)",
                notes: "3 sets of 10 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "leg_curl_machine",
                order_num: 2,
                name: "Leg Curl (Machine)",
                notes: "3 sets of 12–15 reps",
                sets: Array(3).fill({
                  reps: 12,
                  rest: 60,
                  rpe: 7.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "seated_calf_raise_machine",
                order_num: 3,
                name: "Seated Calf Raise (Machine)",
                notes: "3 sets of 15–20 reps",
                sets: Array(3).fill({
                  reps: 20,
                  rest: 30,
                  rpe: 7,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 1,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Upper B",
        description: "Incline press, lat pulldown.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "incline_press_db",
                order_num: 0,
                name: "Incline Dumbbell Press",
                notes: "4 sets of 6–8 reps",
                sets: Array(4).fill({
                  reps: 6,
                  rest: 90,
                  rpe: 8.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "lat_pulldown_cable",
                order_num: 1,
                name: "Lat Pulldown (Cable)",
                notes: "4 sets of 8–10 reps",
                sets: Array(4).fill({
                  reps: 8,
                  rest: 75,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "z_curl_bb",
                order_num: 2,
                name: "EZ-Bar Curl",
                notes: "3 sets of 10–12 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 60,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "triceps_pushdown_cable",
                order_num: 3,
                name: "Triceps Pushdown (Cable)",
                notes: "3 sets of 12–15 reps",
                sets: Array(3).fill({
                  reps: 12,
                  rest: 45,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 2,
        type: "workout",
      },

      {
        id: uuidv4(),
        name: "Lower B",
        description: "Deadlift focused day.",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "conventional_deadlift_bb",
                order_num: 0,
                name: "Barbell Deadlift",
                notes: "4 sets of 3–5 reps",
                sets: Array(4).fill({
                  reps: 5,
                  rest: 150,
                  rpe: 9,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "bulgarian_split_squat_db",
                order_num: 1,
                name: "Bulgarian Split Squat (DB)",
                notes: "3 sets of 8–10 reps",
                sets: Array(3).fill({
                  reps: 8,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "hip_thrust_bb",
                order_num: 2,
                name: "Barbell Hip Thrust",
                notes: "3 sets of 10 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "calf_raise_machine",
                order_num: 3,
                name: "Standing Calf Raise (Machine)",
                notes: "3 sets of 12–15 reps",
                sets: Array(3).fill({
                  reps: 15,
                  rest: 30,
                  rpe: 7.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 3,
        type: "workout",
      },
    ],
  },

  {
    id: "template-full-body-3day",
    name: "Full Body",
    description: "Beginner-friendly full-body routine done 3x per week.",
    goal: "strength",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Day 1",
        description: "Push + legs",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "bench_press_bb",
                order_num: 0,
                name: "Barbell Bench Press",
                notes: "3 sets of 5 reps",
                sets: Array(3).fill({
                  reps: 5,
                  rest: 120,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "shoulder_press_db",
                order_num: 1,
                name: "Dumbbell Shoulder Press",
                notes: "3 sets of 8 reps",
                sets: Array(3).fill({
                  reps: 8,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "back_squat_bb",
                order_num: 2,
                name: "Barbell Back Squat",
                notes: "3 sets of 5 reps",
                sets: Array(3).fill({
                  reps: 5,
                  rest: 120,
                  rpe: 8.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "seated_calf_raise_machine",
                order_num: 3,
                name: "Seated Calf Raise (Machine)",
                notes: "3 sets of 15 reps",
                sets: Array(3).fill({
                  reps: 15,
                  rest: 45,
                  rpe: 7,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 0,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Day 2",
        description: "Pull + legs",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "bent_over_row_bb",
                order_num: 0,
                name: "Bent-Over Barbell Row",
                notes: "3 sets of 8 reps",
                sets: Array(3).fill({
                  reps: 8,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "lat_pulldown_cable",
                order_num: 1,
                name: "Lat Pulldown (Cable)",
                notes: "3 sets of 10 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 75,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "leg_press_machine",
                order_num: 2,
                name: "Leg Press (Machine)",
                notes: "3 sets of 10 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "leg_curl_machine",
                order_num: 3,
                name: "Leg Curl (Machine)",
                notes: "3 sets of 12 reps",
                sets: Array(3).fill({
                  reps: 12,
                  rest: 60,
                  rpe: 7.5,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 1,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Day 3",
        description: "Mixed strength and hypertrophy",
        workout: [
          {
            exercises: [
              {
                id: uuidv4(),
                exercise_id: "incline_press_db",
                order_num: 0,
                name: "Incline Dumbbell Press",
                notes: "3 sets of 8 reps",
                sets: Array(3).fill({
                  reps: 8,
                  rest: 90,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "trx_row",
                order_num: 1,
                name: "TRX Row",
                notes: "3 sets of 12 reps",
                sets: Array(3).fill({
                  reps: 12,
                  rest: 60,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "hip_thrust_bb",
                order_num: 2,
                name: "Barbell Hip Thrust",
                notes: "3 sets of 10 reps",
                sets: Array(3).fill({
                  reps: 10,
                  rest: 75,
                  rpe: 8,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
              {
                id: uuidv4(),
                exercise_id: "plank_bw",
                order_num: 3,
                name: "Plank",
                notes: "3 sets of 30 seconds hold",
                sets: Array(3).fill({
                  reps: 1,
                  rest: 30,
                  rpe: 6,
                  rir: null,
                  one_rep_max_percent: null,
                }),
                intensity: "rpe",
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        order: 2,
        type: "workout",
      },
    ],
  },

  {
    id: "template-bodybuilder-5day",
    name: "Bodybuilder Split",
    description: "Classic bro split for maximum hypertrophy.",
    goal: "hypertrophy",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Chest",
        description: "Flat, incline, accessories",
        order: 0,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise("bench_press_bb", "Barbell Bench Press", 0, 8),
              buildExercise(
                "incline_press_db",
                "Incline Dumbbell Press",
                1,
                10
              ),
              buildExercise("chest_fly_db", "Dumbbell Chest Fly", 2, 12),
              buildExercise("cable_chest_fly", "Cable Chest Fly", 3, 12),
              buildExercise("pec_deck_machine", "Pec Deck Machine", 4, 15),
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Back",
        description: "Vertical and horizontal pulls",
        order: 1,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise("lat_pulldown_cable", "Lat Pulldown", 0, 10),
              buildExercise("bent_over_row_bb", "Barbell Row", 1, 8),
              buildExercise("seated_row_machine", "Seated Row Machine", 2, 10),
              buildExercise("face_pull_cable", "Face Pull (Cable)", 3, 15),
              buildExercise("shrug_db", "Dumbbell Shrugs", 4, 12),
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Legs",
        description: "Quads, hams, calves",
        order: 2,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise("back_squat_bb", "Barbell Back Squat", 0, 8),
              buildExercise("leg_press_machine", "Leg Press", 1, 12),
              buildExercise("leg_curl_machine", "Leg Curl Machine", 2, 12),
              buildExercise("leg_extension_machine", "Leg Extension", 3, 15),
              buildExercise("calf_raise_machine", "Calf Raise Machine", 4, 15),
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Shoulders",
        description: "Delts and traps",
        order: 3,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise(
                "shoulder_press_db",
                "Dumbbell Shoulder Press",
                0,
                10
              ),
              buildExercise("lateral_raise_db", "Lateral Raise", 1, 12),
              buildExercise("rear_delt_fly_db", "Rear Delt Fly", 2, 12),
              buildExercise("front_raise_db", "Front Raise", 3, 12),
              buildExercise("shrug_bb", "Barbell Shrugs", 4, 15),
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Arms",
        description: "Biceps and triceps",
        order: 4,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise("curl_alt_db", "Alternating DB Curls", 0, 12),
              buildExercise("hammer_curl_db", "Hammer Curls", 1, 10),
              buildExercise("triceps_kickback_db", "Triceps Kickback", 2, 12),
              buildExercise(
                "triceps_pushdown_cable",
                "Triceps Pushdown",
                3,
                12
              ),
              buildExercise("z_curl_bb", "Barbell Z-Curl", 4, 10),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "template-powerbuilder-4day",
    name: "Powerbuilder",
    description: "Hybrid program combining strength and hypertrophy.",
    goal: "hypertrophy",
    mode: "blocks",
    createdAt: new Date(),
    updatedAt: new Date(),
    blocks: [
      {
        id: uuidv4(),
        name: "Powerbuilding Phase",
        order: 0,
        weeks: 4,
        days: [
          {
            id: uuidv4(),
            name: "Upper Power",
            description: "Bench + heavy upper",
            order: 0,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise(
                    "bench_press_bb",
                    "Barbell Bench Press",
                    0,
                    5,
                    "rpe"
                  ),
                  buildExercise(
                    "bent_over_row_bb",
                    "Bent-Over Row (BB)",
                    1,
                    6,
                    "rpe"
                  ),
                  buildExercise(
                    "overhead_press_bb",
                    "Overhead Press (BB)",
                    2,
                    5,
                    "rpe"
                  ),
                  buildExercise(
                    "curl_alt_db",
                    "Alternating DB Curl",
                    3,
                    10,
                    "rpe"
                  ),
                  buildExercise(
                    "triceps_pushdown_cable",
                    "Triceps Pushdown (Cable)",
                    4,
                    12,
                    "rpe"
                  ),
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Lower Power",
            description: "Squat/DL focus",
            order: 1,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise(
                    "back_squat_bb",
                    "Barbell Back Squat",
                    0,
                    5,
                    "rpe"
                  ),
                  buildExercise(
                    "conventional_deadlift_bb",
                    "Conventional Deadlift",
                    1,
                    4,
                    "rpe"
                  ),
                  buildExercise(
                    "leg_press_machine",
                    "Leg Press (Machine)",
                    2,
                    10,
                    "rpe"
                  ),
                  buildExercise(
                    "seated_calf_raise_machine",
                    "Seated Calf Raise",
                    3,
                    15,
                    "rpe"
                  ),
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Rest",
            description: "Rest day",
            order: 2,
            type: "rest",
            workout: [],
          },
          {
            id: uuidv4(),
            name: "Upper Volume",
            description: "Lighter hypertrophy upper",
            order: 3,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise(
                    "incline_press_db",
                    "Incline Press (DB)",
                    0,
                    10,
                    "rpe"
                  ),
                  buildExercise("curl_cable", "Cable Curl", 4, 12, "rpe"),
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Lower Volume",
            description: "Higher rep lower day",
            order: 4,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise("smith_squat_bb", "Smith Machine Squat", 0, 10),
                  buildExercise("leg_curl_machine", "Leg Curl Machine", 1, 12),
                  buildExercise(
                    "glute_kickback_cable",
                    "Glute Kickback (Cable)",
                    2,
                    15
                  ),
                  buildExercise(
                    "calf_raise_machine",
                    "Calf Raise Machine",
                    3,
                    15
                  ),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "template-minimalist-2day",
    name: "Minimalist",
    description: "A time-efficient full-body plan for busy lifters.",
    goal: "strength",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Day 1",
        description: "Squat + push + hinge",
        order: 0,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise("back_squat_bb", "Barbell Back Squat", 0, 6),
              buildExercise("incline_press_db", "Incline DB Press", 1, 8),
              buildExercise(
                "barbell_good_morning",
                "Barbell Good Morning",
                2,
                10
              ),
              buildExercise("plank_bw", "Plank", 3, 30), // seconds
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Day 2",
        description: "Deadlift + pull + core",
        order: 1,
        type: "workout",
        workout: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            exercises: [
              buildExercise(
                "conventional_deadlift_bb",
                "Conventional Deadlift",
                0,
                5
              ),
              buildExercise("row_seated_cable", "Seated Cable Row", 1, 10),
              buildExercise("cable_crunch", "Cable Crunch", 2, 12),
              buildExercise("copenhagen_plank", "Copenhagen Plank", 3, 20),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "template-conditioning-3day",
    name: "Conditioning + Strength",
    description: "Endurance, circuits, and light strength in one program.",
    goal: "endurance",
    mode: "days",
    createdAt: new Date(),
    updatedAt: new Date(),
    days: [
      {
        id: uuidv4(),
        name: "Strength",
        description: "Compound lifts",
        workout: [],
        order: 0,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Conditioning",
        description: "HIIT and sled work",
        workout: [],
        order: 1,
        type: "workout",
      },
      {
        id: uuidv4(),
        name: "Mixed",
        description: "Bodyweight circuits + carries",
        workout: [],
        order: 2,
        type: "workout",
      },
    ],
  },
  {
    id: "template-athlete-blocks",
    name: "Athlete Performance",
    description: "Train like an athlete—power, speed, and strength focused.",
    goal: "power",
    mode: "blocks",
    createdAt: new Date(),
    updatedAt: new Date(),
    blocks: [
      {
        id: uuidv4(),
        name: "Block 1",
        order: 0,
        days: [
          {
            id: uuidv4(),
            name: "Power",
            description: "Explosive lifts and jumps",
            order: 0,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise("sots_press_bb", "Sots Press", 0, 5),
                  buildExercise("box_jump_bw", "Box Jumps", 1, 6),
                  buildExercise("landmine_press", "Landmine Press", 2, 8),
                  buildExercise("broad_jump_bw", "Broad Jumps", 3, 4),
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Speed",
            description: "Sprints, agility, movement",
            order: 1,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise("tuck_jump_bw", "Tuck Jumps", 0, 6),
                  buildExercise("depth_jump_bw", "Depth Jumps", 1, 5),
                  buildExercise("single_leg_jump_bw", "Single Leg Jumps", 2, 5),
                  buildExercise("kb_racked_walk", "KB Racked Carry", 3, 30), // seconds
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Strength",
            description: "Heavy movement prep and max effort lifts",
            order: 2,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise("back_squat_bb", "Barbell Back Squat", 0, 5),
                  buildExercise("push_up_bw", "Push-Ups", 1, 20),
                  buildExercise(
                    "bent_over_row_bb",
                    "Barbell Bent Over Row",
                    2,
                    8
                  ),
                  buildExercise("plank_bw", "Plank Hold", 3, 45),
                ],
              },
            ],
          },
          {
            id: uuidv4(),
            name: "Recovery",
            description: "Mobility, activation, light core work",
            order: 3,
            type: "workout",
            workout: [
              {
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: [
                  buildExercise("jefferson_curl", "Jefferson Curl", 0, 10),
                  buildExercise("hip_airplane", "Hip Airplane", 1, 6),
                  buildExercise("dead_bug_bw", "Dead Bug", 2, 15),
                  buildExercise("copenhagen_plank", "Copenhagen Plank", 3, 20),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
