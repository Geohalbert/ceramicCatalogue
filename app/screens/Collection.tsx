import { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useTheme } from '../context/ThemeContext';

import PotteryTile from '../components/PotteryTile';
import AddItemButton from '../components/AddItemButton';
import CollectionDrawer from '../components/CollectionDrawer';
import SortBar, { SortOrder } from '../components/SortBar';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inProgress' | 'finished' | 'firing' | 'drying'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('dateNewest');

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

  // Filter and sort pottery items
  const filteredAndSortedItems = useMemo(() => {
    // First, filter items
    let filtered = potteryItems;
    if (selectedFilter === 'inProgress') {
      filtered = potteryItems.filter(item => item.potStatus === 'In Progress');
    } else if (selectedFilter === 'finished') {
      filtered = potteryItems.filter(item => item.potStatus === 'Finished');
    } else if (selectedFilter === 'firing') {
      filtered = potteryItems.filter(item => item.potStatus === 'Firing');
    } else if (selectedFilter === 'drying') {
      filtered = potteryItems.filter(item => item.potStatus === 'Drying');
    }

    // Then, sort items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'nameAsc':
          return a.potName.toLowerCase().localeCompare(b.potName.toLowerCase());
        case 'nameDesc':
          return b.potName.toLowerCase().localeCompare(a.potName.toLowerCase());
        case 'dateOldest':
          return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
        case 'dateNewest':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [potteryItems, selectedFilter, sortOrder]);

  const { container, title, emptyContainer, emptyText, emptySubtext, listContainer, storageIndicator, storageIndicatorText, hamburgerButton, hamburgerIcon } = CollectionStyles;

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

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={[container, { backgroundColor: colors.background, paddingTop: statusBarHeight + 10 }]}>
      {/* Header with Title and Hamburger Menu */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20, 
        paddingVertical: 15,
        marginBottom: 10,
        position: 'relative'
      }}>
        {/* Spacer for centering */}
        <View style={{ width: 48 }} />
        
        <Text style={[title, { color: colors.text, marginBottom: 0, position: 'absolute', left: 0, right: 0, textAlign: 'center' }]}>
          {t('collection.title')}
        </Text>
        
        <TouchableOpacity
          style={[hamburgerButton, { backgroundColor: colors.card, borderColor: colors.border, zIndex: 10 }]}
          onPress={() => setIsDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={[hamburgerIcon, { color: colors.text }]}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 15 }}>
        <AddItemButton /> 
      </View>

      {/* Sort Bar */}
      <SortBar sortOrder={sortOrder} onSortChange={setSortOrder} />
      
      {/* Storage indicator and filter badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        {isAuthenticated !== undefined && (
          <View style={[storageIndicator, { backgroundColor: colors.secondaryBackground }]}>
            <Text style={[storageIndicatorText, { color: colors.secondaryText }]}>
              {isAuthenticated ? t('collection.cloudStorage') : t('collection.localStorage')}
            </Text>
          </View>
        )}
        {selectedFilter !== 'all' && (
          <View style={[storageIndicator, { backgroundColor: colors.primary }]}>
            <Text style={[storageIndicatorText, { color: '#fff' }]}>
              {selectedFilter === 'inProgress' && t('collection.drawer.filters.inProgress')}
              {selectedFilter === 'finished' && t('collection.drawer.filters.finished')}
              {selectedFilter === 'firing' && t('collection.drawer.filters.firing')}
              {selectedFilter === 'drying' && t('collection.drawer.filters.drying')}
            </Text>
          </View>
        )}
      </View>
      
      {filteredAndSortedItems.length === 0 ? (
        <View style={emptyContainer}>
          <Text style={[emptyText, { color: colors.text }]}>
            {potteryItems.length === 0 ? t('collection.empty.title') : t('collection.noItemsForFilter')}
          </Text>
          <Text style={[emptySubtext, { color: colors.secondaryText }]}>
            {potteryItems.length === 0 ? t('collection.empty.subtitle') : t('collection.tryDifferentFilter')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PotteryTile pottery={item} />}
          contentContainerStyle={listContainer}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Drawer */}
      <CollectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </View>
  );
}