import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

export default function PurchaseHeader() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Compras</Text>
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
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  placeholderRight: {
    width: 24,
  },
});