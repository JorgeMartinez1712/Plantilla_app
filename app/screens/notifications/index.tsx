import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationItem, useNotifications } from '../../../hooks/useNotifications';

export default function NotificationsScreen() {
  const router = useRouter();

  const { notifications, loading, markAsRead } = useNotifications();

  const handleBackPress = () => {
    router.back();
  };

  const handleNotificationPress = (item: NotificationItem) => {
    markAsRead(item.id);
  };

  const handleMarkAllRead = () => {
    markAsRead('all');
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.description}</Text>
          <Text style={styles.cardDate}>{new Date(item.created_at).toLocaleDateString('es-ES')}</Text>
        </View>
        <Text style={styles.cardMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialCommunityIcons name="arrow-left-top" size={24} color="#363636" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color="#65B65F" />
          </TouchableOpacity>
        )}
        {notifications.length === 0 && <View style={{ width: 24 }} />}
      </View>

      <View style={styles.content}>
        {loading ? (
          <Text style={styles.emptyText}>Cargando...</Text>
        ) : notifications && notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        ) : (
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#F6F9FF',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#363636',
    fontFamily: 'Poppins_700Bold',
  },
  cardDate: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
  cardMessage: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },
});