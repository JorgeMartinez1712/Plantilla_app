import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FiltrosIcon from '../../assets/iconos/filtros.svg';

interface ProfileHeaderProps {
  title: string;
  rightIcon?: 'person-outline' | 'filtros-svg';
  onRightIconPress?: () => void;
  onBackPress: () => void;
}

export default function ProfileHeader({ title, rightIcon, onRightIconPress, onBackPress }: ProfileHeaderProps) {
  const renderRightIcon = () => {
    if (rightIcon === 'person-outline') {
      return (
        <TouchableOpacity onPress={onRightIconPress}>
          <Ionicons name="person-outline" size={24} color="#363636" />
        </TouchableOpacity>
      );
    } else if (rightIcon === 'filtros-svg') {
      return (
        <TouchableOpacity onPress={onRightIconPress}>
          <FiltrosIcon width={24} height={24} fill="#363636" />
        </TouchableOpacity>
      );
    }
    return <View style={styles.placeholderRight} />;
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {renderRightIcon()}
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
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#363636',
  },
  placeholderRight: {
    width: 24,
  },
});