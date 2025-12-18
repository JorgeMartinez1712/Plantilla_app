import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SaveChangesButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

export default function SaveChangesButton({ onPress, isLoading }: SaveChangesButtonProps) {
  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#3076CC', 
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 120,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});