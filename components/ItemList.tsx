import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ItemCard from './ItemCard';
import { Item } from '~/lib/types';

type ItemListProps = {
  items: Item[];
};

const ItemListComponent: React.FC<ItemListProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ItemListComponent;