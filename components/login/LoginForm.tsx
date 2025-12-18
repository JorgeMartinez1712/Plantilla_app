import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FONTS } from '../../constants/fonts';
import { COLORS, GLOBAL_STYLES } from '../../constants/theme';
import { useLogin } from "../../hooks/useLogin";
import { AnimatedWavingHand } from "../common/AnimatedWavingHand";
import WarningNotification from "../common/WarningNotification";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const router = useRouter();
    const { login, loginLoading } = useLogin();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa email y contraseña");
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            router.replace("/");
        } else {
            if (result.error) {
                setWarningMessage(result.error);
                setIsWarningVisible(true);
            } else {
                Alert.alert("Error", "Credenciales inválidas, intente de nuevo");
            }
        }
    };

    const handleConfirmWarning = () => {
        setIsWarningVisible(false);
        setWarningMessage("");
    };

    return (
        <View style={GLOBAL_STYLES.formContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[GLOBAL_STYLES.title, { marginTop: 5, flexDirection: 'row', alignItems: 'center' }]}>Bienvenido de vuelta</Text>
                <AnimatedWavingHand />
            </View>
            <Text style={[GLOBAL_STYLES.title, { color: "#363636", textAlign: 'center', marginBottom: 20 }]}>Inicia Sesión para continuar.</Text>
            <Text style={[GLOBAL_STYLES.subtitle, { marginBottom: 30 }]}>APROVECHA NUESTRAS CUOTAS QUINCENALES e inicial de 40%</Text>
            <View style={[GLOBAL_STYLES.tabContainer, { marginBottom: 20 }]}>
                <Pressable style={GLOBAL_STYLES.activeTab}>
                    <Text style={GLOBAL_STYLES.activeTabText}>Iniciar Sesión</Text>
                </Pressable>
                <Pressable
                    style={GLOBAL_STYLES.inactiveTab}
                    onPress={() => router.push("/register")}
                >
                    <Text style={GLOBAL_STYLES.inactiveTabText}>Registrarse</Text>
                </Pressable>
            </View>
            <Text style={[GLOBAL_STYLES.label, { marginTop: 0 }]}>Correo</Text>
            <TextInput
                style={GLOBAL_STYLES.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="email@example.com"
                placeholderTextColor="#999"
                editable={!loginLoading}
            />
            <Text style={GLOBAL_STYLES.label}>Contraseña</Text>
            <View style={[GLOBAL_STYLES.inputContainer, { marginBottom: 20 }]}>
                <TextInput
                    style={GLOBAL_STYLES.inputFlex}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="*********"
                    placeholderTextColor="#999"
                    editable={!loginLoading}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ paddingLeft: 10 }}
                    disabled={loginLoading}
                >
                    <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={24}
                        color="#999"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[
                    GLOBAL_STYLES.primaryButton,
                    loginLoading && { backgroundColor: COLORS.primary }
                ]}
                onPress={handleLogin}
                disabled={loginLoading}
            >
                <Text style={GLOBAL_STYLES.primaryButtonText}>
                    {loginLoading ? "Verificando..." : "Iniciar Sesión"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/SendVerificationCode")}
                disabled={loginLoading}
            >
                <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/register")}
                disabled={loginLoading}
            >
                <Text style={[GLOBAL_STYLES.subtitle, { fontSize: 14, color: "#888", marginTop: 20 }]}>
                    ¿Aún no tienes una cuenta?{" "}
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.primary }}>
                        Regístrarme
                    </Text>
                </Text>
            </TouchableOpacity>
            <WarningNotification
                isVisible={isWarningVisible}
                message={warningMessage}
                onConfirm={handleConfirmWarning}
            />
        </View>
    );
}