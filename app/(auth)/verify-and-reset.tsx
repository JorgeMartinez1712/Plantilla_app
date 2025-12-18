import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import PasswordRequirements from "../../components/common/PasswordRequirements";
import { COLORS } from "../../constants/theme";
import { useLogin } from "../../hooks/useLogin";

export default function VerifyAndResetPasswordScreen() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { resetPassword, resetPassLoading } = useLogin();
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const displayEmail = email as string;

    const [validations, setValidations] = useState({
        hasUpperCase: false,
        minLength: false,
        hasNumber: false,
        passwordsMatch: false,
    });

    const allValidationsMet = Object.values(validations).every(v => v) && token.length > 0;

    useEffect(() => {
        setValidations({
            hasUpperCase: /[A-Z]/.test(password),
            minLength: password.length >= 8,
            hasNumber: /[0-9]/.test(password),
            passwordsMatch: password === confirmPassword && password.length > 0,
        });
    }, [password, confirmPassword]);

    const handleResetPassword = async () => {
        if (!displayEmail) {
            Alert.alert("Error", "No se encontró el correo electrónico.");
            router.replace("/SendVerificationCode");
            return;
        }

        if (!token) {
            Alert.alert("Error", "Por favor, ingresa el código de verificación (token).");
            return;
        }

        if (!allValidationsMet) {
            Alert.alert("Error", "Asegúrate de cumplir con todos los requisitos de la contraseña y el token.");
            return;
        }

        const result = await resetPassword(displayEmail, token, password, confirmPassword);
        if (result.success) {
            Alert.alert("Éxito", result.data?.message || "Tu contraseña ha sido restablecida correctamente. Por favor, inicia sesión.");
            router.replace("/(auth)");
        } else {
            Alert.alert("Error", result.error || "Error al restablecer la contraseña. Verifica el código (token) e intenta de nuevo.");
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <Image
                            source={require('../../assets/images/sin_bordes.png')}
                            style={styles.logo}
                        />
                        <View style={styles.confirmationContainer}>
                            <View style={styles.exclamationIconContainer}>
                                <MaterialIcons name="security" size={40} color="#65B65F" />
                            </View>
                            <Text style={styles.confirmationTitle}>Verificación y Restablecimiento</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Código de Verificación"
                                placeholderTextColor="#65B65F"
                                value={token}
                                onChangeText={setToken}
                                autoCapitalize="none"
                                returnKeyType="next"
                                editable={!resetPassLoading}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nueva Contraseña"
                                placeholderTextColor="#65B65F"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                returnKeyType="done"
                                editable={!resetPassLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={resetPassLoading}
                            >
                                <MaterialIcons
                                    name={showPassword ? "visibility" : "visibility-off"}
                                    size={24}
                                    color="#65B65F"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar Contraseña"
                                placeholderTextColor="#65B65F"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                returnKeyType="done"
                                editable={!resetPassLoading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={resetPassLoading}
                            >
                                <MaterialIcons
                                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                                    size={24}
                                    color="#65B65F"
                                />
                            </TouchableOpacity>
                        </View>
                        <PasswordRequirements validations={validations} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (resetPassLoading || !allValidationsMet) && styles.confirmButtonDisabled
                            ]}
                            onPress={handleResetPassword}
                            disabled={resetPassLoading || !allValidationsMet}
                        >
                            {resetPassLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Restablecer Contraseña</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.backButton,
                                resetPassLoading && styles.backButtonDisabled
                            ]}
                            onPress={handleGoBack}
                            disabled={resetPassLoading}
                        >
                            <Text style={styles.backButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: '#F6F9FF',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "flex-start",
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 50,
        backgroundColor: '#F6F9FF',
    },
    logo: {
        width: 347,
        height: 117,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    confirmationContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    exclamationIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.iconBackground,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    confirmationTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.primary,
            fontFamily: 'Poppins_700Bold',
    },
    recoverTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 5,
            fontFamily: 'Poppins_700Bold',
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginTop: 10,
        maxWidth: 280,
            fontFamily: 'Poppins_400Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightPrimary,
        borderRadius: 100,
        paddingHorizontal: 12,
        marginBottom: 10,
        width: '100%',
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
        paddingHorizontal: 10,
            fontFamily: 'Poppins_400Regular',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 30,
        backgroundColor: COLORS.backgroundSecondary,
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    confirmButtonDisabled: {
        backgroundColor: '#81c78dff', // This seems like a specific disabled color, maybe keep or add to constants
    },
    confirmButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
            fontFamily: 'Poppins_700Bold',
    },
    backButton: {
        backgroundColor: '#D1E7DD', // Another specific color
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    backButtonDisabled: {
        backgroundColor: '#BCE5D1',
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
            fontFamily: 'Poppins_700Bold',
    },
});