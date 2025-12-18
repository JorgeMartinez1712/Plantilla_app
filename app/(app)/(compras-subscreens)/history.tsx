import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from "react-native";
import HistoryCard from '../../../components/history/HistoryCard';
import HistoryHeader from '../../../components/history/HistoryHeader';
import SearchBarWithBasket from '../../../components/purchases/SearchBarWithBasket';
import { PurchaseItem, useSales } from '../../../hooks/useSales';

export default function HistoryScreen() {
  const router = useRouter();
  const { sales, loading, error } = useSales();

  const handleSearch = (text: string) => {
    console.log("Buscar en historial:", text);
  };

  const handleBasketPress = () => {
    console.log("Botón de cesta presionado desde historial");
  };

  const handleViewMore = (id: string) => {
    console.log("Ver más de historial:", id);
    router.push({ pathname: `/detail-purchase`, params: { id: id } });
  };

  return (
    <View style={styles.fullContainer}>
      <HistoryHeader />
      <SearchBarWithBasket onSearch={handleSearch} onBasketPress={handleBasketPress} />

      {loading && <Text style={styles.infoText}>Cargando historial de compras...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {!loading && !error && sales.length === 0 && (
        <Text style={styles.infoText}>No hay compras para mostrar.</Text>
      )}

      {!loading && !error && sales.length > 0 && (
        <FlatList
          data={sales}
          renderItem={({ item }: { item: PurchaseItem }) => (
            <HistoryCard
              productDescription={item.description}
              orderNumber={item.orderNumber}
              date={item.date}
              imageUri={{ uri: item.image }}
              onPress={() => handleViewMore(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.historyList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  historyList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#D8000C',
    fontFamily: 'Poppins_400Regular',
  },
});