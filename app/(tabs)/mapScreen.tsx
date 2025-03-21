import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Card } from "@/components/ui/card"; // Import shadcn Card component
import { Text } from "~/components/ui/text";
import { useBinStore } from "../../store/useBinStore";
import { Bin } from "~/lib/types";

// Set Mapbox access token
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiYWRqYXJub3IiLCJhIjoiY204N25qeWgwMGk4ejJpc2JuMHAwOXp6ayJ9.fNeJ92QoFwHEY_aFuZSw3A",
);

const MapScreen = () => {
  const { bins, loading, fetchBins } = useBinStore();
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null); // State to track selected bin

  useEffect(() => {
    fetchBins(); // Fetch bins on load
  }, []);

  useEffect(() => {
    console.log("Bins updated:", bins[0]);
    // Filter bins to ensure latitude and longitude are valid numbers
    const filteredBins = bins.filter(
      (bin) => !isNaN(bin.latitude) && !isNaN(bin.longitude),
    );
    console.log("Filtered bins:", filteredBins);
  }, [bins]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#006400" />
      ) : (
        <>
          {/* Map View */}
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[-0.187, 5.603]}
            />

            {/* Render Markers */}
            {bins
              .filter((bin) => !isNaN(bin.latitude) && !isNaN(bin.longitude))
              .map((bin) => ({
                ...bin,
                longitude: Number(bin.longitude),
                latitude: Number(bin.latitude),
              }))
              .map((bin) => (
                <MapboxGL.PointAnnotation
                  key={bin.id}
                  id={`bin-${bin.id}`}
                  coordinate={[bin.longitude, bin.latitude]}
                  onSelected={() => setSelectedBin(bin)} // Show details when marker is tapped
                >
                  {/* Marker Icon */}
                  <View
                    style={
                      bin.fillLevel === "full"
                        ? styles.fullBin
                        : styles.emptyBin
                    }
                  />
                  {/* Tooltip */}
                  <MapboxGL.Callout title={bin.id} />
                </MapboxGL.PointAnnotation>
              ))}
          </MapboxGL.MapView>

          {/* Bin Details Modal */}
          {selectedBin && (
            <View style={styles.modalContainer}>
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Dustbin Details</Text>
                <Text>ID: {selectedBin.id}</Text>
                <Text>
                  Status:{" "}
                  {selectedBin.fillLevel
                    ? selectedBin.fillLevel.toUpperCase()
                    : "unknown"}
                </Text>
                <Text>Fill Level: {selectedBin.fillLevel}</Text>
                <Text>
                  Location: {selectedBin.latitude}, {selectedBin.longitude}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedBin(null)} // Close modal
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </Card>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fullBin: {
    width: 12,
    height: 12,
    backgroundColor: "red",
    borderRadius: 6,
  },
  emptyBin: {
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
  },
  modalContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MapScreen;
