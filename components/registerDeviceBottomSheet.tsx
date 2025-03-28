import { View, useColorScheme, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useState, useRef, useCallback } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { QRScanner, BluetoothScanner } from "~/components/qrBlueetoothScanners";
import useBLE from "~/lib/useBLE";

export interface RegisterDeviceSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

export type ConnectionMethod = "qr" | "bluetooth" | null;

const RegisterDeviceSheet: React.FC<RegisterDeviceSheetProps> = ({
  bottomSheetRef,
}) => {
  const { scanForPeripherals, allDevices, connectToDevice } = useBLE();
  const [step, setStep] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<ConnectionMethod>(null);

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(
    () => setStep((prev) => Math.max(prev - 1, 0)),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={["50%", "80%"]}
    >
      <BottomSheetView className="flex-1 py-6 px-4">
        {step === 0 && (
          <View className="gap-4 flex-1">
            <Text className="text-2xl font-bold">Register New Device</Text>
            <Text className="text-sm text-gray-500">
              Connect a new tracking device to your account.
            </Text>
            <Pressable
              onPress={() => {
                scanForPeripherals();
                setSelectedMethod("bluetooth");
                nextStep();
              }}
              className="border border-gray-300 rounded-md items-center justify-center flex flex-col p-2 gap-2"
            >
              <Feather name="bluetooth" size={24} />
              <Text className="text-lg font-bold text-black">
                Bluetooth Pairing
              </Text>
            </Pressable>
          </View>
        )}

        {step === 1 && selectedMethod === "bluetooth" && (
          <View className="gap-4">
            <Text className="text-xl font-bold">Available Devices</Text>
            {allDevices.map((device) => (
              <Pressable
                key={device.id}
                onPress={() => connectToDevice(device)}
                className="p-2 border rounded"
              >
                <Text>{device.name || "Unknown Device"}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {step > 0 && (
          <Button className="mt-4" onPress={prevStep}>
            <Feather name="arrow-left" size={20} /> <Text>Back</Text>
          </Button>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default RegisterDeviceSheet;
