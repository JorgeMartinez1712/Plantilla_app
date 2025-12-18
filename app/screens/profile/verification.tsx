import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorNotification from '../../../components/common/ErrorNotification';
import { useAuthContext } from "../../../context/AuthContext";
import { useRegister } from '../../../hooks/useRegister';

export default function VerificationScreen() {
    const router = useRouter();
    const { user, customerDetails } = useAuthContext();
    const { initiateDiditVerification, loading } = useRegister();
    const [isPolling, setIsPolling] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (isPolling) {
                setIsPolling(false);
                router.replace("/(tabs)" as any);
            }
            return () => {};
        }, [isPolling, router])
    );

    const handleDiditVerification = async () => {
        if (!user || !customerDetails) {
            setErrorMessage("Error, intente de nuevo más tarde");
            setErrorVisible(true);
            return;
        }

        let ip = '0.0.0.0';
        try {
            const ipResult = await Network.getIpAddressAsync();
            if (ipResult) ip = ipResult;
    } catch {
        }

        const payload = {
            user_id: user.id,
            full_name: customerDetails.full_name || '',
            email: customerDetails.email || user?.email || '',
            phone: customerDetails.phone_number || '',
            birth_date: customerDetails.birth_date || '',
            document_number: customerDetails.document_number || '',
            ip,
        };

        const result = await initiateDiditVerification(payload as any);

        if (result.success && result.data?.redirect_url) {
            WebBrowser.openBrowserAsync(result.data.redirect_url);
            setIsPolling(true);
        } else {
            setErrorMessage("Error, intente de nuevo más tarde");
            setErrorVisible(true);
        }
    };

    const handleGoBack = () => {
        router.replace("/(tabs)" as any);
    };

    return (
        <View style={styles.container}>
         
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../../assets/images/sin_bordes.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Necesitamos verificar tu Identidad</Text>

            <TouchableOpacity
                style={styles.optionButton}
                onPress={handleDiditVerification}
            >
                <View style={styles.iconCircle}>
                    <MaterialIcons name="person-outline" size={24} color="#435df3ff" />
                </View>
                <Text style={styles.optionText}>Verificar Identidad</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#65B65F" />
                </View>
            )}
            <ErrorNotification
                isVisible={errorVisible}
                message={errorMessage ?? ''}
                onClose={() => setErrorVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FF',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#363636',
            fontFamily: 'Poppins_700Bold',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logo: {
        width: 347,
        height: 117,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'left',
        color: '#363636',
            fontFamily: 'Poppins_700Bold',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(204, 218, 247, 1)',
        borderRadius: 100,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    iconCircle: {
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 8,
        marginRight: 15,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#363636',
        fontWeight: '500',
            fontFamily: 'Poppins_500Medium',
    },
    backButton: {
        backgroundColor: '#65B65F',
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '80%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
            fontFamily: 'Poppins_700Bold',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});