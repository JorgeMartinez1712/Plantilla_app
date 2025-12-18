import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import SettingItem from '../../../components/Profile/SettingItem';
import SettingsUser from '../../../components/Profile/SettingsUser';

export default function ProfileSettingsScreen() {

  const handleDevices = () => {
    Alert.alert("Dispositivos", "Navegar a la pantalla de gestión de dispositivos.");
  };

  const handlePrivacySecurity = () => {
    Alert.alert("Privacidad y Seguridad", "Navegar a la pantalla de privacidad y seguridad.");
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsUser
      />

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>General</Text>
        <SettingItem
          iconComponent={Ionicons}
          iconName="phone-portrait-outline"
          iconColor="#B6B6B6"
          iconSize={24}
          label="Dispositivos"
          onPress={handleDevices}
        />
        <SettingItem
          iconComponent={Ionicons}
          iconName="lock-closed-outline"
          iconColor="#B6B6B6"
          iconSize={24}
          label="Privacidad y Seguridad"
          onPress={handlePrivacySecurity}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  settingsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: 'Poppins_600SemiBold',
  },
});

