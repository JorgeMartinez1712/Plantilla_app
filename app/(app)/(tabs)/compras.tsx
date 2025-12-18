import { useRouter } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FinanceSummary from '../../../components/purchases/FinanceSummary';
import PurchaseCard from '../../../components/purchases/PurchaseCard';
import SearchBarWithBasket from '../../../components/purchases/SearchBarWithBasket';
import { COLORS, FONTS, GLOBAL_STYLES } from '../../../constants/theme';
import { useAuthContext } from '../../../context/AuthContext';
import { useSales } from '../../../hooks/useSales';

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export default function PurchasesScreen() {
  const router = useRouter();
  const { customerDetails, financialMetrics } = useAuthContext();
  const { sales, loading, error } = useSales();

  const handleSearch = (text: string) => {
    console.log("Buscar:", text);
  };

  const handleBasketPress = () => {
    console.log("Botón de cesta presionado");
  };

  const handleViewPayments = () => {
    router.push('/pagos');
  };

  const financingAmount = customerDetails?.levels?.[0]?.pivot?.credit
    ? parseFloat(customerDetails.levels[0].pivot.credit)
    : 0;

  const totalPaidAmount = financialMetrics?.totalPagado ?? financialMetrics?.total_pagado ?? 0;

  const getMonthName = (date: Date) => {
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return monthNames[date.getMonth()];
  };

  const currentMonthTitle = getMonthName(new Date());

  return (
    <View style={GLOBAL_STYLES.fullContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <SearchBarWithBasket onSearch={handleSearch} onBasketPress={handleBasketPress} />
        <FinanceSummary
          monthTitle={currentMonthTitle}
          progressText="Progreso"
          financingAmount={financingAmount}
          financialMetrics={financialMetrics}
          motivationText={'🎉 ¡Sigue así! ¡Lo estás haciendo genial!'}
        />
        {loading && <Text style={GLOBAL_STYLES.infoText}>Cargando compras...</Text>}
        {error && <Text style={GLOBAL_STYLES.errorText}>Error: {error}</Text>}
        {!loading && !error && sales.length === 0 ? (
          <Text style={GLOBAL_STYLES.infoText}>No hay compras para mostrar.</Text>
        ) : (
          <FlatList
            data={sales}
            renderItem={({ item }) => (
              <PurchaseCard
                orderNumber={item.orderNumber}
                deliveryType={item.deliveryType}
                status={item.status}
                elementsCount={item.elementsCount}
                imageUri={{ uri: item.image }}
                id={item.id}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 0 }}
            scrollEnabled={false}
          />
        )}
        <View style={styles.totalAndPaidContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalPaidAmount)}</Text>
          <TouchableOpacity onPress={handleViewPayments} style={styles.paidButtonWrapper}>
            <Text style={styles.paidButtonText}>Pagado</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  totalAndPaidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 50,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    paddingLeft: 20,
    paddingRight: 10,
  },
  totalText: {
    fontSize: 18,
    color: '#363636',
    fontFamily: FONTS.regular,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3076CC',
    flex: 1,
    textAlign: 'left',
    marginLeft: 10,
    fontFamily: '5000Medium', // This font seems specific, maybe keep or replace with FONTS.medium if available
  },
  paidButtonWrapper: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  paidButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.regular,
  },
});