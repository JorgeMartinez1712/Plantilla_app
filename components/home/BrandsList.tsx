import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ASSETS_BASE_URL } from '../../constants/api';

interface Brand {
  id: number;
  name: string;
  logo: string | null;
}

interface BrandsListProps {
  brands: Brand[];
  onBrandPress: (brandId: number) => void;
}

export default function BrandsList({ brands, onBrandPress }: BrandsListProps) {

  function renderBrand({ item }: { item: Brand }) {
    if (!item.logo) return null;
    const imageUrl = item.logo.includes('http') ? item.logo : `${ASSETS_BASE_URL}${item.logo}`;

    return (
      <TouchableOpacity style={styles.brandItem} onPress={() => onBrandPress(item.id)}>
        <View style={styles.brandImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.brandImage} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Marcas</Text>
      <FlatList
        data={brands}
        renderItem={renderBrand}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F9FF',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#363636',
    marginBottom: 15,
    marginHorizontal: 20,
    fontFamily: 'Poppins_500Medium',
  },
  brandsList: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  brandItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  brandImageContainer: {
    width: 100,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  brandImage: {
    width: 60,
    height: 30,
    resizeMode: 'contain',
  },
});