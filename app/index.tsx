import "global.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "~/components/ui/progressBar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { APP_NAME } from "~/lib/constants";
import { router } from "expo-router";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useAuthStore } from "~/store/useAuthStore";
import { getToken } from "~/services/api";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Welcome() {
  const { user } = useAuthStore();
  const token = getToken();
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Check if onboarding was already completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("onboardingComplete");
      if (completed) {
        if (!user ) {
          router.replace("/signup");
        } else {
          router.replace("/(tabs)/dashboard");
        }
      }
    };
    checkOnboardingStatus();
  }, []);

  const handleNextStep = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      await AsyncStorage.setItem("onboardingComplete", "true");
      router.replace("/signup");
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Progress Bar */}
      <ProgressBar steps={totalSteps} currentStep={step} />

      {/* Onboarding Steps */}
      {step === 0 && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
          <View style={styles.container}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>
              Welcome to {APP_NAME}
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>
              Let's begin your sustainable journey together.
            </Text>

            <Image
              style={styles.image}
              source={require("../assets/images/kunu.png")}
              placeholder={{ blurhash }}
              contentFit="fill"
              transition={1000}
            />

            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              ♻️ Track Your Impact
            </Text>
            <Text style={[styles.description, isDarkMode && styles.darkText]}>
              Monitor your daily eco-friendly activities and see how your small
              actions contribute to a bigger change for our planet.
            </Text>
          </View>
        </Animated.View>
      )}

      {step === 1 && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Smart Waste Tracking
          </Text>
          <Text style={[styles.description, isDarkMode && styles.darkText]}>
            Understand how KunuTech helps optimize waste collection through
            AI-powered tracking.
          </Text>
          <Image
            style={styles.image}
            source={require("../assets/images/kunu.png")}
            contentFit="fill"
          />
        </Animated.View>
      )}

      {step === 2 && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Get Started!
          </Text>
          <Text style={[styles.description, isDarkMode && styles.darkText]}>
            You’re ready to begin your journey towards a cleaner, greener
            environment.
          </Text>
          <Image
            style={styles.image}
            source={require("../assets/images/kunu.png")}
            contentFit="fill"
          />
        </Animated.View>
      )}

      {/* Buttons */}
      <View className="mt-8 flex-row justify-between">
        {step > 0 && (
          <Button className="bg-gray-300" onPress={() => setStep(step - 1)}>
            <Text>Back</Text>
          </Button>
        )}

        <Button className="bg-[#006400]" onPress={handleNextStep}>
          <Text>{step === totalSteps - 1 ? "Get Started" : "Continue"}</Text>
        </Button>
      </View>

      {/* Skip Button */}
      {step < totalSteps - 1 && (
        <Button
          className="mt-4"
          variant="outline"
          onPress={async () => {
            await AsyncStorage.setItem("onboardingComplete", "true");
            router.replace("/signup");
          }}
        >
          <Text>Skip Intro</Text>
        </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginTop: 20,
  },
  darkText: {
    color: "#ccc",
  },
});
