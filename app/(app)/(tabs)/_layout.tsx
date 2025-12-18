import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Tabs, useNavigation } from 'expo-router';
import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DudasIcon from '../../../assets/iconos/dudas.svg';
import HistorialActivo from '../../../assets/iconos/historial-verde.svg';
import HistorialIcon from '../../../assets/iconos/historial.svg';
import HomeNegro from '../../../assets/iconos/home-negro.svg';
import HomeVerde from '../../../assets/iconos/home-verde.svg';
import MoneyIcon from '../../../assets/iconos/money.svg';

export default function TabsLayout() {
  const navigation = useNavigation();

  const headerBackgroundColor = '#F6F9FF';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#65B65F',
        tabBarInactiveTintColor: '#000000ff',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          height: Platform.OS === 'android' ? 95 : 90,
          paddingBottom: 0,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, Platform.OS === 'android' && styles.androidIconContainer]}>
              {focused ? (
                <HomeVerde width={53} height={53} />
              ) : (
                <HomeNegro width={53} height={53} />
              )}
            </View>
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="compras"
        options={{
          title: 'Compras',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, Platform.OS === 'android' && styles.androidIconContainer]}>
              <MoneyIcon width={28} height={28} fill={color} />
            </View>
          ),
          headerShown: true,
          headerLeft: () => (
            <MaterialIcons
              name="menu"
              size={28}
              color="#9B9B9B"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginLeft: 25 }}
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />

      <Tabs.Screen
        name="calculadora"
        options={{
          title: 'Financiamiento',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centralButtonContainer}>
              <View style={styles.iconWithWhiteBorder}>
                <Image
                  source={require('../../../assets/images/logo_blanco.png')}
                  style={styles.calculatorIcon}
                />
              </View>
            </View>
          ),
          headerShown: true,
          headerLeft: () => (
            <MaterialIcons
              name="menu"
              size={28}
              color="#9B9B9B"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginLeft: 25 }}
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />

      <Tabs.Screen
        name="pagos"
        options={{
          title: 'Historial de pagos',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, Platform.OS === 'android' && styles.androidIconContainer]}>
              {focused ? (
                <HistorialActivo width={28} height={28} fill={'none'} stroke={color} />
              ) : (
                <HistorialIcon width={28} height={28} fill={'none'} stroke={'#000000ff'} />
              )}
            </View>
          ),
          headerShown: true,
          headerLeft: () => (
            <MaterialIcons
              name="menu"
              size={28}
              color="#9B9B9B"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginLeft: 25 }}
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: headerBackgroundColor,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />

      <Tabs.Screen
        name="consults"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color, focused }) => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://financiados.app').catch(() => {
                  Linking.openURL('https://financiados.app');
                });
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, Platform.OS === 'android' && styles.androidIconContainer]}>
                <DudasIcon width={28} height={28} fill={'none'} stroke={focused ? '#65B65F' : '#000000ff'} />
              </View>
            </TouchableOpacity>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centralButtonContainer: {
    backgroundColor: '#65B65F',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconWithWhiteBorder: {
    width: 52,
    height: 52,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#BED67B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  calculatorIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FFF1',
    marginTop: 25,
  },
  androidIconContainer: {
    marginTop: 22,
  },
  consultsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6FFE6',
    marginTop: 6,
    marginLeft: 5,
  },
  consultsAndroidIconContainer: {
    marginTop: 10,
  },
});