import { useCallback, useEffect, useState } from 'react';
import api from '../constants/api';

export interface NotificationItem {
  id: number;
  description: string;
  message: string;
  created_at: string;
}

const USER_ID = 43;

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notifications');
      const data = res.data;

      if (data && data.success && Array.isArray(data.response)) {
        setNotifications(data.response as NotificationItem[]);
      } else {
        setNotifications([]);
      }
    } catch (e: any) {
      setNotifications([]);
      setError(e?.message ?? 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number | number[] | 'all') => {
    try {
      if (notificationId === 'all' && Array.isArray(notifications) && notifications.length > 0) {
        const notificationIds = notifications.map(n => n.id);
        const payload = {
          userId: USER_ID,
          allNotifications: 1,
          notificationId: notificationIds,
        };
        await api.post('/readedNotification', payload);
        setNotifications([]);
      } else if (typeof notificationId === 'number') {
        const payload = {
          userId: USER_ID,
          allNotifications: 0,
          notificationId: notificationId,
        };
        await api.post('/readedNotification', payload);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (e: any) {
      console.error('Error al marcar notificaciones como leídas:', e);
    }
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, fetchNotifications, markAsRead };
}

export default useNotifications;