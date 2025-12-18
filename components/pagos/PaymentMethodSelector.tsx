import { Text, TouchableOpacity, View } from 'react-native';
import { PaymentMethod } from '../../hooks/usePayments';
import PaymentMethodIcon from '../history/PaymentMethodIcon';
import styles from './PayScreen.styles';

type Props = {
  methods: PaymentMethod[];
  selectedId: number | null;
  onSelect: (method: PaymentMethod) => void | Promise<void>;
};

export default function PaymentMethodSelector({ methods, selectedId, onSelect }: Props) {
  return (
    <View style={styles.radioGroupVertical}>
      {methods.map((method) => (
        <TouchableOpacity key={method.id} style={styles.radioOptionVertical} onPress={() => onSelect(method)}>
          <View style={[styles.radioButton, selectedId === method.id && { borderColor: '#65B65F' }]}>
            {selectedId === method.id && <View style={styles.radioSelected} />}
          </View>
          <PaymentMethodIcon iconName={method.icon} size={18} color="#545454" />
          <Text style={[styles.radioLabel, { marginLeft: 10 }]}>{method.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
