import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bin } from '~/lib/types';

type BinProps = {
  bin: Bin;
};

const BinComponent: React.FC<BinProps> = ({ bin }) => {
  const fillLevelColor = (bin.fillLevelPercentage ?? 0) < 50 ? 'green' : 'orange';

  return (
    <View style={styles.binContainer}>
      <Text style={styles.binName}>{bin.name}</Text>
      <View style={styles.addressContainer}>
        <Text style={styles.address}>{bin.address}</Text>
        <Text style={styles.distance}>{`${bin.distance} mi`}</Text>
      </View>
      <View style={styles.fillLevelContainer}>
        <Text style={styles.fillLevelLabel}>Fill Level</Text>
        <View style={styles.fillLevelBar}>
          <View style={[styles.fillLevelProgress, { width: bin.fillLevelPercentage ? `${bin.fillLevelPercentage}%` : '0%', backgroundColor: fillLevelColor }]} />
        </View>
        <Text style={styles.fillLevelPercentage}>{`${bin.fillLevel}% full`}</Text>
      </View>
      <View style={styles.typeContainer}>
        <Text style={styles.typeLabel}>Type</Text>
        <Text style={styles.type}>{bin.wasteType}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Get Directions')}>
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  binContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  binName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  address: {
    color: '#666',
  },
  distance: {
    color: '#999',
  },
  fillLevelContainer: {
    marginTop: 16,
  },
  fillLevelLabel: {
    color: '#666',
  },
  fillLevelBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  fillLevelProgress: {
    height: '100%',
    borderRadius: 4,
  },
  fillLevelPercentage: {
    color: '#666',
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  typeLabel: {
    color: '#666',
  },
  type: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius:15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  buttonText: {
    color: '#333',
  },
});

export default BinComponent;