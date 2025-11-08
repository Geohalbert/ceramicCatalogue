import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useTheme } from '../context/ThemeContext';

import PotteryTile from '../components/PotteryTile';
import AddItemButton from '../components/AddItemButton';
import { fetchPotteryItemsThunk } from '../store/potterySlice';
import CollectionStyles from './styles/CollectionStyles';

export default function Collection() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const potteryItems = useAppSelector((state) => state.pottery.items);
  const loading = useAppSelector((state) => state.pottery.loading);
  const error = useAppSelector((state) => state.pottery.error);
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated);
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

  const { container, title, emptyContainer, emptyText, emptySubtext, listContainer, storageIndicator, storageIndicatorText } = CollectionStyles;

  // Only show full loading screen on very first load (no items and haven't loaded yet)
  const isInitialLoad = loading && potteryItems.length === 0 && !hasInitiallyLoaded;

  if (isInitialLoad) {
    return (
      <View style={[container, { backgroundColor: colors.background }]}>
        <Text style={[title, { color: colors.text }]}>{t('collection.title')}</Text>
        <View style={emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[emptySubtext, { color: colors.secondaryText }]}>{t('collection.loading')}</Text>
        </View>
      </View>
    );
  }

  if (error && potteryItems.length === 0) {
    return (
      <View style={[container, { backgroundColor: colors.background }]}>
        <Text style={[title, { color: colors.text }]}>{t('collection.title')}</Text>
        <View style={emptyContainer}>
          <Text style={[emptyText, { color: colors.text }]}>{t('collection.error.title')}</Text>
          <Text style={[emptySubtext, { color: colors.secondaryText }]}>{error}</Text>
          <Text style={[emptySubtext, { color: colors.secondaryText }]}>{t('collection.error.checkConfig')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[container, { backgroundColor: colors.background }]}>
      <Text style={[title, { color: colors.text }]}>{t('collection.title')}</Text>

      <AddItemButton /> 
      
      {/* Storage indicator */}
      {isAuthenticated !== undefined && (
        <View style={[storageIndicator, { backgroundColor: colors.secondaryBackground }]}>
          <Text style={[storageIndicatorText, { color: colors.secondaryText }]}>
            {isAuthenticated ? t('collection.cloudStorage') : t('collection.localStorage')}
          </Text>
        </View>
      )}
      
      {potteryItems.length === 0 ? (
        <View style={emptyContainer}>
          <Text style={[emptyText, { color: colors.text }]}>{t('collection.empty.title')}</Text>
          <Text style={[emptySubtext, { color: colors.secondaryText }]}>{t('collection.empty.subtitle')}</Text>
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