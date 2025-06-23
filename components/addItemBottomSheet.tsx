import { View, useColorScheme, Pressable } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import DeviceConfig from "~/components/DeviceConfig";
import HealthMonitor from "~/components/HealthMonitor";
import Avatar from "~/components/Avatar";
import { Card } from "~/components/ui/card";

export interface AddItemBottomSheetProps {
  addItemBottomSheetRef: React.RefObject<BottomSheetModal>;
}

const AddItemBottomSheet: React.FC<AddItemBottomSheetProps> = ({
  addItemBottomSheetRef,
}) => {
  return (
    <BottomSheetModal
      ref={addItemBottomSheetRef}
      index={0}
      snapPoints={["50%", "80%"]}
      style={{
        borderRadius: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "#fff",
      }}
    >
      <BottomSheetView className="flex-1 py-6 px-4">
          <Card className="flex flex-col items-center">
            <Avatar
              size={"xl"}
              source={{
                uri: "https://example.com/avatar.png", // Replace with your avatar URL
              }}
            />
            <Text className="text-lg font-semibold mt-4">Add New Item</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Choose the type of item to add
            </Text>
          </Card>

          <View className="mt-6 space-y-4">
            <DeviceConfig
              onConfig={(type) => {
                console.log("Selected Device Type:", type);
                addItemBottomSheetRef.current?.close();
              }}
            />
            
          </View>

          <Button
            className="mt-6"
            onPress={() => addItemBottomSheetRef.current?.close()}
          >
            Close
          </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AddItemBottomSheet;
