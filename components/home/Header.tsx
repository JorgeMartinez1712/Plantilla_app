import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import VectorIcon from '../../assets/iconos/chat.svg';
import { ASSETS_BASE_URL } from '../../constants/api';
import { useAuthContext } from '../../context/AuthContext';
import { AnimatedWavingHand } from '../common/AnimatedWavingHand';

export default function Header({ customerLevel }: { customerLevel?: string | null }) {
  const navigation: any = useNavigation();
  const router = useRouter();
  const { customerDetails } = useAuthContext();

  const handleNotificationsPress = () => {
    router.push('/screens/notifications');
  };

  const customerName = customerDetails?.full_name ? customerDetails.full_name.split(' ')[0] : 'Usuario';
  const profilePic = (() => {
    const a = customerDetails?.app_user?.avatar;
    if (a) {
      return a.startsWith('http') ? a : `${ASSETS_BASE_URL}${a.startsWith('/') ? '' : '/'}${a}`;
    }
    return customerDetails?.profile_picture;
  })();
  


  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MaterialIcons name="menu" size={28} color="#9B9B9B" />
      </TouchableOpacity>

      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: profilePic }}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.headerTextContainer}>
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>Hola, </Text>
          <AnimatedWavingHand />
          <Text style={styles.greetingText}>{customerName}</Text>
        </View>
        <Text style={styles.welcomeText}>Bienvenido</Text>
      </View>

      <View style={styles.rightIconsContainer}>
        <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
          <VectorIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
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
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#65B65F',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 25,
    borderColor: '#65B65F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  levelContainer: {
    backgroundColor: '#65B65F',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});