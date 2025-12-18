import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProfileCardSectionProps {
  cardDetails: {
    nameOnCard: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  onCardFieldChange: (field: string, value: string) => void;
  onEditPress: () => void;
  isEditing: boolean;
  onDeletePress: () => void;
}

export default function ProfileCardSection({
  cardDetails,
  onCardFieldChange,
  onEditPress,
  isEditing,
  onDeletePress,
}: ProfileCardSectionProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Editar Tarjeta</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onEditPress} style={styles.editButtonContainer}>
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeletePress} style={styles.deleteButtonContainer}>
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Nombre en la Tarjeta</Text>
      <View style={styles.inputContainer}>
        {isEditing ? (
          <TextInput
            style={styles.inputField}
            value={cardDetails.nameOnCard}
            onChangeText={(text) => onCardFieldChange('nameOnCard', text)}
            placeholder="Nombre en la tarjeta"
            placeholderTextColor="#9E9E9E"
            autoCapitalize="words"
          />
        ) : (
          <Text style={styles.cardValueStatic}>{cardDetails.nameOnCard || 'No especificado'}</Text>
        )}
      </View>

      <Text style={styles.label}>Número de tarjeta</Text>
      <View style={styles.inputContainer}>
        {isEditing ? (
          <TextInput
            style={styles.inputField}
            value={cardDetails.cardNumber}
            onChangeText={(text) => onCardFieldChange('cardNumber', text.replace(/\s/g, ''))}
            placeholder="**** **** **** XXXX"
            placeholderTextColor="#9E9E9E"
            keyboardType="numeric"
            maxLength={19}
          />
        ) : (
          <Text style={styles.cardValueStatic}>{cardDetails.cardNumber || 'No especificado'}</Text>
        )}
      </View>

      <View style={styles.expiryCvvRow}>
        <View style={styles.expiryCvvColumn}>
          <Text style={styles.label}>Vence</Text>
          <View style={styles.inputContainer}>
            {isEditing ? (
              <TextInput
                style={styles.inputField}
                value={cardDetails.expiryDate}
                onChangeText={(text) => onCardFieldChange('expiryDate', text)}
                placeholder="MM/AA"
                placeholderTextColor="#9E9E9E"
                keyboardType="numeric"
                maxLength={5}
              />
            ) : (
              <Text style={styles.cardValueStatic}>{cardDetails.expiryDate || 'MM/AA'}</Text>
            )}
          </View>
        </View>

        <View style={styles.expiryCvvColumn}>
          <Text style={styles.label}>CVV</Text>
          <View style={styles.inputContainer}>
            {isEditing ? (
              <TextInput
                style={styles.inputField}
                value={cardDetails.cvv}
                onChangeText={(text) => onCardFieldChange('cvv', text)}
                placeholder="XXX"
                placeholderTextColor="#9E9E9E"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            ) : (
              <Text style={styles.cardValueStatic}>{'***'}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  editButtonContainer: {
    backgroundColor: '#65B65F',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  deleteButtonContainer: {
    backgroundColor: '#fbd0d0ff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  inputContainer: {
    backgroundColor: '#F1F4FE',
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputField: {
    fontSize: 16,
    color: '#363636',
    paddingVertical: 0,
  },
  cardValueStatic: {
    fontSize: 16,
    color: '#363636',
    paddingVertical: 0,
  },
  expiryCvvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryCvvColumn: {
    flex: 1,
    marginRight: 10,
  },
});