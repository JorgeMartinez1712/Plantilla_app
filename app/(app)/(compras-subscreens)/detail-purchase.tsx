import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';
import DetailPurchaseHeader from '../../../components/purchases/DetailPurchaseHeader';
import ProductSummaryCard from '../../../components/purchases/ProductSummaryCard';
import QuotasSection from '../../../components/purchases/QuotasSection';
import ReceiptDetailsSection from '../../../components/purchases/ReceiptDetailsSection';
import { useSales } from '../../../hooks/useSales';

export default function DetailPurchaseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { saleDetail, fetchSaleById, loading, error } = useSales();

  useEffect(() => {
    if (id) {
      const saleId = Array.isArray(id) ? id[0] : id;
      fetchSaleById(saleId);
    }
  }, [id, fetchSaleById]);

  const processedData = useMemo(() => {
    if (!saleDetail) return null;

    const firstItem = saleDetail.sale_items?.[0];
    const product = firstItem?.product;

    const productImage = saleDetail.productImage
      ? ({ uri: saleDetail.productImage } as ImageSourcePropType)
      : null;

    const installments = saleDetail.financing_contract?.installments || [];

    const initialInstallment = installments.find(i => i.is_inicial);

    const regularInstallments = installments
      .filter(i => !i.is_inicial)
      .sort((a, b) => a.number - b.number);

    const totalInstallments = regularInstallments.length;

    const firstInstallment = regularInstallments.length > 0
      ? regularInstallments[0]
      : null;

    const lastInstallment = regularInstallments.length > 0
      ? regularInstallments[regularInstallments.length - 1]
      : null;

    const penultimateInstallment = regularInstallments.length >= 2
      ? regularInstallments[regularInstallments.length - 2]
      : regularInstallments.length === 1 ? regularInstallments[0] : null;

    let timePeriod = 'N/A';
    if (firstInstallment && lastInstallment) {
      const firstDate = new Date(firstInstallment.due_date);
      const lastDate = new Date(lastInstallment.due_date);
      const yearDiff = lastDate.getFullYear() - firstDate.getFullYear();
      const monthDiff = lastDate.getMonth() - firstDate.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;
      timePeriod = `${totalMonths > 0 ? totalMonths + 1 : 1} Meses`;
    }

    const installmentAmount = firstInstallment?.amount ? parseFloat(firstInstallment.amount).toFixed(2) : '0.00';

    const installmentDueDate = penultimateInstallment?.due_date
      ? new Date(penultimateInstallment.due_date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      : 'Fecha no disponible';

    const saleDate = saleDetail.sale_date ? new Date(saleDetail.sale_date).toLocaleDateString('es-ES') : 'Fecha no disponible';
    const currencySymbol = saleDetail.currency?.symbol || '$';
    const productPrice = parseFloat(firstItem?.total_price || '0').toFixed(2);
    const totalAmount = parseFloat(saleDetail.financing_contract?.total_amount_pay || saleDetail.sale_amount || '0').toFixed(2);

    return {
      product: {
        name: product?.name,
        image: productImage,
      },
      summary: {
        orderNumber: saleDetail.saleCode,
      },
      quotas: {
        hasInstallments: installments.length > 0,
        totalInstallments,
        timePeriod,
        installmentAmount,
        installmentDueDate,
        currencySymbol,
        initialInstallmentId: initialInstallment?.id,
      },
      receipt: {
        id: saleDetail.id,
        customer: saleDetail.customer,
        saleCode: saleDetail.saleCode,
        saleDate,
        productName: product?.name,
        productPrice,
        totalAmount,
        currencySymbol,
        totalInstallments,
      }
    };
  }, [saleDetail]);

  const handleViewQuotas = async () => {
    const saleId = processedData?.receipt.id;

    if (saleId) {
      router.push({
        pathname: '/quotas',
        params: { saleId }
      });
    } else {
      console.error('ID de venta no disponible para navegar a cuotas.');
    }
  };

  return (
    <View style={styles.fullContainer}>
      <DetailPurchaseHeader />
      {loading && <Text style={styles.infoText}>Cargando detalles de la compra...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {processedData && (
        <ScrollView contentContainerStyle={styles.contentScroll}>
          <ProductSummaryCard product={processedData.product} summary={processedData.summary} />
          <QuotasSection quotas={processedData.quotas} onViewQuotasPress={handleViewQuotas} />
          <ReceiptDetailsSection receipt={processedData.receipt} />
        </ScrollView>
      )}
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