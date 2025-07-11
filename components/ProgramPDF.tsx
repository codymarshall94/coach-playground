import { Program } from "@/types/Workout";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  heading: { fontSize: 20, marginBottom: 20 },
  section: { marginBottom: 20 },
  blockName: { fontSize: 14, marginBottom: 10, fontWeight: "bold" },
  dayTitle: { fontSize: 13, marginBottom: 5, fontWeight: "bold" },
  exerciseName: { fontSize: 12, marginLeft: 10, marginBottom: 2 },
  setText: { fontSize: 11, marginLeft: 20, marginBottom: 2 },
});

export function ProgramPDF({ program }: { program: Program }) {
  const blocks = program.blocks ?? [
    { id: "solo", name: "", days: program.days || [], order: 0 },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{program.name}</Text>

        {blocks.map((block) => (
          <View key={block.id} style={styles.section}>
            {block.name && <Text style={styles.blockName}>{block.name}</Text>}

            {block.days.map((day) => (
              <View key={day.id} style={{ marginBottom: 10 }}>
                <Text style={styles.dayTitle}>{day.name}</Text>

                {day.workout?.map((workout, workoutIndex) => (
                  <View key={workoutIndex}>
                    {workout.exercise_groups.map((group) => (
                      <View key={group.id}>
                        {group.exercises.map((exercise) => (
                          <View key={exercise.id}>
                            <Text style={styles.exerciseName}>
                              {exercise.name}
                            </Text>
                            {exercise.sets.map((set, idx) => (
                              <Text key={idx} style={styles.setText}>
                                • Set {idx + 1}: {set.reps} reps{" "}
                                {set.one_rep_max_percent
                                  ? `@ ${set.one_rep_max_percent}%`
                                  : set.rpe
                                  ? `@ RPE ${set.rpe}`
                                  : ""}
                              </Text>
                            ))}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
