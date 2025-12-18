import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';
import styles from './PayScreen.styles';

type Props = {
  destino: any;
  onCopy: (text: string) => void | Promise<void>;
  onCopyAll: () => void | Promise<void>;
};

export default function PaymentDestinoInfo({ destino, onCopy, onCopyAll }: Props) {
  const movil = destino?.destino_movil ?? '';
  const documento = destino?.destino_documemto ?? destino?.destino_documento ?? '';
  const banco = destino?.destino_banco ?? '';

  return (
    <View style={{ marginBottom: 12, padding: 12, backgroundColor: '#F0F8FF', borderRadius: 8 }}>
      <Text style={{ fontFamily: FONTS.bold, marginBottom: 6 }}>Destino del Pago Móvil</Text>
      <View style={styles.copyRow}>
        <Text style={styles.copyText}>Móvil: {movil}</Text>
        <TouchableOpacity style={styles.copyIconButton} onPress={() => onCopy(String(movil))}>
          <MaterialIcons name="content-copy" size={18} color="#545454" />
        </TouchableOpacity>
      </View>
      <View style={styles.copyRow}>
        <Text style={styles.copyText}>Documento: {documento}</Text>
        <TouchableOpacity style={styles.copyIconButton} onPress={() => onCopy(String(documento))}>
          <MaterialIcons name="content-copy" size={18} color="#545454" />
        </TouchableOpacity>
      </View>
      <View style={styles.copyRow}>
        <Text style={styles.copyText}>Banco destino: {banco || 'N/A'}</Text>
        <TouchableOpacity style={styles.copyIconButton} onPress={() => onCopy(String(banco))}>
          <MaterialIcons name="content-copy" size={18} color="#545454" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.copyAllButton} onPress={onCopyAll}>
        <MaterialIcons name="content-copy" size={18} color="#65B65F" />
        <Text style={styles.copyAllText}>  Copiar todo</Text>
      </TouchableOpacity>
    </View>
  );
}
