import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import MovementItem from '../../../components/pagos/MovementItem';
import { usePayments } from '../../../hooks/usePayments';

export default function PagosScreen() {
  const { movements, loadingHistory, errorHistory } = usePayments();

  return (
    <View style={styles.fullContainer}>
      <ScrollView contentContainerStyle={styles.contentScroll}>
        {loadingHistory ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />
        ) : errorHistory ? (
          <Text style={styles.errorText}>{errorHistory}</Text>
        ) : movements.length === 0 ? (
          <Text style={styles.emptyListText}>No tienes pagos registrados.</Text>
        ) : (
          <FlatList
            data={movements}
            renderItem={({ item }) => (
              <MovementItem
                id={item.id}
                date={item.date}
                description={item.description}
                amount={item.amount}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.movementsList}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  contentScroll: {
    paddingBottom: 20,
  },
  movementsList: {
    paddingHorizontal: 20,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
    paddingHorizontal: 20,
    fontFamily: 'Poppins_400Regular',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 50,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
});