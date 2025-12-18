import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface ReceiptDetailsSectionProps {
  receipt: {
    id: string;
    customer: any;
    saleCode: string;
    saleDate: string;
    productName: string;
    productPrice: string;
    totalAmount: string;
    currencySymbol: string;
    totalInstallments: number;
  };
}

export default function ReceiptDetailsSection({ receipt }: ReceiptDetailsSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <Text style={styles.receiptNumber}>RECIBO</Text>
        <Text style={styles.receiptId}>#{receipt.id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Nombre Completo</Text>
        <Text style={styles.detailValue}>{receipt.customer?.full_name}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Dirección</Text>
        <Text style={styles.detailValue}>{receipt.customer?.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Teléfono</Text>
        <Text style={styles.detailValue}>{receipt.customer?.phone_number}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Orden</Text>
        <Text style={styles.detailValue}>#{receipt.saleCode}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Fecha</Text>
        <Text style={styles.detailValue}>{receipt.saleDate}</Text>
      </View>
      <View style={[styles.detailRow, styles.lastDetailRowWithBorder]}>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalAmount}>{receipt.currencySymbol}{receipt.productPrice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptNumber: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginRight: 10,
  },
  receiptId: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#363636',
    flex: 1,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#004CFF',
    fontSize: 14,
    marginRight: 5,
    fontFamily: FONTS.regular,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#979797',
    fontFamily: FONTS.regular,
  },
  detailLabelContainer: {
    flex: 1,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 14,
    color: '#363636',
    fontFamily: FONTS.medium,
    textAlign: 'right',
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  lastDetailRowWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 15,
    marginBottom: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  totalLabel: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: '#65B65F',
  },
});