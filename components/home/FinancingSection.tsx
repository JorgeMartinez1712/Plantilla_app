import { StyleSheet, Text, View } from "react-native";
import { useAuthContext } from '../../context/AuthContext';

const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export default function FinancingSection({ customerLevel }: { customerLevel?: string | null }) {
  const { customerDetails, loading, financialMetrics } = useAuthContext();

  if (loading) {
    return null;
  }

  const level = customerDetails?.levels?.[0];

  if (!level) {
    return null;
  }

  const amountNumber = parseFloat(level.credit_from);
  const creditLimitNumber = parseFloat(level.pivot.credit);

  const availableCreditNumber = financialMetrics && financialMetrics.creditoDisponible != null
    ? Number(financialMetrics.creditoDisponible)
    : amountNumber;

  const availableCreditPercentage = (availableCreditNumber / creditLimitNumber) * 100;

  const progressBarWidth = availableCreditPercentage > 100 ? 100 : availableCreditPercentage;

  return (
    <View style={styles.financingSection}>
      <View style={styles.financingHeader}>
        <View style={styles.greenDot} />
        <Text style={styles.financingTitle}>Financiamiento disponible</Text>
        {customerLevel ? (
          <View style={styles.levelTag}>
            <Text style={styles.levelTagText}>Nivel {customerLevel}</Text>
          </View>
        ) : null}
      </View>
  <Text style={styles.financingAmount}>{formatCurrency(availableCreditNumber, financialMetrics?.moneda ?? 'USD')}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressBarWidth}%` }]} />
      </View>
      <Text style={styles.installmentsText}>6 Cuotas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  financingSection: {
    backgroundColor: '#E5EBFC',
    borderRadius: 100,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  financingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  greenDot: {
    width: 16,
    height: 16,
    borderRadius: 100,
    backgroundColor: '#65B65F',
    marginRight: 5,
    marginLeft: 28,
    borderColor: '#ffffffff',
    borderWidth: 2,
  },
  financingTitle: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#363636',
    flex: 1,
  },
  infoIconContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D0D0D0',
    lineHeight: 15,
  },
  financingAmount: {
    fontSize: 48,
    lineHeight: 72,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#363636',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#65B65F',
    borderRadius: 3,
  },
  installmentsText: {
    fontSize: 6,
    lineHeight: 9,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#707070',
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
  levelTag: {
    marginRight: 10,
    backgroundColor: '#65B65F',
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  levelTagText: {
    fontSize: 10,
    color: '#ffffffff',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});