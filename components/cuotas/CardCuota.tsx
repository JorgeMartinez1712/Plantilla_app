import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface CardCuotaProps {
  date: string;
  amount: number;
  label: string;
  isActive: boolean;
  isPaid?: boolean;
}

export default function CardCuota({ date, amount, label, isActive, isPaid = false }: CardCuotaProps) {
  const isPaidStyle = isPaid ? styles.paidCard : {};
  const isPaidTextStyle = isPaid ? styles.paidText : {};

  return (
    <View style={[styles.card, isActive && !isPaid ? styles.activeCard : styles.inactiveCard, isPaidStyle]}>
      <Text
        style={[styles.cardDate, isActive && !isPaid ? styles.activeCardDate : styles.inactiveCardDate, isPaidTextStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {date}
      </Text>
      <Text
        style={[styles.cardAmount, isActive && !isPaid ? styles.activeCardAmount : styles.inactiveCardAmount, isPaidTextStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        ${amount.toFixed(2)}
      </Text>
      <Text
        style={[styles.cardLabel, isActive && !isPaid ? styles.activeCardLabel : styles.inactiveCardLabel, isPaidTextStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.75}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  borderRadius: 100,
  paddingVertical: 6,
  paddingHorizontal: 8,
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
  height: 70,
    overflow: 'hidden',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  activeCard: {
    backgroundColor: '#d2e5faff',
  },
  inactiveCard: {
    backgroundColor: '#F0F2F5',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  paidCard: {
    backgroundColor: '#d9f7be',
  },
  cardDate: {
  fontSize: 11,
  marginBottom: 0,
  fontFamily: FONTS.regular,
  textAlign: 'center',
  },
  activeCardDate: {
    color: '#4A60E3',
  },
  inactiveCardDate: {
    color: '#828282',
  },
  paidText: {
    color: '#00a300',
  },
  cardAmount: {
  fontSize: 16,
  fontFamily: FONTS.bold,
  marginBottom: 0,
  textAlign: 'center',
  },
  activeCardAmount: {
    color: '#4A60E3',
  },
  inactiveCardAmount: {
    color: '#828282',
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  activeCardLabel: {
    color: '#0025f4ff',
  },
  inactiveCardLabel: {
    color: '#828282',
  },
});