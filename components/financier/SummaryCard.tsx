import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface SummaryCardProps {
  totalFinanced: number;
  monthlyPayment: number;
  totalToPay: number;
  initialPayment: number;
  capital: number;
  interest: number;
  basePrice: number;
  onShare: () => void;
}

export default function SummaryCard({
  totalFinanced,
  monthlyPayment,
  initialPayment,
  capital,
  interest,
  basePrice,
  onShare
}: SummaryCardProps) {
  const totalBarValue = basePrice + interest;
  const initialPercentage = totalBarValue > 0 ? (initialPayment / totalBarValue) * 100 : 0;
  const capitalPercentage = totalBarValue > 0 ? (capital / totalBarValue) * 100 : 0;
  const interestPercentage = totalBarValue > 0 ? (interest / totalBarValue) * 100 : 0;
  
  const totalProductPriceWithInterest = basePrice + interest;

  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainAmount}>${totalFinanced.toFixed(2)} Financiado</Text>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={onShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="share" size={28} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Monto por cuota</Text>
        <Text style={styles.detailValue}>${monthlyPayment.toFixed(2)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total a pagar</Text>
        <Text style={styles.detailValues}>${totalProductPriceWithInterest.toFixed(2)}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarSegment, styles.initialSegment, { width: `${initialPercentage}%` }]} />
        <View style={[styles.progressBarSegment, styles.cuotasSegment, { width: `${interestPercentage}%` }]} />
        <View style={[styles.progressBarSegment, styles.capitalSegment, { width: `${capitalPercentage}%` }]} />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.initialSegment]} />
          <Text style={styles.legendText}>Inicial</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.cuotasSegment]} />
          <Text style={styles.legendText}>Intereses</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.capitalSegment]} />
          <Text style={styles.legendText}>Capital</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainAmount: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  shareButton: {
    padding: 5,
    borderRadius: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#555',
    fontFamily: FONTS.regular,
  },
  detailValue: {
    fontSize: 16,
    color: '#707070',
    fontFamily: FONTS.regular,
  },
  detailValues: {
    fontSize: 16,
    color: '#65B65F',
    fontFamily: FONTS.bold,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
  },
  progressBarSegment: {
    height: '100%',
  },
  initialSegment: {
    backgroundColor: '#65B65F',
  },
  cuotasSegment: {
    backgroundColor: '#FE0',
  },
  capitalSegment: {
    backgroundColor: '#1D67C2',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#555',
  },
});