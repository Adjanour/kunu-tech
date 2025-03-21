import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Item } from '~/lib/types';

type ItemCardProps = {
  item: Item;
};

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{`${item.points} pts`}</Text>
          <Text style={styles.postedAgo}>{item.postedAgo}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.sellerContainer}>
          <Text style={styles.sellerLabel}>Seller:</Text>
          <Text style={styles.seller}>{item.seller}</Text>
          {item.isNew && <Text style={styles.newLabel}>New</Text>}
        </View>
       
        <TouchableOpacity style={styles.contactButton} onPress={() => console.log('Contact Seller')}>
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  points: {
    color: '#00c853',
    fontWeight: 'bold',
  },
  postedAgo: {
    color: '#999',
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellerLabel: {
    color: '#666',
  },
  seller: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
  newLabel: {
    color: '#00c853',
    marginLeft: 'auto',
  },
  contactButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactButtonText: {
    color: '#333',
  },
});

export default ItemCard;