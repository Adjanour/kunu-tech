import { View, useColorScheme, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useState, useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { NewDeviceDialog } from "./newDevice";

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
        <NewDeviceDialog onAddDevice={() => {}} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AddItemBottomSheet;
