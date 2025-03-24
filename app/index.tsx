import "global.css";
import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  View,
  useColorScheme,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import ToggleButton from "~/components/toggleButton";
import MapboxGL from "@rnmapbox/maps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { QRScanner, BluetoothScanner } from "~/components/qrBlueetoothScanners";

MapboxGL.setAccessToken("YOUR_ACCESS_TOKEN"); // Replace with env variable

interface Item {
  id: string;
  name: string;
  price: string;
  quantity: string;
  location: string;
}

interface SearchBarProps {
  isDarkMode: boolean;
}

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
}

interface ItemDetailCardProps {
  item?: Item | null;
}

const items: Item[] = [
  {
    id: "1",
    name: "Item 1",
    price: "$10",
    quantity: "2 pcs",
    location: "Accra",
  },
  {
    id: "2",
    name: "Item 2",
    price: "$25",
    quantity: "5 pcs",
    location: "Kumasi",
  },
];

interface RegisterDeviceSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}
type ConnectionMethod = "qr" | "bluetooth" | null;

const RegisterDeviceSheet: React.FC<RegisterDeviceSheetProps> = ({
  bottomSheetRef,
}) => {
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
      style={{
        borderRadius: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "#fff",
      }}
    >
      <BottomSheetView className="flex-1 py-6 px-4">
        {step === 0 && (
          <View className="gap-4 flex-1">
            <View>
              <Text className="text-2xl font-bold">Register New Device</Text>
              <Text className="text-sm text-gray-500">
                Connect a new tracking device to your account.
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-2">
                Scan the QR code or use Bluetooth to connect your device.
              </Text>
              <View className="grid grid-cols-2 gap-4 w-full">
                <Pressable
                  onPress={() => {
                    setSelectedMethod("qr");
                    nextStep();
                  }}
                  className="border border-gray-300 rounded-md items-center flex flex-col p-2 gap-2"
                >
                  <Feather name="camera" size={24} />
                  <Text className="text-lg font-bold text-black">
                    Scan the QR code
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
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
            </View>
          </View>
        )}

        {step === 1 && selectedMethod === "qr" && (
          <QRScanner onDetect={nextStep} />
        )}

        {step === 1 && selectedMethod === "bluetooth" && (
          <BluetoothScanner onSelect={nextStep} />
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

const Header: React.FC = () => (
  <View className="w-full h-18 flex flex-row justify-between items-center">
    <Text className="text-lg font-bold text-black dark:text-white">
      HweHwe Me
    </Text>
    <View className="flex flex-row gap-2">
      <Button className="p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 flex-row items-center">
        <Feather name="bluetooth" size={20} color="black" />
        <Text className="ml-2 text-black dark:text-white">Register</Text>
      </Button>
      <Button className="w-10 h-10 bg-gray-100 dark:bg-black border rounded-full flex items-center justify-center">
        <Feather name="plus" size={20} color="black" />
      </Button>
    </View>
  </View>
);

const SearchBar: React.FC<SearchBarProps> = ({ isDarkMode }) => (
  <View className="flex flex-row items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-4">
    <Feather name="search" size={20} color="gray" />
    <TextInput
      placeholder="Search"
      placeholderTextColor={isDarkMode ? "gray" : "black"}
      className="flex-1 px-2 py-1 text-black dark:text-white bg-transparent"
    />
  </View>
);

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => (
  <Pressable onPress={() => onSelect(item)}>
    <Card className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 my-2">
      <View className="flex flex-row items-center px-4 py-3 gap-3">
        <Feather name="shopping-bag" size={20} color="black" />
        <View className="flex-1">
          <Text className="text-black dark:text-white">{item.name}</Text>
          <Text className="text-gray-500">
            {item.price} • {item.quantity}
          </Text>
        </View>
      </View>
    </Card>
  </Pressable>
);

const ItemDetailCard: React.FC<ItemDetailCardProps> = ({ item }) => {
  if (!item) return null;
  return (
    <Card className="bg-white dark:bg-gray-800 p-4 gap-y-4 rounded-lg border border-gray-300 dark:border-gray-600">
      <View className="flex flex-row items-center justify-between gap-2">
        <View className="flex flex-row items-center gap-2">
          <Feather name="key" size={25} color="black" />
          <Text className="text-black">{item.name}</Text>
        </View>
        <Pressable>
          <Feather name="arrow-right" size={20} color="black" />
        </Pressable>
      </View>
      <View className="flex flex-row text-gray-300 ">
        <Feather name="map-pin" size={20} color="gray" />
        <Text className="text-gray-500">{item.location}</Text>
      </View>
      <MapboxGL.MapView style={{ width: "100%", height: 200 }} />
      <View className="mt-4 border-b-1 border-gray-300 mb-2 flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Feather name="navigation" size={20} color="black" />
          <Text className="text-black dark:text-white">Navigation</Text>
        </View>
        <Text className="text-gray-500">Updated 2 mins ago</Text>
      </View>
      <View className="flex flex-row w-full justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Button className="bg-white border-gray-200 border flex flex-row">
            <Feather name="play" size={20} color="black" />
            <Text className="text-black dark:text-white">Play Sound</Text>
          </Button>
          <Button className="bg-white border border-gray-200 flex flex-row">
            <Feather name="navigation" size={20} color="black" />
            <Text className="text-black dark:text-white">Direction</Text>
          </Button>
        </View>
        <Text className="text-gray-500">Updated</Text>
      </View>
    </Card>
  );
};

export default function Welcome() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        className={`flex-1 p-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <Header />
        <SearchBar isDarkMode={isDarkMode} />
        <View className="py-4">
          <ToggleButton
            options={["Items", "People"]}
            onToggle={(state) => console.log("Toggled to:", state)}
          />
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onSelect={setSelectedItem} />
          )}
        />
        {selectedItem && (
          <ScrollView>
            <ItemDetailCard item={selectedItem} />
          </ScrollView>
        )}
        <Button onPress={handlePresentModalPress}>
          <Feather name="plus" size={20} /> Register Device
        </Button>
        <RegisterDeviceSheet bottomSheetRef={bottomSheetRef} />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
