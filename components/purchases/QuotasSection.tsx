import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface QuotasSectionProps {
  quotas: {
    hasInstallments: boolean;
    totalInstallments: number;
    timePeriod: string;
    installmentAmount: string;
    installmentDueDate: string;
    currencySymbol: string;
  };
  onViewQuotasPress: () => void;
}

export default function QuotasSection({ quotas, onViewQuotasPress }: QuotasSectionProps) {
  if (!quotas.hasInstallments) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Cuotas</Text>
        <TouchableOpacity onPress={onViewQuotasPress} style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Detalles</Text>
          <MaterialCommunityIcons name="arrow-right-thin" size={18} color="#65B65F" />
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.installmentsContainer}>
          <Ionicons name="checkmark-circle" size={22} color="#01008A" />
          <Text style={styles.installmentsText}>{quotas.totalInstallments} Cuotas</Text>
        </View>
        <View style={styles.optionButton}>
          <Text style={styles.optionButtonText}>{quotas.timePeriod}</Text>
        </View>
        <Text style={styles.amountText}>{quotas.currencySymbol}{quotas.installmentAmount}</Text>
      </View>
      <Text style={styles.cancelationText}>Vence el {quotas.installmentDueDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#F6F9FF',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#65B65F',
    fontSize: 12,
    marginRight: 2,
    fontFamily: FONTS.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EBFC',
    borderRadius: 30,
    padding: 5,
    marginBottom: 15,
    height: 40,
    justifyContent: 'space-between',
  },
  optionButton: {
    width: 72,
    height: 26,
    flexShrink: 0,
    borderRadius: 60,
    backgroundColor: '#F5F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  installmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  installmentsText: {
    color: '#000000',
    fontFamily: FONTS.bold,
    fontSize: 14,
    marginLeft: 5,
  },
  optionButtonText: {
    color: '#004CFF',
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  amountText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#000000',
    paddingHorizontal: 15,
  },
  cancelationText: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    fontFamily: FONTS.regular,
  },
});