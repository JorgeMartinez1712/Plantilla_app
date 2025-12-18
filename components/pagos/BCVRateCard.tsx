import { Text, View } from 'react-native';
import { FONTS } from '../../constants/fonts';
import styles from './PayScreen.styles';

type Props = {
  rate?: string | number;
  rateDate?: string;
  amountConverted?: string | number | null;
};

function formatDateShort(dateStr?: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export default function BCVRateCard({ rate, rateDate, amountConverted }: Props) {
  const displayAmount = amountConverted != null && String(amountConverted) !== '' ? `${Number(amountConverted).toFixed(2)} Bs` : '—';
  const formattedDate = formatDateShort(rateDate);
  return (
    <View style={{ marginBottom: 12, padding: 12, backgroundColor: '#fff6e6', borderRadius: 8 }}>
      <Text style={{ fontFamily: FONTS.bold, marginBottom: 6 }}>Tasa BCV</Text>
      <Text style={{ color: '#363636', fontFamily: FONTS.regular }}>Tasa: {rate} (Fecha: {formattedDate})</Text>
      <View style={{ marginTop: 8 }}>
        <Text style={[styles.label, { marginBottom: 6 }]}>Monto a pagar (Bs)</Text>
        <Text style={{ fontSize: 18, fontFamily: FONTS.semiBold, color: '#363636' }}>{displayAmount}</Text>
      </View>
    </View>
  );
}
