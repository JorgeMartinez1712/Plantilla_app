import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessNotification({ isVisible, message, onClose }: SuccessNotificationProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.iconContainer, styles.successIconBg]}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#65B65F" />
            </View>
            <Text style={styles.modalText}>{message}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onClose}
            >
              <Text style={styles.textStyleConfirm}>Aceptar</Text>
            </TouchableOpacity>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width * 0.8,
  },
  iconContainer: {
    borderRadius: 50,
    padding: 5,
    marginBottom: 15,
  },
  successIconBg: {
    backgroundColor: '#E6FFE6',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonConfirm: {
    backgroundColor: '#65B65F',
  },
  textStyleConfirm: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
});