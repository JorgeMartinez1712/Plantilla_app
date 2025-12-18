import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="SendVerificationCode" options={{ headerShown: false }} />
      <Stack.Screen name="verify-and-reset" options={{ headerShown: false }} />
    </Stack>
  );
}