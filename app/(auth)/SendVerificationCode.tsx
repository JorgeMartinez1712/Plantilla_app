import { useRouter } from "expo-router";
import { Alert } from "react-native";
import RecoverPasswordForm from "../../components/login/RecoverPasswordForm";
import { useLogin } from "../../hooks/useLogin";

export default function SendVerificationCode() {
  const { sendVerificationCode, recoverLoading } = useLogin();
  const router = useRouter();

  const handleSendCode = async (email: string) => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo electrónico");
      return;
    }

    const result = await sendVerificationCode(email);
    if (result.success) {
      Alert.alert("Enviado", result.data?.message || "Si el correo existe, recibirás un enlace de recuperación. Usa el token del correo.");
      router.replace({ pathname: "/verify-and-reset", params: { email } });
    } else {
      Alert.alert("Error", result.error || "Error al solicitar la recuperación de contraseña.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <RecoverPasswordForm
      onSendCode={handleSendCode}
      onGoBack={handleGoBack}
      loading={recoverLoading}
    />
  );
}