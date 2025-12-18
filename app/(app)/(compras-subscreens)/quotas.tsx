import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotonPagarCuota from '../../../components/cuotas/BotonPagarCuota';
import CardCuota from '../../../components/cuotas/CardCuota';
import CardCuotaPagada from '../../../components/cuotas/CardCuotaPagada';
import OrderDetailCard from '../../../components/cuotas/OrderDetailCard';
import { Installment, useSales } from '../../../hooks/useSales';

function QuotasScreenHeader() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={headerStyles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
      </TouchableOpacity>
      <Text style={headerStyles.headerTitle}>Detalles de Cuotas</Text>
      <View style={headerStyles.placeholderRight} />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#F6F9FF',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  placeholderRight: {
    width: 24,
  },
});


export default function QuotasScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { saleId } = useLocalSearchParams();
  const { saleDetail, fetchSaleById, loading, error, fetchInstallmentById } = useSales();
  const [selectedCuotaId, setSelectedCuotaId] = useState<string | null>(null);
  const [paymentsForSelectedInstallment, setPaymentsForSelectedInstallment] = useState<any[]>([]);
  const [isFetchingPayments, setIsFetchingPayments] = useState(false);
  const [nextUnpaidPayments, setNextUnpaidPayments] = useState<any[]>([]);

  useEffect(() => {
    if (saleId) {
      const idString = Array.isArray(saleId) ? saleId[0] : saleId;
      fetchSaleById(idString);
    }
  }, [saleId, fetchSaleById]);

  

  

  const allInstallments = useMemo(() => {
    if (!saleDetail?.financing_contract?.installments) return [];
    return saleDetail.financing_contract.installments;
  }, [saleDetail]);

  const nextUnpaidInstallmentId = useMemo(() => {
    if (!allInstallments || allInstallments.length === 0) return null;
    const sorted = [...allInstallments].sort((a, b) => a.number - b.number);
    const next = sorted.find((i) => i.status?.code !== 'PAGADA');
    return next ? String(next.id) : null;
  }, [allInstallments]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!nextUnpaidInstallmentId) {
        setNextUnpaidPayments([]);
        return;
      }
      try {
        const detail = await fetchInstallmentById(Number(nextUnpaidInstallmentId));
        const payments = detail.payments || [];
        if (mounted) setNextUnpaidPayments(payments.map((p: any) => ({ amount: parseFloat(p.pivot?.amount_applied ?? p.amount ?? 0) || 0 })));
      } catch (e) {
        if (mounted) setNextUnpaidPayments([]);
      }
    })();
    return () => { mounted = false; };
  }, [nextUnpaidInstallmentId, fetchInstallmentById]);

  const orderData = useMemo(() => {
    if (!saleDetail) return { orderNumber: undefined, saleDate: undefined };

    const rawDate = saleDetail.sale_date;
    let formattedDate;

    if (rawDate) {
      const dateObj = new Date(rawDate);
      formattedDate = dateObj.toLocaleDateString('es-ES', { month: 'long', day: '2-digit', year: 'numeric' })
        .replace(/\b(\w)/g, char => char.toUpperCase());

      const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
      formattedDate = `${formattedDate} ${time}`;
    }

    return {
      orderNumber: saleDetail.saleCode,
      saleDate: formattedDate,
    };
  }, [saleDetail]);

  const regularCuotas = useMemo(() => {
    return allInstallments
      .filter(i => !i.is_inicial)
      .sort((a, b) => a.number - b.number)
      .map((cuota: Installment) => ({
        id: String(cuota.id),
        date: new Date(cuota.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
        amount: parseFloat(cuota.amount),
        label: `Cuota ${cuota.number}`,
        isPaid: cuota.status?.code === 'PAGADA',
        isNext: String(cuota.id) === nextUnpaidInstallmentId,
      }));
  }, [allInstallments, nextUnpaidInstallmentId]);

  const initialCuota = useMemo(() => {
    const initial = allInstallments.find(i => i.is_inicial);
    if (!initial) return null;

    return {
      id: String(initial.id),
      date: new Date(initial.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
      amount: parseFloat(initial.amount),
      label: 'Inicial',
      isPaid: initial.status?.code === 'PAGADA',
      isNext: String(initial.id) === nextUnpaidInstallmentId,
    };
  }, [allInstallments, nextUnpaidInstallmentId]);

  const allDisplayCuotas = useMemo(() => {
    return initialCuota ? [initialCuota, ...regularCuotas] : regularCuotas;
  }, [initialCuota, regularCuotas]);

  


  const fetchPaymentsForInstallment = useCallback(async (installmentId: number) => {
    setIsFetchingPayments(true);
    try {
      const installmentDetail = await fetchInstallmentById(installmentId);
      const payments = installmentDetail.payments || [];
      const processedPayments = payments.map((payment: any) => {
        const date = payment.pivot?.updated_at || payment.updated_at;
        const paymentMethodName = payment.payment_method?.name || 'Pago';
        const amountApplied = payment.pivot?.amount_applied ? parseFloat(payment.pivot.amount_applied) : parseFloat(payment.amount);

        const paymentDateFormatted = date
          ? new Date(date).toLocaleDateString('es-ES', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          : 'N/A';

        return {
          id: String(payment.id),
          date: paymentDateFormatted,
          amount: amountApplied,
          label: paymentMethodName,
        };
      }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPaymentsForSelectedInstallment(processedPayments);
    } catch (e) {
      console.error('Error al obtener el detalle de la cuota:', e);
      setPaymentsForSelectedInstallment([]);
    } finally {
      setIsFetchingPayments(false);
    }
  }, [fetchInstallmentById]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        if (saleId) {
          const idString = Array.isArray(saleId) ? saleId[0] : saleId;
          await fetchSaleById(idString);
        }
        if (isActive && selectedCuotaId) {
          await fetchPaymentsForInstallment(Number(selectedCuotaId));
        }
      })();
      return () => {
        isActive = false;
      };
    }, [saleId, fetchSaleById, selectedCuotaId, fetchPaymentsForInstallment])
  );

  const handleCardPress = useCallback(async (id: string) => {
    setSelectedCuotaId(id);
    await fetchPaymentsForInstallment(Number(id));
  }, [fetchPaymentsForInstallment]);

  useEffect(() => {
    if (saleDetail && !selectedCuotaId) {
      const installments = saleDetail.financing_contract?.installments || [];
      const sorted = [...installments].sort((a, b) => a.number - b.number);
      const next = sorted.find((i) => i.status?.code !== 'PAGADA');
      const initialInstallment = installments.find((i: any) => i.is_inicial) || sorted[0];
      const toSelect = next || initialInstallment;
      if (toSelect) {
        handleCardPress(String(toSelect.id));
      }
    }
  }, [saleDetail, selectedCuotaId, handleCardPress]);

  const handlePaidCardPress = async (id: string) => {
    router.push({
      pathname: '/detallepago',
      params: { id: id, from: pathname ?? '/' },
    });
  };

  const selectedCuota = allDisplayCuotas.find(c => c.id === selectedCuotaId);
  const selectedCuotaAmount = selectedCuota ? selectedCuota.amount : 0;
  const sumPaidForSelected = paymentsForSelectedInstallment.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const remainingAmountForSelected = Math.max(0, selectedCuotaAmount - sumPaidForSelected);

  const nextInstallment = allDisplayCuotas.find(c => c.id === nextUnpaidInstallmentId);
  const nextInstallmentAmount = nextInstallment ? nextInstallment.amount : 0;
  const sumPaidForNext = nextUnpaidPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const remainingAmountForNext = Math.max(0, nextInstallmentAmount - sumPaidForNext);
  const totalDueAmount = saleDetail?.outstanding_amount ? parseFloat(saleDetail.outstanding_amount) : 0;

  return (
    <View style={styles.container}>
      <QuotasScreenHeader />
      {loading && <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#65B65F" /><Text style={styles.infoText}>Cargando detalles de cuotas...</Text></View>}
      {error && <View style={styles.loadingContainer}><Text style={styles.errorText}>{error}</Text></View>}
      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <OrderDetailCard
            orderNumber={orderData.orderNumber}
            saleDate={orderData.saleDate}
          />

          {allDisplayCuotas.length > 0 && (
            <>
              <Text style={styles.financingTitle}>Financiamiento</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cuotasListContent}>
                {allDisplayCuotas.map((cuota) => (
                  <TouchableOpacity
                    key={cuota.id}
                    onPress={() => handleCardPress(cuota.id)}
                    activeOpacity={0.8}
                    style={styles.cardCuotaWrapper}
                  >
                        <CardCuota
                          date={cuota.date}
                          amount={cuota.amount}
                          label={cuota.label}
                          isActive={!!cuota.isNext && !cuota.isPaid}
                          isPaid={cuota.isPaid}
                        />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.financingTitle}>Pagos</Text>
          {isFetchingPayments && <Text style={styles.infoText}>Cargando pagos...</Text>}
          {!isFetchingPayments && paymentsForSelectedInstallment.length === 0 && (
            <Text style={styles.infoText}>No hay pagos registrados para la cuota seleccionada.</Text>
          )}
          {!isFetchingPayments && paymentsForSelectedInstallment.length > 0 && (
            <View style={styles.cuotasPagadasListContainer}>
              {paymentsForSelectedInstallment.map((cuota) => (
                <CardCuotaPagada
                  key={cuota.id}
                  id={cuota.id}
                  date={cuota.date}
                  amount={cuota.amount}
                  label={cuota.label}
                  onPress={handlePaidCardPress}
                />
              ))}
            </View>
          )}

        </ScrollView>
      )}
      {!loading && !error && allDisplayCuotas.length > 0 && (
        <View style={styles.botonPagarContainer}>
          <BotonPagarCuota
            saleId={saleId}
            selectedCuotaId={selectedCuotaId}
            paymentAmount={remainingAmountForSelected}
            nextInstallmentAmount={remainingAmountForNext}
            nextInstallmentId={nextUnpaidInstallmentId}
            totalDueAmount={totalDueAmount}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F9FF',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#D8000C',
    fontFamily: 'Poppins_400Regular',
  },
  scrollContent: {
    paddingBottom: 150,
  },
  financingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#36363663F',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  cuotasListContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#EAEFFF',
    borderRadius: 30,
    marginHorizontal: 10,
    gap: 10,
  },
  cardCuotaWrapper: {
    width: 100,
  },
  cuotasPagadasListContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
    marginHorizontal: 10,
    backgroundColor: '#F6F9FF',
  },
  botonPagarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingBottom: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
});