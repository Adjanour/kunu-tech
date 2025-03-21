import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BinComponent from '@/components/Bin';
import { Bin } from '@/lib/types';

type BinListProps = {
  bins: Bin[];
};

const BinListComponent: React.FC<BinListProps> = ({ bins }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Bins</Text>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BinComponent bin={item} />}
      />
      <TouchableOpacity style={styles.viewAllButton} onPress={() => console.log('View All')}>
        <Text style={styles.viewAllButtonText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width:"100%"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewAllButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  viewAllButtonText: {
    color: '#00c853',
  },
});

export default BinListComponent;