import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CerrarSesionIcon from '../../assets/iconos/cerrar.svg';
import ChatIcon from '../../assets/iconos/chat-gris.svg';
import DudasIcon from '../../assets/iconos/dudas-gris.svg';
import FiltrosIcon from '../../assets/iconos/filtros.svg';
import HistorialIcon from '../../assets/iconos/historial-gris.svg';
import ListaIcon from '../../assets/iconos/lista.svg';
import MoneyIcon from '../../assets/iconos/money.svg';
import TarjetaIcon from '../../assets/iconos/tarjeta.svg';
import { ASSETS_BASE_URL } from '../../constants/api';
import { useAuthContext } from "../../context/AuthContext";
import LogoutConfirmationModal from '../common/LogoutConfirmationModal';
import sidebarStyles from "./sidebarStyles";

export interface MenuItem {
    name: string;
    icon?: keyof typeof MaterialIcons.glyphMap | 'person-outline-ionic';
    route: string;
    svgIcon?: 'money' | 'tarjeta' | 'filtros' | 'historial' | 'chat' | 'DudasIcon';
}

export default function Sidebar({ navigation }: DrawerContentComponentProps) {
    const { customerDetails, logout } = useAuthContext();
    const router = useRouter();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const DEFAULT_AVATAR_URI = 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png';

    const menuItems: MenuItem[] = [
        { name: 'Datos Personales', icon: 'person-outline-ionic', route: 'screens/profile' },
        { name: 'Soporte', svgIcon: 'chat', route: './consults' },
        { name: 'FAQ', svgIcon: 'DudasIcon', route: 'screens/faq' },
        { name: 'Historial', svgIcon: 'historial', route: './pagos' },
        { name: 'Compras', svgIcon: 'money', route: './compras' },
        { name: 'Configuración', svgIcon: 'filtros', route: 'screens/profile/settings' },
    ];

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        navigation.dispatch(DrawerActions.closeDrawer());
        logout();
    };

    const handleMenuItemPress = (route: string) => {
        navigation.dispatch(DrawerActions.closeDrawer());
        const externalRoutes = new Set(['./consults', 'screens/faq']);
        if (externalRoutes.has(route)) {
            Linking.openURL('https://financiados.app').catch(() => {
                Linking.openURL('https://financiados.app');
            });
            return;
        }
        let routeToPush = route;
        if (route.startsWith('./')) {
            routeToPush = `/${route.slice(2)}`;
        } else if (!route.startsWith('/')) {
            routeToPush = `/${route}`;
        }

        router.push(routeToPush as any);
    };

    const renderIcon = (item: MenuItem, color: string) => {
        if (item.svgIcon === 'money') {
            return <MoneyIcon width={24} height={24} fill={color} />;
        }
        if (item.svgIcon === 'tarjeta') {
            return <TarjetaIcon width={24} height={24} fill={'none'} stroke={color} />;
        }
        if (item.svgIcon === 'filtros') {
            return <FiltrosIcon width={24} height={24} fill={color} />;
        }
        if (item.svgIcon === 'historial') {
            return <HistorialIcon width={24} height={24} fill={'none'} stroke={'#737373'} />;
        }
        if (item.svgIcon === 'chat') {
            return <ChatIcon width={24} height={24} stroke={color} />;
        }
        if (item.svgIcon === 'DudasIcon') {
            return <DudasIcon width={24} height={24} stroke="#737373" />;
        }
        if (item.icon === 'person-outline-ionic') {
            return <Ionicons name="person-outline" size={24} color={color} />;
        }
        if (item.icon) {
            return <MaterialIcons name={item.icon} size={24} color={color} />;
        }
        return null;
    };

    return (
        <View style={sidebarStyles.sidebar}>
            <TouchableOpacity style={sidebarStyles.closeButton} onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
                <View style={{
                    width: 42,
                    height: 42,
                    borderRadius: 24,
                    backgroundColor: '#FFFFFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                }}>
                    <ListaIcon width={32} height={32} />
                </View>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={sidebarStyles.scrollViewContent}>
                <View style={sidebarStyles.profileSection}>
                    <Image source={{ uri: (() => { const a = customerDetails?.app_user?.avatar; if (a) { return a.startsWith('http') ? a : `${ASSETS_BASE_URL}${a.startsWith('/') ? '' : '/'}${a}`; } return customerDetails?.profile_picture ?? DEFAULT_AVATAR_URI; })() }} style={sidebarStyles.avatar} />
                    <Text style={sidebarStyles.name}>{customerDetails?.full_name}</Text>
                    <Text style={sidebarStyles.email}>{customerDetails?.app_user?.email || customerDetails?.email}</Text>
                </View>

                <View style={sidebarStyles.menuItemsContainer}>
                    {menuItems.map((item, index) => {
                        const iconColor = item.icon ? '#707070' : '#363636';
                        return (
                            <TouchableOpacity key={index} style={sidebarStyles.menuItem} onPress={() => handleMenuItemPress(item.route)}>
                                {renderIcon(item, iconColor)}
                                <Text style={sidebarStyles.menuText}>{item.name}</Text>
                                <MaterialIcons name="keyboard-arrow-right" size={26} color="#9E9E9E" />
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={[sidebarStyles.menuItem, sidebarStyles.logoutItem]} onPress={handleLogout}>
                        <CerrarSesionIcon width={24} height={24} />
                        <Text style={sidebarStyles.logoutText}>Cerrar Sesión</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={26} color="#9E9E9E" />
                    </TouchableOpacity>
                </View>

                <View style={sidebarStyles.logoContainer}>
                    <Image source={require('../../assets/images/sin_bordes.png')} style={sidebarStyles.logo} />
                </View>
            </ScrollView>

            <LogoutConfirmationModal
                isVisible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onConfirmLogout={confirmLogout}
            />
        </View>
    );
}