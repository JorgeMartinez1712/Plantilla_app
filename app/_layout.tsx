import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, View } from 'react-native';
import SidebarContent from '../components/sidebar/Sidebar';
import { AuthProvider, useAuthContext } from '../context/AuthContext';

const configureGlobalFont = () => {
  const defaultTextStyle = { fontFamily: 'Poppins_400Regular' };
  try {
    (Text as any).defaultProps = (Text as any).defaultProps || {};
    (Text as any).defaultProps.style = {
      ...(Text as any).defaultProps.style,
      ...defaultTextStyle,
    };
    (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
    (TextInput as any).defaultProps.style = {
      ...(TextInput as any).defaultProps.style,
      ...defaultTextStyle,
    };
  } catch {
    console.log('Configuración de fuente global no disponible, usar manualmente');
  }
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      configureGlobalFont();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5EBFC' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}function RootNavigator() {
  const { user, loading, loadingCustomerDetails, isAuthenticated, customerDetails } = useAuthContext();
  const router = useRouter();

  const isLoading = loading || (isAuthenticated && loadingCustomerDetails);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('transparent');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && customerDetails) {
        const isActiveAndNeedsVerification = customerDetails.is_active === true && customerDetails.app_user?.app_user_status_id === 1;
        if (isActiveAndNeedsVerification) {
            router.replace("/screens/profile/verification"); 
        } else if (customerDetails.is_active === true && customerDetails.app_user?.app_user_status_id !== 1) {
            router.replace("/(app)/(tabs)");
        }
    }
    
  }, [isAuthenticated, customerDetails, router]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5EBFC' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }
  
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '80%',
        },
      }}
      drawerContent={(props) => <SidebarContent {...props} />}
    >
      <Drawer.Screen
        name="(app)/(tabs)"
        options={{
          title: 'Inicio',
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="screens/profile"
        options={{
          title: 'Mi Perfil',
          drawerLabel: 'Mi Perfil',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="screens/faq"
        options={{
          title: 'FAQ',
          drawerLabel: 'FAQ',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="help-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Drawer>
  );
}