import { Text, View } from 'react-native';
import { FONTS, GLOBAL_STYLES } from '../../../constants/theme';

export default function ConsultsScreen() {
  return (
    <View style={GLOBAL_STYLES.loadingContainer}>
      <Text style={{ fontSize: 24, fontFamily: FONTS.bold, marginBottom: 10 }}>Consultas</Text>
      <Text style={GLOBAL_STYLES.infoText}>¿Necesitas ayuda? Haz tus preguntas aquí.</Text>
    </View>
  );
}