import { Stack } from 'expo-router';

export default function ComprasSubscreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="detail-purchase" options={{ headerShown: false }} />
      <Stack.Screen name="quotas" options={{ headerShown: false }} /> 
    </Stack>
  );
}