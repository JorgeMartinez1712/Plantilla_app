import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface PaymentHeaderProps {
  onBackPress: () => void;
}

export default function PaymentHeader({ onBackPress }: PaymentHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Realizar pago de cuotas</Text>
      <View style={styles.placeholderRight} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  placeholderRight: {
    width: 24,
  },
});