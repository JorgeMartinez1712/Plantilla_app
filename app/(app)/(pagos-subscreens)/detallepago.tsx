import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CarritoIcono from '../../../assets/iconos/Carrito.svg';
import { usePayments } from '../../../hooks/usePayments';

export default function DetallePagoScreen() {
  const params = useLocalSearchParams();
  const id = params.id;
  const fromParam = params.from;
  const router = useRouter();
  const { paymentDetail, loadingDetail, errorDetail, fetchPaymentDetailById } = usePayments();

  useEffect(() => {
    if (id) {
      const paymentId = Array.isArray(id) ? id[0] : id;
      fetchPaymentDetailById(paymentId);
    }
  }, [id, fetchPaymentDetailById]);

  const processedData = useMemo(() => {
    if (!paymentDetail) return null;
    const saleCode = paymentDetail.sale?.sale_code ?? '----';
    const paymentMethodName = paymentDetail.payment_method?.name ?? 'Método no disponible';
    const amountConverted = parseFloat(paymentDetail.amount_converted || '0').toFixed(2);

    const rawPaymentDate = paymentDetail.installments?.[0]?.pivot?.created_at;

    let paymentDate = 'Fecha no disponible';
    if (rawPaymentDate) {
      paymentDate = new Date(rawPaymentDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    const retailUnitNameRaw = paymentDetail.retail_unit?.name ?? null;
    const retailUnitName = retailUnitNameRaw
      ? typeof retailUnitNameRaw === 'string' && retailUnitNameRaw.length > 20
        ? `${retailUnitNameRaw.substring(0, 20).trim()}...`
        : retailUnitNameRaw
      : null;

    const installments = paymentDetail.installments || [];
    const partialInstallment = installments.find((i: any) => i?.status?.code === 'PARCIAL');
    const amountAppliedNumber = partialInstallment
      ? parseFloat(partialInstallment?.pivot?.amount_applied || '0')
      : installments.reduce((acc: number, it: any) => acc + parseFloat(it?.pivot?.amount_applied || '0'), 0);
    const amountApplied = amountAppliedNumber.toFixed(2);

    const referenceNumber = paymentDetail.reference_number ?? '----';
    const statusName = paymentDetail.status?.name ?? '----';
    const statusCode = paymentDetail.status?.code ?? '----';

    const saleDateRaw = paymentDetail.sale?.sale_date ?? null;
    const saleDate = saleDateRaw
      ? new Date(saleDateRaw).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
      : null;

    const description = `Orden #${saleCode} - ${paymentMethodName}`;

    return {
      date: paymentDate,
      description: description,
      amountApplied: amountApplied,
      amountConverted: amountConverted,
      paymentMethodName: paymentMethodName,
      retailUnitName: retailUnitName,
      referenceNumber: referenceNumber,
      statusName: statusName,
      statusCode: statusCode,
      saleCode: saleCode,
      saleDate: saleDate,
      installments: installments,
    };
  }, [paymentDetail]);

  const handleGoBack = () => {
    const fromPath = fromParam ? (Array.isArray(fromParam) ? fromParam[0] : fromParam) : null;
    if (fromPath) {
      try {
        const target: any = String(fromPath);
        router.replace({ pathname: target });
        return;
      } catch {
      }
    }
    router.back();
  };

  if (loadingDetail) {
    return (
      <View style={[styles.fullContainer, styles.centered]}>
        <ActivityIndicator size="large" color="#65B65F" />
        <Text style={styles.infoText}>Cargando detalle del pago...</Text>
      </View>
    );
  }

  if (errorDetail) {
    return (
      <View style={[styles.fullContainer, styles.centered]}>
        <Text style={styles.errorText}>Error: {errorDetail}</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!processedData) {
    return (
      <View style={[styles.fullContainer, styles.centered]}>
        <Text style={styles.infoText}>Detalle de pago no encontrado.</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Detalle de pago</Text>
        <View style={headerStyles.placeholderRight} />
      </View>
      <ScrollView contentContainerStyle={styles.contentScroll}>
        <View style={styles.headerContent}>
          <CarritoIcono width={30} height={30} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerDate}>{processedData.date}</Text>
            <Text style={styles.headerDescription}>{processedData.description}</Text>
          </View>
          <Text style={[styles.headerAmount, { color: 'red' }]}>-{processedData.amountApplied} $</Text>
        </View>

        <View style={styles.transactionCard}>
          <Text style={styles.cardTitle}>Transacción</Text>
          <View style={styles.divider} />

           <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referencia</Text>
            <Text style={styles.detailValue}>{processedData.referenceNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monto convertido</Text>
            <Text style={styles.detailValue}>{processedData.amountConverted} Bs</Text>
          </View>

         
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estado</Text>
            <Text style={styles.detailValue}>{processedData.statusName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Método de pago</Text>
            <Text style={styles.detailValue}>{processedData.paymentMethodName}</Text>
          </View>

          {processedData.retailUnitName ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sucursal</Text>
              <Text style={styles.detailValue}>{processedData.retailUnitName}</Text>
            </View>
          ) : null}
        </View>

      </ScrollView>
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

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  contentScroll: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerDate: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
  },
  headerDescription: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  headerAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    fontFamily: 'Poppins_700Bold',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
  },
  installmentItem: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    color: '#363636',
    marginBottom: 5,
    fontFamily: 'Poppins_700Bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#363636',
    fontFamily: 'Poppins_500Medium',
  },
  detailValue: {
    fontSize: 16,
    color: '#707070',
    fontFamily: 'Poppins_400Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 15,
  },
  backButton: {
    backgroundColor: '#E5EBFC',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  backButtonText: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15,
    fontFamily: 'Poppins_400Regular',
  },
});