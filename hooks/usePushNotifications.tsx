    import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import api from '../constants/api';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    } else {
        console.log('Debe usar un dispositivo físico para notificaciones push');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

async function sendPushTokenToBackend(expoPushToken: string, userId: string): Promise<void> {
    if (!expoPushToken || !userId) {
        console.error('Faltan datos para enviar el token al backend.');
        return;
    }

    const payload = {
        token: expoPushToken,
        user_id: userId,
        platform: 'app',
    };

    try {
        const response = await api.post('/deviceToken', payload);
    } catch (error: any) {
        console.error('Error al enviar el token de notificación al backend:', error.response?.data || error.message);
    }
}

export function usePushNotifications() {
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);
    const lastRegisteredForUser = useRef<string | null>(null);
    const lastTokenRef = useRef<string | null>(null);
    const registeringRef = useRef<boolean>(false);

    useEffect(() => {

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    const registerAndSendToken = async (userId: string): Promise<void> => {
        if (registeringRef.current) return;
        if (lastRegisteredForUser.current === userId && lastTokenRef.current) return;

        registeringRef.current = true;
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                if (token !== lastTokenRef.current) {
                    console.log('Expo Push Token obtenido:', token);
                }
                lastTokenRef.current = token;
                lastRegisteredForUser.current = userId;
                await sendPushTokenToBackend(token, userId);
            }
        } finally {
            registeringRef.current = false;
        }
    };

    return { registerAndSendToken };
}