import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WarningNotificationProps {
  isVisible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function WarningNotification({ isVisible, message, onConfirm, onCancel }: WarningNotificationProps) {
  const hasCancel = !!onCancel;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
    >
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFillObject}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.iconContainer, styles.warningIconBg]}>
              <MaterialIcons name="warning" size={40} color="#FFD700" />
            </View>
            <Text style={styles.modalText}>{message}</Text>
            <View style={styles.buttonContainer}>
              {hasCancel && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={onCancel}
                >
                  <Text style={styles.textStyleCancel}>Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm, !hasCancel && styles.singleButton]}
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
  warningIconBg: {
    backgroundColor: '#FFF8E1',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#E0E0E0',
  },
  buttonConfirm: {
    backgroundColor: '#65B65F',
  },
  singleButton: {
    marginHorizontal: 0,
  },
  textStyleCancel: {
    color: '#363636',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  textStyleConfirm: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
});