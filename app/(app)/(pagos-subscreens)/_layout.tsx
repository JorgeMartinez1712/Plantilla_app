import { Stack } from 'expo-router';

export default function PagosSubscreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="pagar" options={{ headerShown: false }} />
      <Stack.Screen name="detallepago" options={{ headerShown: false, }}/>
    </Stack>
  );
}