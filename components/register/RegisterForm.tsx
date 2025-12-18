import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { FONTS } from '../../constants/fonts';
import { COLORS, GLOBAL_STYLES } from '../../constants/theme';
import { useRegister } from "../../hooks/useRegister";
import { AnimatedWavingHand } from "../common/AnimatedWavingHand";
import ErrorNotification from "../common/ErrorNotification";
import PasswordRequirements from "../common/PasswordRequirements";
import SuccessNotification from "../common/SuccessNotification";
import WarningNotification from "../common/WarningNotification";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [documentTypeItems, setDocumentTypeItems] = useState<{ label: string, value: string, id: number, code: string }[]>([]);
    const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
    const [documentNumber, setDocumentNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempBirthDate, setTempBirthDate] = useState<Date | null>(null);
    const [showAgeWarning, setShowAgeWarning] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('VE');
    const [country, setCountry] = useState<Country | null>(null);
    const [withCountryPickerVisible, setWithCountryPickerVisible] = useState(false);
    const [isDocumentVerified, setIsDocumentVerified] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showWarningNotification, setShowWarningNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingCheck, setLoadingCheck] = useState(false);

    const router = useRouter();
    const { getDocumentTypes, registerAppUser, checkDocument, loading } = useRegister();

    useEffect(() => {
        const fetchDocTypes = async () => {
            const types = await getDocumentTypes();
            if (types && types.length > 0) {
                setDocumentTypeItems(types);
                const defaultType = types.find(type => type.code.toUpperCase() === 'V');
                setDocumentType(defaultType ? defaultType.value : types[0].value);
            }
        };

        const initializeCountry = async () => {
            const defaultCountry = {
                cca2: 'VE',
                callingCode: ['58'],
                name: 'Venezuela',
            };
            setCountry(defaultCountry as Country);
        };

        fetchDocTypes();
        initializeCountry();
    }, [getDocumentTypes]);

    const onSelectCountry = (country: Country) => {
        setCountryCode(country.cca2);
        setCountry(country);
        setWithCountryPickerVisible(false);
    };

    const passwordValidations = {
        hasUpperCase: /[A-Z]/.test(password),
        minLength: password.length >= 8,
        hasNumber: /[0-9]/.test(password),
        passwordsMatch: password === confirmPassword && password.length > 0,
    };

    const handleNameChange = (text: string) => {
        const filteredText = text.replace(/[0-9]/g, '');
        setFullName(filteredText);
    };

    const handleSelectDocumentType = (value: string) => {
        setDocumentType(value);
        setShowDocumentTypeModal(false);
    };

    const handleOpenDatePicker = () => {
        setTempBirthDate(birthDate || new Date());
        setShowDatePicker(true);
    };

    const handleCancelDatePicker = () => {
        setShowDatePicker(false);
        setTempBirthDate(null);
    };

    const handleConfirmDatePicker = () => {
        if (tempBirthDate) {
            const today = new Date();
            const birthDateInDate = new Date(tempBirthDate);
            let age = today.getFullYear() - birthDateInDate.getFullYear();
            const m = today.getMonth() - birthDateInDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDateInDate.getDate())) {
                age--;
            }

            if (age < 18) {
                setShowDatePicker(false);
                setShowAgeWarning(true);
            } else {
                setBirthDate(tempBirthDate);
                setShowDatePicker(false);
            }
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || tempBirthDate;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            setBirthDate(currentDate);
        }
        setTempBirthDate(currentDate);
    };

    const handleCheckDocument = async () => {
        setLoadingCheck(true);
        const docTypeObj = documentTypeItems.find(dt => dt.value === documentType);
        if (!docTypeObj || !documentNumber) {
            setNotificationMessage("Por favor, selecciona un tipo de documento e ingresa un número.");
            setShowWarningNotification(true);
            setLoadingCheck(false);
            return;
        }
        if (documentNumber.length < 6) {
            setNotificationMessage("El número de documento debe tener al menos 6 dígitos.");
            setShowWarningNotification(true);
            setLoadingCheck(false);
            return;
        }

        const documentTypeId = docTypeObj.id;
        const result = await checkDocument(documentTypeId, documentNumber);

        if (result.success) {
            if (result.customer_exists && result.is_registered) {
                setNotificationMessage("¡Ya tienes una cuenta! Por favor, inicia sesión con tus credenciales.");
                setShowSuccessNotification(true);
                setLoadingCheck(false);
                setTimeout(() => router.push("/(auth)"), 2000);
            } else if (result.customer_exists && !result.is_registered) {
                setNotificationMessage("¡Usuario encontrado en tienda! Completa tus datos para crear tu cuenta en la app.");
                setShowSuccessNotification(true);
                if (result.customer_data) {
                    const customerData = result.customer_data;
                    const docDate = new Date(customerData.birth_date);
                    setFullName(customerData.full_name || "");
                    setEmail(customerData.email || "");
                    if (customerData.phone_number) {
                        setPhoneNumber(customerData.phone_number.substring(2) || "");
                    }
                    setAddress(customerData.address || "");
                    setBirthDate(docDate);
                }
                setIsDocumentVerified(true);
                setLoadingCheck(false);
            } else {
                setNotificationMessage("Documento verificado, ingresa tus datos.");
                setShowSuccessNotification(true);
                setIsDocumentVerified(true);
                setLoadingCheck(false);
            }
        } else {
            if (result.message === "Documento Verificado. Ingresa tus datos.") {
                setNotificationMessage(result.message);
                setShowSuccessNotification(true);
                setIsDocumentVerified(true);
            } else {
                setNotificationMessage(result.message || "Ocurrió un error. Por favor, intenta de nuevo.");
                setShowWarningNotification(true);
            }
            setLoadingCheck(false);
        }
    };

    const handleResetDocument = () => {
        setIsDocumentVerified(false);
        setDocumentNumber("");
        setFullName("");
        setPhoneNumber("");
        setEmail("");
        setAddress("");
        setBirthDate(null);
        setPassword("");
        setConfirmPassword("");
        setTermsAccepted(false);
    };

    const handleRegister = async () => {
        if (!termsAccepted) {
            setErrorMessage("Debes aceptar los Términos y Condiciones para registrarte.");
            setShowErrorNotification(true);
            return;
        }
        if (!email || !password || !confirmPassword || !documentNumber || !documentType || !fullName || !phoneNumber || !address || !birthDate) {
            setErrorMessage("Completa todos los campos requeridos.");
            setShowErrorNotification(true);
            return;
        }
        const today = new Date();
        const birthDateInDate = new Date(birthDate);
        let age = today.getFullYear() - birthDateInDate.getFullYear();
        const m = today.getMonth() - birthDateInDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateInDate.getDate())) {
            age--;
        }
        if (age < 18) {
            setErrorMessage("Debes ser mayor de 18 años para poder registrarte.");
            setShowErrorNotification(true);
            return;
        }
        if (!passwordValidations.hasUpperCase || !passwordValidations.minLength || !passwordValidations.hasNumber || !passwordValidations.passwordsMatch) {
            setErrorMessage("La contraseña no cumple con los requisitos.");
            setShowErrorNotification(true);
            return;
        }
        const docTypeObj = documentTypeItems.find(dt => dt.value === documentType);
        const documentTypeId = docTypeObj ? docTypeObj.id : 1;
        const formattedBirthDate = birthDate.toISOString().split('T')[0];
        const fullPhoneNumber = `${country?.callingCode[0]}${phoneNumber}`;

        const appUserData = {
            full_name: fullName,
            document_type_id: documentTypeId,
            document_number: documentNumber,
            email,
            password: password,
            password_confirmation: confirmPassword,
            phone_number: fullPhoneNumber,
            address: address,
            birth_date: formattedBirthDate,
        };

        try {
            const appUserResult = await registerAppUser(appUserData);
            if (appUserResult.success && appUserResult.data) {
                setNotificationMessage("¡Registro exitoso! Por favor, inicia sesión con tus credenciales.");
                setShowSuccessNotification(true);
                setTimeout(() => {
                    router.replace("/(auth)" as any);
                }, 2000);
            } else {
                setErrorMessage(appUserResult.error || "Error al registrar el usuario de la aplicación.");
                setShowErrorNotification(true);
            }
        } catch {
            setErrorMessage("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
            setShowErrorNotification(true);
        }
    };

    return (
        <View style={[GLOBAL_STYLES.formContainer, { marginTop: 40, paddingTop: 60, paddingBottom: Platform.OS === 'ios' ? 0 : 30, position: 'relative' }]}>
            <Image
                source={require("../../assets/images/sin_bordes.png")}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 190,
                    height: 75,
                    zIndex: 1,
              
                }}
                resizeMode="contain"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[GLOBAL_STYLES.title, { marginTop: 40, flexDirection: 'row', alignItems: 'center' }]}>
                    Hola amigo
                </Text>
                <AnimatedWavingHand />
            </View>
            <Text style={[GLOBAL_STYLES.title, { color: "#363636", textAlign: 'center' }]}>Crea tu cuenta con nosotros</Text>
            <Text style={GLOBAL_STYLES.subtitle}>Con una cuenta, todo será</Text>
            <Text style={GLOBAL_STYLES.subtitle}>fácil y rápido</Text>

            <View style={GLOBAL_STYLES.tabContainer}>
                <Pressable style={GLOBAL_STYLES.inactiveTab} onPress={() => router.push("/(auth)")}>
                    <Text style={GLOBAL_STYLES.inactiveTabText}>Iniciar Sesión</Text>
                </Pressable>
                <Pressable style={GLOBAL_STYLES.activeTab} onPress={() => { }}>
                    <Text style={GLOBAL_STYLES.activeTabText}>Registrarse</Text>
                </Pressable>
            </View>

            <Text style={GLOBAL_STYLES.label}>Tipo y Número de Documento</Text>
            <View style={[GLOBAL_STYLES.inputContainer, { zIndex: 1000 }]}>
                <TouchableOpacity
                    onPress={() => setShowDocumentTypeModal(true)}
                    style={[{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: 50,
                        height: '100%',
                        paddingLeft: 15,
                        borderTopLeftRadius: 100,
                        borderBottomLeftRadius: 100,
                    }, isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                    disabled={isDocumentVerified}
                >
                    <Text style={{ color: documentType ? "#000" : "#999" }}>
                        {documentTypeItems.find(item => item.value === documentType)?.code || "Tipo"}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#999" />
                </TouchableOpacity>
                <TextInput
                    style={[{
                        flex: 1,
                        height: '100%',
                        paddingLeft: 10,
                        paddingRight: 15,
                        fontSize: 16,
                        color: "#363636",
                        borderLeftWidth: 1,
                        borderColor: "#E0E0E0",
                        borderTopRightRadius: 100,
                        borderBottomRightRadius: 100,
                        fontFamily: FONTS.regular,
                    }, isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                    keyboardType="numeric"
                    placeholder="12345678"
                    placeholderTextColor="#999"
                    maxLength={8}
                    editable={!isDocumentVerified}
                />
                <TouchableOpacity
                    onPress={isDocumentVerified ? handleResetDocument : handleCheckDocument}
                    style={isDocumentVerified ? [GLOBAL_STYLES.iconButton, { marginLeft: 10, backgroundColor: COLORS.error }] : [GLOBAL_STYLES.iconButton, { marginLeft: 10 }]}
                    disabled={loadingCheck}
                >
                    {loadingCheck ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        isDocumentVerified ? (
                            <Ionicons name="close-circle-outline" size={30} color="#fff" />
                        ) : (
                            <Ionicons name="checkmark-circle-outline" size={30} color="#fff" />
                        )
                    )}
                </TouchableOpacity>
            </View>
            <Modal
                transparent={true}
                animationType="fade"
                visible={showDocumentTypeModal}
                onRequestClose={() => setShowDocumentTypeModal(false)}
            >
                <Pressable
                    style={GLOBAL_STYLES.modalOverlay}
                    onPress={() => setShowDocumentTypeModal(false)}
                >
                    <Pressable
                        style={GLOBAL_STYLES.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={GLOBAL_STYLES.modalTitle}>Selecciona Tipo de Documento</Text>
                        <FlatList
                            data={documentTypeItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee', width: '100%', alignItems: 'center' }}
                                    onPress={() => handleSelectDocumentType(item.value)}
                                >
                                    <Text style={{ fontSize: 16, color: '#363636', fontFamily: FONTS.regular }}>
                                        {item.label} ({item.code})
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={{ width: '100%', maxHeight: 200 }}
                        />
                        <TouchableOpacity
                            onPress={() => setShowDocumentTypeModal(false)}
                            style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 50, backgroundColor: '#ccc', marginTop: 20 }}
                        >
                            <Text style={{ color: '#fff', fontFamily: FONTS.bold, fontSize: 16 }}>Cerrar</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <Text style={GLOBAL_STYLES.label}>Nombre y Apellido</Text>
            <TextInput
                style={[GLOBAL_STYLES.input, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                value={fullName}
                onChangeText={handleNameChange}
                placeholder="Nombre y Apellido"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={GLOBAL_STYLES.label}>Fecha de Nacimiento</Text>
            <TouchableOpacity onPress={handleOpenDatePicker} style={[GLOBAL_STYLES.input, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]} disabled={!isDocumentVerified}>
                <Text style={{ color: birthDate ? "#000" : "#999" }}>
                    {birthDate ? birthDate.toLocaleDateString() : "Selecciona tu fecha de nacimiento"}
                </Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="fade"
                visible={showDatePicker}
                onRequestClose={handleCancelDatePicker}
            >
                <Pressable style={GLOBAL_STYLES.modalOverlay} onPress={handleCancelDatePicker}>
                    <Pressable style={GLOBAL_STYLES.modalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={GLOBAL_STYLES.modalTitle}>Selecciona tu Fecha</Text>
                        <DateTimePicker
                            value={tempBirthDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            textColor={Platform.OS === 'ios' ? COLORS.primary : undefined}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }}>
                            <TouchableOpacity onPress={handleCancelDatePicker} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 50, backgroundColor: '#ccc' }}>
                                <Text style={{ color: '#fff', fontFamily: FONTS.bold, fontSize: 16 }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmDatePicker} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 50, backgroundColor: COLORS.primary }}>
                                <Text style={{ color: '#fff', fontFamily: FONTS.bold, fontSize: 16 }}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <Text style={GLOBAL_STYLES.label}>Dirección</Text>
            <TextInput
                style={[GLOBAL_STYLES.input, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                value={address}
                onChangeText={setAddress}
                placeholder="Tu dirección"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={GLOBAL_STYLES.label}>Correo Electrónico</Text>
            <TextInput
                style={[GLOBAL_STYLES.input, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="ejemplo@gmail.com"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={GLOBAL_STYLES.label}>Número de Teléfono</Text>
            <View style={GLOBAL_STYLES.inputContainer}>
                <View style={[{ paddingRight: 15, height: '100%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: "#E0E0E0" }, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]} pointerEvents={!isDocumentVerified ? 'none' : 'auto'}>
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
                            <TouchableOpacity onPress={() => setWithCountryPickerVisible(true)} disabled={!isDocumentVerified}>
                                <Text style={{ fontSize: 16, color: "#363636", paddingHorizontal: 5, fontFamily: FONTS.regular }}>
                                    {country ? `+${country.callingCode[0]}` : '+58'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <TextInput
                    style={[{ flex: 1, fontSize: 16, color: "#363636", paddingLeft: 10, paddingRight: 15, fontFamily: FONTS.regular }, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholder="4141331400"
                    placeholderTextColor="#999"
                    editable={isDocumentVerified}
                />
            </View>

            <Text style={GLOBAL_STYLES.label}>Contraseña</Text>
            <View style={GLOBAL_STYLES.inputContainer}>
                <TextInput
                    style={[{ flex: 1, fontSize: 16, color: "#363636", fontFamily: FONTS.regular }, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    textContentType="newPassword"
                    autoComplete="new-password"
                    editable={isDocumentVerified}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingLeft: 10 }} disabled={!isDocumentVerified}>
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#999" />
                </TouchableOpacity>
            </View>

            <Text style={GLOBAL_STYLES.label}>Repetir Contraseña</Text>
            <View style={GLOBAL_STYLES.inputContainer}>
                <TextInput
                    style={[{ flex: 1, fontSize: 16, color: "#363636", fontFamily: FONTS.regular }, !isDocumentVerified && GLOBAL_STYLES.inputDisabled]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    textContentType="newPassword"
                    autoComplete="new-password"
                    editable={isDocumentVerified}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ paddingLeft: 10 }} disabled={!isDocumentVerified}>
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#999" />
                </TouchableOpacity>
            </View>

            <PasswordRequirements validations={passwordValidations} />

            <TouchableOpacity style={GLOBAL_STYLES.primaryButton} onPress={handleRegister} disabled={loading || !isDocumentVerified}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={GLOBAL_STYLES.primaryButtonText}>Registrarse</Text>
                )}
            </TouchableOpacity>

            <View style={[GLOBAL_STYLES.row, { alignSelf: "flex-start", marginBottom: 30 }]}>
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} disabled={!isDocumentVerified}>
                    <View style={[GLOBAL_STYLES.checkbox, !isDocumentVerified && { borderColor: '#ccc' }]}>
                        {termsAccepted && <View style={GLOBAL_STYLES.checkedCheckbox} />}
                    </View>
                </TouchableOpacity>
                <Text style={[{ fontSize: 14, color: "#555", fontFamily: FONTS.regular }, !isDocumentVerified && { color: '#ccc' }]}>
                    Acepto los <Text style={{ fontFamily: FONTS.bold }}>Términos y Condiciones.</Text>
                </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(auth)")}>
                <Text style={[GLOBAL_STYLES.subtitle, { fontSize: 14, color: "#888", marginTop: 16, marginBottom: 36 }]}>¿Ya tienes una cuenta? <Text style={{ fontFamily: FONTS.bold, color: COLORS.primary }}>Iniciar sesión</Text></Text>
            </TouchableOpacity>

            <WarningNotification
                isVisible={showAgeWarning}
                message="Debes ser mayor de 18 años para poder registrarte."
                onConfirm={() => {
                    setShowAgeWarning(false);
                    setBirthDate(null);
                }}
            />
            <WarningNotification
                isVisible={showWarningNotification}
                message={notificationMessage}
                onConfirm={() => setShowWarningNotification(false)}
            />
            <SuccessNotification
                isVisible={showSuccessNotification}
                message={notificationMessage}
                onClose={() => setShowSuccessNotification(false)}
            />
            <ErrorNotification
                isVisible={showErrorNotification}
                message={errorMessage}
                onClose={() => setShowErrorNotification(false)}
            />
        </View>
    );
}