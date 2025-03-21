import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { useCollectorStore } from "@/store/useCollectorStore";

MapboxGL.setAccessToken("pk.eyJ1IjoiYWRqYXJub3IiLCJhIjoiY204N25qeWgwMGk4ejJpc2JuMHAwOXp6ayJ9.fNeJ92QoFwHEY_aFuZSw3A");

const CollectorMapScreen = ({ collectorId }: { collectorId: string }) => {
  const { route, fetchOptimizedRoute, loading, error } = useCollectorStore();

  useEffect(() => {
    fetchOptimizedRoute(collectorId);
  }, [collectorId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#32CD32" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={route[0] || [0, 0]}
        />

        {/* Display Optimized Route */}
        <MapboxGL.ShapeSource
          id="optimizedRoute"
          shape={{
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          }}
        >
          <MapboxGL.LineLayer
            id="routeLayer"
            style={{ lineColor: "#32CD32", lineWidth: 4 }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
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
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});

export default CollectorMapScreen;