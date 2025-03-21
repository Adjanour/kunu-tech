import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  steps: number; // Total number of steps
  currentStep: number; // Current active step
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Circle Indicator */}
          <View
            style={[
              styles.circle,
              index <= currentStep ? styles.active : styles.inactive,
            ]}
          />

          {/* Connecting Line (Only between circles) */}
          {index < steps - 1 && (
            <View style={styles.lineContainer}>
              <View
                style={[
                  styles.line,
                  index < currentStep ? styles.activeLine : styles.inactiveLine,
                ]}
              />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  active: {
    backgroundColor: "#006400",
  },
  inactive: {
    backgroundColor: "#00640020",
  },
  lineContainer: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  line: {
    height: "100%",
  },
  activeLine: {
    backgroundColor: "#006400",
  },
  inactiveLine: {
    backgroundColor: "#00640020",
  },
});

export default ProgressBar;
