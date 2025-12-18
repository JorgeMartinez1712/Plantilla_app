import { Stack, useRouter } from 'expo-router';
import ProfileHeader from '../../../components/Profile/ProfileHeader';

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <ProfileHeader
              title="Datos Personales"
              rightIcon="person-outline"
              onRightIconPress={() => console.log('Icono de persona presionado')}
              onBackPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          header: () => (
            <ProfileHeader
              title="Configuración"
              rightIcon="filtros-svg"
              onRightIconPress={() => console.log('Icono de filtros presionado')}
              onBackPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="socioeconomic"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}