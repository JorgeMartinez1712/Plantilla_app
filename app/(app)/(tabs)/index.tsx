import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import BrandsList from '../../../components/home/BrandsList';
import CategoryList from '../../../components/home/CategoryList';
import FinancingSection from '../../../components/home/FinancingSection';
import Header from '../../../components/home/Header';
import ProductList from '../../../components/home/ProductList';
import { FilterButton, SearchBar } from '../../../components/home/SearchBar';
import { COLORS, GLOBAL_STYLES } from '../../../constants/theme';
import { useAuthContext } from '../../../context/AuthContext';
import { useHome } from '../../../hooks/useHome';
import { usePushNotifications } from '../../../hooks/usePushNotifications';

const categories = [
  { id: '1', name: 'Teléfonos', image: 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/121032-iphone-16-pro-max.png' },
  { id: '2', name: 'Laptops', image: 'https://http2.mlstatic.com/D_NQ_NP_776134-MLV86345985151_062025-O.webp' },
  { id: '3', name: 'Tablets', image: 'https://media.education.studio7thailand.com/34526/Apple-iPad-Pro-12-9-Cellular-Space-Gray-2-square_medium.jpg' },
  { id: '4', name: 'Monitores', image: 'https://http2.mlstatic.com/D_NQ_NP_752172-MLV70840039997_082023-O.webp' },
  { id: '5', name: 'Accesorios', image: 'https://m.media-amazon.com/images/I/61CmrrKebAL.jpg' },
];

export default function HomeScreen() {
  const { brands, products, loading, error, fetchData } = useHome();
  const [refreshing, setRefreshing] = useState(false);
  const { registerAndSendToken } = usePushNotifications();
  const { user, isAuthenticated, customerDetails } = useAuthContext();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      registerAndSendToken(user.id);
    }
  }, [isAuthenticated, user?.id, registerAndSendToken]);

  const handleCategoryPress = (categoryId: string) => { };

  const handleBrandPress = (brandId: number) => { };

  const handleProductPress = (productId: string) => { };

  const handleFilterPress = () => {
    console.log("Abrir filtros desde HomeScreen");
  };

  if (loading) {
    return (
      <View style={GLOBAL_STYLES.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={GLOBAL_STYLES.errorContainer}>
        <Text style={GLOBAL_STYLES.errorText}>Ocurrió un error al cargar la información: {error}</Text>
      </View>
    );
  }

  const customerLevel = customerDetails && customerDetails.levels && customerDetails.levels.length > 0
    ? customerDetails.levels[0].nivel
    : null;

  return (
    <View style={GLOBAL_STYLES.fullContainer}>
      <Header customerLevel={customerLevel} />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.searchAndFilterContainer}>
          <View style={styles.searchBarWrapper}>
            <SearchBar />
          </View>
          <View style={styles.filterButtonWrapper}>
            <FilterButton onPress={handleFilterPress} />
          </View>
        </View>
        <FinancingSection customerLevel={customerLevel} />
        <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
        {brands.length > 0 && <BrandsList brands={brands} onBrandPress={handleBrandPress} />}
        {products.length > 0 && <ProductList products={products} onProductPress={handleProductPress} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchAndFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchBarWrapper: {
    flex: 0.8,
  },
  filterButtonWrapper: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
});