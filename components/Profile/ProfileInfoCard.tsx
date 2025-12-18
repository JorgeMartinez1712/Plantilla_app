import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProfileInfoCardProps {
  title: string;
  value: string | undefined;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onEditPress?: () => void;
  isEditing?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  placeholder?: string;
  isEditable?: boolean; 
}

export default function ProfileInfoCard({
  title,
  value,
  icon,
  onEditPress,
  isEditing = false,
  onChangeText,
  keyboardType = 'default',
  placeholder = '',
  isEditable = true,
}: ProfileInfoCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.contentRow}>
        {isEditing && isEditable ? (
          <TextInput
            style={styles.inputField}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor="#9E9E9E"
            autoCapitalize="none"
          />
        ) : (
          <Text style={styles.cardValue}>{value || 'No disponible'}</Text>
        )}
        {isEditable && icon && (
          <TouchableOpacity onPress={onEditPress} style={styles.editButtonContainer}>
            <MaterialIcons name={icon} size={20} color="white" />
          </TouchableOpacity>
        )}
        {!isEditable && icon && ( 
          <MaterialIcons name={icon} size={24} color="#9E9E9E" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202020',
    marginBottom: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardValue: {
    flex: 1,
    fontSize: 12,
    color: '#707070',
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#363636',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 5,
  },
  editButtonContainer: {
    backgroundColor: '#65B65F',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});