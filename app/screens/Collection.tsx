import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAppSelector } from '../store/hooks';
import PotteryTile from '../components/PotteryTile';

export default function Collection() {
  const potteryItems = useAppSelector((state) => state.pottery.items);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Collection</Text>
      {potteryItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pottery items yet</Text>
          <Text style={styles.emptySubtext}>Add your first piece to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={potteryItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PotteryTile pottery={item} />}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});