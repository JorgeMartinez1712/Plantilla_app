import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorNotification from '../../../components/common/ErrorNotification';
import SuccessNotification from '../../../components/common/SuccessNotification';
import ProfileInfoCard from '../../../components/Profile/ProfileInfoCard';
import SaveChangesButton from '../../../components/Profile/SaveChangesButton';
import { ASSETS_BASE_URL } from '../../../constants/api';
import { CustomerDetails, useAuthContext } from '../../../context/AuthContext';
import useProfile from '../../../hooks/useProfile';

type ImagePickerModule = typeof import('expo-image-picker');

let cachedImagePickerModule: ImagePickerModule | null = null;

const loadImagePicker = async (): Promise<ImagePickerModule> => {
    if (cachedImagePickerModule) {
        return cachedImagePickerModule;
    }
    cachedImagePickerModule = await import('expo-image-picker');
    return cachedImagePickerModule;
};

export default function ProfileScreen() {
    const { customerDetails, user, fetchCustomerDetails } = useAuthContext();
    const { updateCustomerProfile, uploadAvatar, loading: updateLoading, error: updateError, success: updateSuccess, setSuccess, setError } = useProfile();
    const router = useRouter();

    const [localCustomerDetails, setLocalCustomerDetails] = useState<CustomerDetails | null>(customerDetails);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('VE');
    const [country, setCountry] = useState<Country | null>(null);
    const [withCountryPickerVisible, setWithCountryPickerVisible] = useState(false);
    const [localPhone, setLocalPhone] = useState('');
    const [prevLocalCustomerDetails, setPrevLocalCustomerDetails] = useState<CustomerDetails | null>(null);
    const [successVisible, setSuccessVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        if (customerDetails) {
            setLocalCustomerDetails(customerDetails);
        }
    }, [customerDetails]);

    useEffect(() => {
        const defaultCountry = {
            cca2: 'VE',
            callingCode: ['58'],
            name: 'Venezuela',
        } as Country;
        setCountry(defaultCountry);
        setCountryCode('VE');
    }, []);

    useEffect(() => {
        setIsSaveEnabled(isEditingAddress || isEditingContact);
    }, [isEditingAddress, isEditingContact]);

    useEffect(() => {
        if (updateSuccess) {
            setNotificationMessage('Perfil actualizado correctamente.');
            setSuccessVisible(true);
            setSuccess(false);
            if (user?.customers_id && user?.token) {
                fetchCustomerDetails(user.customers_id, user.token);
            }
            setIsEditingAddress(false);
            setIsEditingContact(false);
        }
        if (updateError) {
            setNotificationMessage(updateError);
            setErrorVisible(true);
            if (prevLocalCustomerDetails) {
                setLocalCustomerDetails(prevLocalCustomerDetails);
                const prevPhone = prevLocalCustomerDetails.phone_number || '';
                const digits = prevPhone.replace(/\D/g, '');
                const cc = country?.callingCode?.[0] ?? '58';
                let local = digits;
                if (local.startsWith(cc)) local = local.substring(cc.length);
                setLocalPhone(local);
                setPrevLocalCustomerDetails(null);
            }
            const defaultCountry = {
                cca2: 'VE',
                callingCode: ['58'],
                name: 'Venezuela',
            } as Country;
            setCountryCode('VE');
            setCountry(defaultCountry);
            setError(null);
        }
    }, [updateSuccess, updateError, setSuccess, setError, fetchCustomerDetails, user, prevLocalCustomerDetails, country?.callingCode]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setIsEditingAddress(false);
                setIsEditingContact(false);
            };
        }, [])
    );



    const handleFieldChange = (section: string, field: string, value: string) => {
        setLocalCustomerDetails((prevDetails) => {
            if (!prevDetails) return null;
            const updated = { ...prevDetails };
            if (section === 'address') {
                updated.address = value;
            } else if (section === 'contact') {
                if (field === 'phone') {
                    const calling = country?.callingCode?.[0] ?? '58';
                    updated.phone_number = value.startsWith('+') ? value : `+${calling}${value}`;
                } else if (field === 'email') {
                    updated.email = value;
                    if (updated.app_user) {
                        updated.app_user.email = value;
                    }
                }
            }
            return updated;
        });
    };

    const onSelectCountry = (c: Country) => {
        setCountryCode(c.cca2 as CountryCode);
        setCountry(c);
        setLocalCustomerDetails((prev) => {
            if (!prev) return prev;
            const digits = localPhone || prev.phone_number?.replace(/\D/g, '').replace(/^58/, '') || '';
            return { ...prev, phone_number: `+${c.callingCode[0]}${digits}` } as any;
        });
    };

    const toggleEditContact = () => {
        if (!isEditingContact) {
            const stored = localCustomerDetails?.phone_number || '';
            let phone = stored.replace(/\D/g, '');
            if (phone.startsWith('58')) phone = phone.substring(2);
            setLocalPhone(phone);
        }
        setPrevLocalCustomerDetails(localCustomerDetails);
        setIsEditingContact(!isEditingContact);
    };

    const handlePhoneChange = (text: string) => {
        setLocalPhone(text);
        const calling = country?.callingCode?.[0] ?? '58';
        setLocalCustomerDetails((prev) => {
            if (!prev) return prev;
            return { ...prev, phone_number: `+${calling}${text}` } as any;
        });
    };

    const getDisplayPhone = (phone?: string) => {
        if (!phone) return '';
        const digits = phone.replace(/\D/g, '');
        const cc = country?.callingCode?.[0] ?? '58';
        if (digits.startsWith(cc)) return digits.substring(cc.length);
        return digits;
    };

    const handleSaveChanges = async () => {
        if (!user || !user.customers_id) {
            setNotificationMessage('No se pudo obtener la información de autenticación.');
            setErrorVisible(true);
            return;
        }

        const payload = {
            full_name: localCustomerDetails?.full_name,
            phone_number: localCustomerDetails?.phone_number,
            address: localCustomerDetails?.address,
            email: localCustomerDetails?.app_user?.email || localCustomerDetails?.email,
        };

        const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        await updateCustomerProfile(user.customers_id, cleanedPayload);
    };

    const shouldShowVerifyButton = customerDetails?.is_active === true && customerDetails?.app_user?.app_user_status_id === 1;

    const customerLevel = customerDetails?.levels && customerDetails.levels.length > 0
        ? customerDetails.levels[0].nivel
        : null;

    const handleAvatarPress = async () => {
        if (!user?.id) {
            setNotificationMessage('No se pudo obtener la información de autenticación.');
            setErrorVisible(true);
            return;
        }

        try {
            const ImagePicker = await loadImagePicker();
            const canOpenSettings = Platform.OS === 'android' || Platform.OS === 'ios';
            const showPermissionAlert = (canAskAgain: boolean, askMessage: string, settingsMessage: string) => {
                Alert.alert(
                    'Permiso requerido',
                    canAskAgain ? askMessage : settingsMessage,
                    canAskAgain || !canOpenSettings
                        ? [{ text: 'Entendido', style: 'cancel' as const }]
                        : [
                            { text: 'Cancelar', style: 'cancel' as const },
                            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
                        ]
                );
            };
            const existingPermission = await ImagePicker.getCameraPermissionsAsync();
            let cameraGranted = existingPermission.granted;

            if (!cameraGranted) {
                const requestedPermission = await ImagePicker.requestCameraPermissionsAsync();
                cameraGranted = requestedPermission.granted;

                if (!cameraGranted) {
                    showPermissionAlert(
                        requestedPermission.canAskAgain,
                        'Necesitamos acceso a la cámara para actualizar tu foto.',
                        'Habilita el acceso a la cámara desde los ajustes del sistema.'
                    );
                    return;
                }
            }

            const existingMediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
            let mediaGranted = existingMediaPermission.granted;

            if (!mediaGranted) {
                const requestedMediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                mediaGranted = requestedMediaPermission.granted;

                if (!mediaGranted) {
                    showPermissionAlert(
                        requestedMediaPermission.canAskAgain,
                        'Necesitamos acceso a tus fotos para guardar el avatar.',
                        'Habilita el acceso a tus fotos desde los ajustes del sistema.'
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.9,
                exif: false,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const uploadResult = await uploadAvatar(user.id, result.assets[0].uri);

            if (uploadResult.success && user?.customers_id && user?.token) {
                setNotificationMessage('Avatar actualizado correctamente.');
                setSuccessVisible(true);
                await fetchCustomerDetails(user.customers_id, user.token);
            } else {
                setNotificationMessage(uploadResult.error || 'No se pudo actualizar el avatar.');
                setErrorVisible(true);
            }
        } catch {
            setNotificationMessage('No se pudo abrir la cámara.');
            setErrorVisible(true);
        }
    };

    if (!customerDetails) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#65B65F" />
                <Text style={{ fontFamily: 'Poppins_400Regular' }}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollViewContent}
                extraScrollHeight={100}
                enableOnAndroid={true}
            >
                <View style={styles.profileSection}>
                    {(() => { return null; })()}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: (() => { const a = customerDetails?.app_user?.avatar; if (a) { return a.startsWith('http') ? a : `${ASSETS_BASE_URL}${a.startsWith('/') ? '' : '/'}${a}`; } return customerDetails?.profile_picture as string; })() }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={handleAvatarPress}
                        >
                            <Ionicons name="camera-outline" size={24} color="#01008A" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{customerDetails?.full_name}</Text>
                    <Text style={styles.email}>{customerDetails?.app_user?.email || customerDetails?.email}</Text>

                    {customerLevel && (
                        <View style={styles.levelContainer}>
                            <Text style={styles.levelText}>Nivel {customerLevel}</Text>
                        </View>
                    )}

                    {shouldShowVerifyButton && (
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={() => router.push('./profile/verification' as any)}
                        >
                            <MaterialIcons name="verified-user" size={16} color="#FFF" />
                            <Text style={styles.verifyButtonText}>Verificar Cuenta</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.socioeconomicButton}
                        onPress={() => router.push('./profile/socioeconomic' as any)}
                    >
                        <MaterialIcons name="workspaces-outline" size={16} color="#000" />
                        <Text style={styles.socioeconomicButtonText}>Completar Datos Socioeconómicos</Text>
                    </TouchableOpacity>
                </View>

                <ProfileInfoCard
                    title="Dirección"
                    value={localCustomerDetails?.address}
                    icon={isEditingAddress ? "close" : "edit"}
                    onEditPress={() => {
                        setPrevLocalCustomerDetails(localCustomerDetails);
                        setIsEditingAddress(!isEditingAddress);
                    }}
                    isEditing={isEditingAddress}
                    onChangeText={(text) => handleFieldChange('address', 'address', text)}
                    keyboardType="default"
                    placeholder="Ingresa tu dirección"
                />

                {isEditingContact ? (
                    <View style={{ backgroundColor: 'white', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 30, marginHorizontal: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#202020', marginBottom: 2, fontFamily: 'Poppins_700Bold' }}>Información de Contacto</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ marginRight: 8 }}>
                                    <CountryPicker
                                        withFlag
                                        withCallingCode
                                        withFilter
                                        withModal
                                        countryCode={countryCode}
                                        onSelect={onSelectCountry}
                                        visible={withCountryPickerVisible}
                                        onClose={() => setWithCountryPickerVisible(false)}
                                        renderFlagButton={() => (
                                            <TouchableOpacity onPress={() => setWithCountryPickerVisible(true)}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>{country ? `+${country.callingCode[0]}` : '+58'}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                                <TextInput
                                    style={{ flex: 1, fontSize: 16, color: '#363636', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 5, fontFamily: 'Poppins_400Regular' }}
                                    value={localPhone}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="phone-pad"
                                    placeholder="Ingresa tu número de teléfono"
                                />
                            </View>
                            <TouchableOpacity onPress={toggleEditContact} style={{ backgroundColor: '#65B65F', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                <MaterialIcons name={isEditingContact ? "close" : "edit"} size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={{ backgroundColor: 'white', borderRadius: 100, paddingVertical: 10, paddingHorizontal: 30, marginHorizontal: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#202020', marginBottom: 2, fontFamily: 'Poppins_700Bold' }}>Información de Contacto</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ marginRight: 8, width: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>{country ? `+${country.callingCode[0]}` : '+58'}</Text>
                                </View>
                                <Text style={{ flex: 1, fontSize: 12, color: '#707070', fontFamily: 'Poppins_400Regular' }}>{getDisplayPhone(localCustomerDetails?.phone_number) || 'No disponible'}</Text>
                            </View>
                            <TouchableOpacity onPress={toggleEditContact} style={{ backgroundColor: '#65B65F', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                                <MaterialIcons name={isEditingContact ? "close" : "edit"} size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {isSaveEnabled && (
                    <SaveChangesButton
                        onPress={handleSaveChanges}
                        isLoading={updateLoading}
                    />
                )}
            </KeyboardAwareScrollView>
            <SuccessNotification
                isVisible={successVisible}
                message={notificationMessage}
                onClose={() => setSuccessVisible(false)}
            />
            <ErrorNotification
                isVisible={errorVisible}
                message={notificationMessage}
                onClose={() => setErrorVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#F6F9FF',
        marginBottom: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        borderColor: '#ffffffff',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#e9effdff',
        borderRadius: 20,
        padding: 8,
    },
    name: {
        fontSize: 22,
        color: '#707070',
        marginBottom: 5,
        fontFamily: 'Poppins_600SemiBold',
    },
    email: {
        fontSize: 16,
        color: '#BEBEBE',
        marginBottom: 10,
        fontFamily: 'Poppins_400Regular',
    },
    levelContainer: {
        backgroundColor: '#65B65F',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 5,
        marginBottom: 10,
    },
    levelText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
    },
    verifyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#65B65F',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
        fontFamily: 'Poppins_700Bold',
    },
    socioeconomicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9EFFD',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    socioeconomicButtonText: {
        color: '#000',
        fontSize: 14,
        marginLeft: 8,
        fontFamily: 'Poppins_500Medium',
    },
});