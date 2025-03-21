import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface DottedProgressIndicatorProps {
  totalSteps?: number;
}

export interface DottedProgressIndicatorRef {
  goNext: () => void;
  goBack: () => void;
  setStep: (step: number) => void;
  getCurrentStep: () => number;
}

const DottedProgressIndicator = forwardRef<
  DottedProgressIndicatorRef,
  DottedProgressIndicatorProps
>(({ totalSteps = 4 }, ref) => {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollRef = useRef<FlatList>(null);
  const progress = useSharedValue(0);

  // Function to move forward
  const goNext = () => {
    setCurrentStep((prev) => {
      if (prev < totalSteps) {
        const newStep = prev + 1;
        progress.value = withTiming(((newStep - 1) / (totalSteps - 1)) * 100, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        });

        scrollRef.current?.scrollToIndex({
          index: newStep - 1,
          animated: true,
        });
        return newStep;
      }
      return prev;
    });
  };

  // Function to move backward
  const goBack = () => {
    setCurrentStep((prev) => {
      if (prev > 1) {
        const newStep = prev - 1;
        progress.value = withTiming(((newStep - 1) / (totalSteps - 1)) * 100, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        });

        scrollRef.current?.scrollToIndex({
          index: newStep - 1,
          animated: true,
        });
        return newStep;
      }
      return prev;
    });
  };

  // Function to set a specific step
  const setStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      progress.value = withTiming(((step - 1) / (totalSteps - 1)) * 100, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });

      scrollRef.current?.scrollToIndex({ index: step - 1, animated: true });
    }
  };

  // Function to get the current step
  const getCurrentStep = () => currentStep;

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    goNext,
    goBack,
    setStep,
    getCurrentStep,
  }));

  // Animated style for the progress indicator
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <FlatList
        ref={scrollRef}
        data={Array.from({ length: totalSteps })}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ index }) => (
          <View
            style={[
              styles.dot,
              index + 1 === currentStep
                ? styles.activeDot
                : index + 1 < currentStep
                  ? styles.completedDot
                  : null,
            ]}
          />
        )}
        getItemLayout={(_, index) => ({
          length: 24, // Approximate dot size + margin
          offset: 24 * index,
          index,
        })}
      />

      {/* Animated Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={goBack}
          style={[styles.button, currentStep === 1 && styles.disabled]}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goNext}
          style={[styles.button, currentStep === totalSteps && styles.disabled]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "lightgray",
    marginHorizontal: 8,
  },
  activeDot: {
    backgroundColor: "blue",
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  completedDot: {
    backgroundColor: "green",
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginVertical: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DottedProgressIndicator;
