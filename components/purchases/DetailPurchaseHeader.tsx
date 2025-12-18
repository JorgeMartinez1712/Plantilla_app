import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrintIcon from '../../assets/iconos/print.svg';
import { FONTS } from '../../constants/fonts';

export default function DetailPurchaseHeader() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Detalle de Compra</Text>
      <TouchableOpacity style={styles.printButton}>
        <PrintIcon width={24} height={24} />
      </TouchableOpacity>
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
  printButton: {
    padding: 2,
  },
});