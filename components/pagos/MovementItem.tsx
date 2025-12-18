import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CarritoIcono from '../../assets/iconos/Carrito.svg';
import { FONTS } from '../../constants/fonts';

interface MovementItemProps {
  id: string;
  date: string;
  description: string;
  amount: number;
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(amount);
};

export default function MovementItem({ id, date, description, amount }: MovementItemProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const isNegative = amount < 0;
  const amountColor = isNegative ? '#FF0000' : '#4CAF50';
  const handlePress = () => {
    router.push({
      pathname: `/(app)/(pagos-subscreens)/detallepago`,
      params: { id: id, from: currentPath ?? '/' },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.movementItem}>
      <CarritoIcono width={24} height={24} color="#65B65F" style={styles.basketIcon} />
      <View style={styles.movementDetails}>
        <Text style={styles.movementDate}>{date}</Text>
        <Text style={styles.movementDescription}>{description}</Text>
      </View>
      <Text style={[styles.movementAmount, { color: amountColor }]}>
        {formatCurrency(amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  basketIcon: {
    marginRight: 15,
  },
  movementDetails: {
    flex: 1,
  },
  movementDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
    fontFamily: FONTS.regular,
  },
  movementDescription: {
    fontSize: 15,
    color: '#363636',
    fontFamily: FONTS.medium,
  },
  movementAmount: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginLeft: 10,
  },
});