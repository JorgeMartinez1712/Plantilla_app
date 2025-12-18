import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export default function LogoutConfirmationModal({ isVisible, onClose, onConfirmLogout }: LogoutConfirmationModalProps) {
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
            <View style={styles.iconContainer}>
              <MaterialIcons name="error-outline" size={40} color="#FF6347" />
            </View>
            <Text style={styles.modalText}>¿Está seguro de cerrar sesión?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onClose}
              >
                <Text style={styles.textStyleCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={onConfirmLogout}
              >
                <Text style={styles.textStyleConfirm}>Cerrar Sesión</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width * 0.8,
  },
  iconContainer: {
    backgroundColor: '#FFE3D7',
    borderRadius: 50,
    padding: 5,
    marginBottom: 15,
  },
modalText: {
  color: '#363636',
  textAlign: 'center',
  fontSize: 24,
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 27,
  letterSpacing: -0.19,
  marginBottom: 20,
  fontFamily: 'Poppins_700Bold',
},
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 0,
    paddingHorizontal: 15,
    elevation: 2,
    marginHorizontal: 5,
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  buttonCancel: {
    width: 128,
    height: 40,
    flexShrink: 0,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
  },
  buttonConfirm: {
    width: 128,
    height: 40,
    flexShrink: 0,
    borderRadius: 40,
    backgroundColor: '#65B65F',
  },
  textStyleCancel: {
    color: '#363636',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  textStyleConfirm: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
});