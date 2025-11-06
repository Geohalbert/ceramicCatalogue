import { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useFocusEffect } from '@react-navigation/native';

import PotteryTile from '../components/PotteryTile';
import { fetchPotteryItemsThunk } from '../store/potterySlice';

import CollectionStyles from './styles/CollectionStyles';

export default function Collection() {
  const dispatch = useAppDispatch();
  const potteryItems = useAppSelector((state) => state.pottery.items);
  const loading = useAppSelector((state) => state.pottery.loading);
  const error = useAppSelector((state) => state.pottery.error);

  // Load pottery items when the screen is focused
  useFocusEffect(() => {
    dispatch(fetchPotteryItemsThunk());
  });

  const handleRefresh = () => {
    dispatch(fetchPotteryItemsThunk());
  };

  const { container, title, emptyContainer, emptyText, emptySubtext, listContainer } = CollectionStyles;

  if (loading && potteryItems.length === 0) {
    return (
      <View style={container}>
        <Text style={title}>My Collection</Text>
        <View style={emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={emptySubtext}>Loading your pottery...</Text>
        </View>
      </View>
    );
  }

  if (error && potteryItems.length === 0) {
    return (
      <View style={container}>
        <Text style={title}>My Collection</Text>
        <View style={emptyContainer}>
          <Text style={emptyText}>Error loading pottery</Text>
          <Text style={emptySubtext}>{error}</Text>
          <Text style={emptySubtext}>Please check your Firebase configuration.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={container}>
      <Text style={title}>My Collection</Text>
      {potteryItems.length === 0 ? (
        <View style={emptyContainer}>
          <Text style={emptyText}>No pottery items yet</Text>
          <Text style={emptySubtext}>Add your first piece to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={potteryItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PotteryTile pottery={item} />}
          contentContainerStyle={listContainer}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}