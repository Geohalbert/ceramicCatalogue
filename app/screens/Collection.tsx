import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';

import PotteryTile from '../components/PotteryTile';
import { fetchPotteryItemsThunk } from '../store/potterySlice';

import CollectionStyles from './styles/CollectionStyles';

export default function Collection() {
  const dispatch = useAppDispatch();
  const potteryItems = useAppSelector((state) => state.pottery.items);
  const loading = useAppSelector((state) => state.pottery.loading);
  const error = useAppSelector((state) => state.pottery.error);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Load pottery items only on initial mount
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      dispatch(fetchPotteryItemsThunk());
      setHasInitiallyLoaded(true);
    }
  }, [dispatch, hasInitiallyLoaded]);

  const handleRefresh = () => {
    dispatch(fetchPotteryItemsThunk());
  };

  const { container, title, emptyContainer, emptyText, emptySubtext, listContainer } = CollectionStyles;

  // Only show full loading screen on very first load (no items and haven't loaded yet)
  const isInitialLoad = loading && potteryItems.length === 0 && !hasInitiallyLoaded;

  if (isInitialLoad) {
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