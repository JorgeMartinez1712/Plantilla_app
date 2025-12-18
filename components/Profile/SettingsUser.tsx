import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';

interface SettingsHeaderProps {
  avatarUri?: string;
}

export default function SettingsUser({ avatarUri }: SettingsHeaderProps) {
  const { user, customerDetails } = useAuthContext();

  const displayName = customerDetails?.full_name || user?.email || 'Usuario';
  const displayEmail = user?.email || 'No disponible';
  const displayAvatar = customerDetails?.profile_picture; 

  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: displayAvatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F6F9FF',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    color: '#707070',
    maxWidth: 200, 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  email: {
    fontSize: 14,
    color: '#BEBEBE',
    maxWidth: 200, 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});