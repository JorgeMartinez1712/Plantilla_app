import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TarjetaIcono from '../../assets/iconos/tarjeta-verde.svg';
import { FONTS } from '../../constants/fonts';

interface CardCuotaPagadaProps {
  id: string;
  date: string;
  amount: number;
  label: string;
  onPress: (id: string) => Promise<void>;
}

export default function CardCuotaPagada({ id, date, amount, label, onPress }: CardCuotaPagadaProps) {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.card} activeOpacity={0.8}>
      <View style={styles.leftContent}>
        <TarjetaIcono width={30} height={30} />
        <View style={styles.textContainer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: '#000',
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    color: '#000',
    marginBottom: 2,
    fontFamily: FONTS.regular,
  },
  amount: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#000',
  },
});