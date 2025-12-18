import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from '../../hooks/useHome';

interface ProductListProps {
  products: Product[];
  onProductPress: (productId: string) => void;
}


export default function ProductList({ products, onProductPress }: ProductListProps) {

  const handleVerMasPress = () => {
    console.log('Navegar a "Ver más"');
  };

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitleTop}>Lo más</Text>
          <Text style={styles.sectionTitleBottom}>destacado</Text>
        </View>
        <TouchableOpacity onPress={handleVerMasPress} style={styles.verMasButton}>
          <Text style={styles.verMasButtonText}>Ver más</Text>
          <MaterialIcons name="arrow-right-alt" size={20} color="#3076CC" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => onProductPress(item.id)}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            ) : null}
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>{item.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sectionTitleTop: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A0A0A0',
    lineHeight: 22,
    fontFamily: 'Poppins_700Bold',
  },
  sectionTitleBottom: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A0A0A0',
    lineHeight: 22,
    fontFamily: 'Poppins_700Bold',
  },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  verMasButtonText: {
    fontSize: 14,
    color: '#3076CC',
    fontWeight: '600',
    marginRight: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  productsList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    width: 160,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'left',
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 2,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#3076CC',
    fontWeight: '800',
    textAlign: 'left',
    fontFamily: 'Poppins_700Bold',
  },
  installmentsText: {
    fontSize: 12,
    color: '#10bd04ff',
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular',
  },
});