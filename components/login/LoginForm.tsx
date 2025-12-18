import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FONTS } from '../../constants/fonts';
import { useLogin } from "../../hooks/useLogin";
import { AnimatedWavingHand } from "../common/AnimatedWavingHand";
import WarningNotification from "../common/WarningNotification";
import { loginScreenStyles } from './LoginScreen.styles';

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
        <View style={loginScreenStyles.form}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={loginScreenStyles.welcomeText}>Bienvenido de vuelta</Text>
                <AnimatedWavingHand />
            </View>
            <Text style={loginScreenStyles.signInPrompt}>Inicia Sesión para continuar.</Text>
            <Text style={loginScreenStyles.offerText}>APROVECHA NUESTRAS CUOTAS QUINCENALES e inicial de 40%</Text>
            <View style={loginScreenStyles.tabContainer}>
                <Pressable style={loginScreenStyles.activeTab}>
                    <Text style={loginScreenStyles.activeTabText}>Iniciar Sesión</Text>
                </Pressable>
                <Pressable
                    style={loginScreenStyles.inactiveTab}
                    onPress={() => router.push("/register")}
                >
                    <Text style={loginScreenStyles.inactiveTabText}>Registrarse</Text>
                </Pressable>
            </View>
            <Text style={loginScreenStyles.label}>Correo</Text>
            <TextInput
                style={loginScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="email@example.com"
                placeholderTextColor="#999"
                editable={!loginLoading}
            />
            <Text style={loginScreenStyles.label}>Contraseña</Text>
            <View style={loginScreenStyles.passwordInputContainer}>
                <TextInput
                    style={loginScreenStyles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="*********"
                    placeholderTextColor="#999"
                    editable={!loginLoading}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={loginScreenStyles.eyeIcon}
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
                    loginScreenStyles.loginButton,
                    loginLoading && { backgroundColor: '#65B65F' }
                ]}
                onPress={handleLogin}
                disabled={loginLoading}
            >
                <Text style={loginScreenStyles.loginButtonText}>
                    {loginLoading ? "Verificando..." : "Iniciar Sesión"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/SendVerificationCode")}
                disabled={loginLoading}
            >
                <Text style={{ color: "#65B65F", fontFamily: FONTS.bold }}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/register")}
                disabled={loginLoading}
            >
                <Text style={loginScreenStyles.registerLink}>
                    ¿Aún no tienes una cuenta?{" "}
                    <Text style={{ fontFamily: FONTS.bold, color: "#65B65F" }}>
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