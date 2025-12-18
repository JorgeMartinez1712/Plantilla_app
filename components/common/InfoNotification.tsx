import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InfoNotificationProps {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
}

export default function InfoNotification({ isVisible, message, onConfirm }: InfoNotificationProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
    >
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.iconContainer, styles.infoIconBg]}>
              <MaterialIcons name="info" size={40} color="#1976D2" />
            </View>
            <Text style={styles.modalText}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={onConfirm}
              >
                <Text style={styles.textStyleConfirm}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width * 0.85,
  },
  iconContainer: {
    borderRadius: 50,
    padding: 6,
    marginBottom: 12,
  },
  infoIconBg: {
    backgroundColor: '#E3F2FD',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#363636',
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#1976D2',
  },
  textStyleConfirm: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
});
