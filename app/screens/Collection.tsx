import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';

import PotteryTile from '../components/PotteryTile';

import CollectionStyles from './styles/CollectionStyles';

export default function Collection() {
  const potteryItems = useAppSelector((state) => state.pottery.items);

  const { container, title, emptyContainer, emptyText, emptySubtext, listContainer } = CollectionStyles;

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
        />
      )}
    </View>
  );
}