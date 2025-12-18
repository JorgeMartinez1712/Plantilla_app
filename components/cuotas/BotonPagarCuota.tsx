import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';
import SelectionModal from '../common/SelectionModal';

interface BotonPagarCuotaProps {
  saleId: string | string[] | undefined;
  selectedCuotaId: string | null;
  paymentAmount: number;
  nextInstallmentAmount?: number;
  nextInstallmentId?: string | null;
  totalDueAmount: number;
}

export default function BotonPagarCuota({ saleId, selectedCuotaId, paymentAmount, nextInstallmentAmount, nextInstallmentId, totalDueAmount }: BotonPagarCuotaProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const options = [
    { key: 'next_installment', label: 'Pagar Próxima Cuota', description: `Paga el monto de la próxima cuota: $${(typeof nextInstallmentAmount === 'number' ? nextInstallmentAmount : paymentAmount).toFixed(2)}`, left: <MaterialCommunityIcons name="calendar-check-outline" size={24} color="#65B65F" style={{ marginRight: 15 }} /> },
    { key: 'custom_amount', label: 'Pago Personalizado', description: 'Elige un monto específico para abonar a la deuda.', left: <MaterialCommunityIcons name="cash-multiple" size={24} color="#65B65F" style={{ marginRight: 15 }} /> },
    { key: 'total_due', label: 'Adelantar Total Pendiente', description: `Paga el total pendiente: $${totalDueAmount.toFixed(2)}`, left: <MaterialCommunityIcons name="currency-usd-off" size={24} color="#65B65F" style={{ marginRight: 15 }} /> },
  ];

  const navigateToPayment = (type: string) => {
    setModalVisible(false);
    router.push({
      pathname: '../(pagos-subscreens)/pagar',
      params: {
        saleId: saleId,
        installmentId: type === 'next_installment' ? nextInstallmentId : selectedCuotaId,
        paymentType: type,
        nextInstallmentAmount: (type === 'next_installment' && typeof nextInstallmentAmount === 'number') ? String(nextInstallmentAmount) : String(paymentAmount),
        totalDueAmount: totalDueAmount.toString(),
      },
    });
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.payButton} onPress={handlePress}>
        <View style={styles.textContainer}>
          <Text style={styles.payButtonText}>Realizar Pago</Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color="#fff" />
      </TouchableOpacity>
      <SelectionModal
        isVisible={modalVisible}
        title="Opciones de Pago"
        options={options}
        onSelect={(key) => navigateToPayment(key)}
        onClose={() => setModalVisible(false)}
        renderOption={(opt, onSelect) => (
          <TouchableOpacity key={opt.key} style={styles.payOption} onPress={() => onSelect(opt.key)}>
            {opt.left}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ fontSize: 16, fontFamily: FONTS.semiBold, color: '#363636' }}>{opt.label}</Text>
              {opt.description ? <Text style={{ fontSize: 12, color: '#777', marginTop: 2, fontFamily: FONTS.regular }}>{opt.description}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  payButton: {
    backgroundColor: '#65B65F',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});