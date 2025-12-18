import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { FONTS } from '../../constants/fonts';
import { useRegister } from "../../hooks/useRegister";
import { AnimatedWavingHand } from "../common/AnimatedWavingHand";
import ErrorNotification from "../common/ErrorNotification";
import PasswordRequirements from "../common/PasswordRequirements";
import SuccessNotification from "../common/SuccessNotification";
import WarningNotification from "../common/WarningNotification";
import { registerScreenStyles } from './RegisterScreen.styles';

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
        <View style={[registerScreenStyles.form, { position: 'relative' }]}>
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
                <Text style={registerScreenStyles.welcomeText}>
                    Hola amigo
                </Text>
                <AnimatedWavingHand />
            </View>
            <Text style={registerScreenStyles.signInPrompt}>Crea tu cuenta con nosotros</Text>
            <Text style={registerScreenStyles.subtitle}>Con una cuenta, todo será</Text>
            <Text style={registerScreenStyles.subtitle}>fácil y rápido</Text>

            <View style={registerScreenStyles.tabContainer}>
                <Pressable style={registerScreenStyles.inactiveTab} onPress={() => router.push("/(auth)")}>
                    <Text style={registerScreenStyles.inactiveTabText}>Iniciar Sesión</Text>
                </Pressable>
                <Pressable style={registerScreenStyles.activeTab} onPress={() => { }}>
                    <Text style={registerScreenStyles.activeTabText}>Registrarse</Text>
                </Pressable>
            </View>

            <Text style={registerScreenStyles.label}>Tipo y Número de Documento</Text>
            <View style={registerScreenStyles.documentInputContainer}>
                <TouchableOpacity
                    onPress={() => setShowDocumentTypeModal(true)}
                    style={[registerScreenStyles.documentTypeDropdownInput, isDocumentVerified && registerScreenStyles.disabledInput]}
                    disabled={isDocumentVerified}
                >
                    <Text style={{ color: documentType ? "#000" : "#999" }}>
                        {documentTypeItems.find(item => item.value === documentType)?.code || "Tipo"}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#999" />
                </TouchableOpacity>
                <TextInput
                    style={[registerScreenStyles.documentNumberInput, isDocumentVerified && registerScreenStyles.disabledInput]}
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
                    style={isDocumentVerified ? [registerScreenStyles.checkButton, registerScreenStyles.resetButton] : registerScreenStyles.checkButton}
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
                    style={registerScreenStyles.datePickerModalOverlay}
                    onPress={() => setShowDocumentTypeModal(false)}
                >
                    <Pressable
                        style={registerScreenStyles.datePickerModalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <Text style={registerScreenStyles.modalTitle}>Selecciona Tipo de Documento</Text>
                        <FlatList
                            data={documentTypeItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={registerScreenStyles.documentTypeOption}
                                    onPress={() => handleSelectDocumentType(item.value)}
                                >
                                    <Text style={registerScreenStyles.documentTypeOptionText}>
                                        {item.label} ({item.code})
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={registerScreenStyles.documentTypeFlatList}
                        />
                        <TouchableOpacity
                            onPress={() => setShowDocumentTypeModal(false)}
                            style={[registerScreenStyles.datePickerButton, { marginTop: 20, backgroundColor: '#ccc' }]}
                        >
                            <Text style={registerScreenStyles.datePickerButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <Text style={registerScreenStyles.label}>Nombre y Apellido</Text>
            <TextInput
                style={[registerScreenStyles.input, !isDocumentVerified && registerScreenStyles.disabledInput]}
                value={fullName}
                onChangeText={handleNameChange}
                placeholder="Nombre y Apellido"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={registerScreenStyles.label}>Fecha de Nacimiento</Text>
            <TouchableOpacity onPress={handleOpenDatePicker} style={[registerScreenStyles.input, !isDocumentVerified && registerScreenStyles.disabledInput]} disabled={!isDocumentVerified}>
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
                <Pressable style={registerScreenStyles.datePickerModalOverlay} onPress={handleCancelDatePicker}>
                    <Pressable style={registerScreenStyles.datePickerModalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={registerScreenStyles.modalTitle}>Selecciona tu Fecha</Text>
                        <DateTimePicker
                            value={tempBirthDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            textColor={Platform.OS === 'ios' ? '#65B65F' : undefined}
                        />
                        <View style={registerScreenStyles.datePickerModalButtons}>
                            <TouchableOpacity onPress={handleCancelDatePicker} style={[registerScreenStyles.datePickerButton, { backgroundColor: '#ccc' }]}>
                                <Text style={registerScreenStyles.datePickerButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmDatePicker} style={registerScreenStyles.datePickerButton}>
                                <Text style={registerScreenStyles.datePickerButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <Text style={registerScreenStyles.label}>Dirección</Text>
            <TextInput
                style={[registerScreenStyles.input, !isDocumentVerified && registerScreenStyles.disabledInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Tu dirección"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={registerScreenStyles.label}>Correo Electrónico</Text>
            <TextInput
                style={[registerScreenStyles.input, !isDocumentVerified && registerScreenStyles.disabledInput]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="ejemplo@gmail.com"
                placeholderTextColor="#999"
                editable={isDocumentVerified}
            />

            <Text style={registerScreenStyles.label}>Número de Teléfono</Text>
            <View style={registerScreenStyles.phoneInputContainer}>
                <View style={[registerScreenStyles.countryPickerButton, !isDocumentVerified && registerScreenStyles.disabledInput]} pointerEvents={!isDocumentVerified ? 'none' : 'auto'}>
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
                                <Text style={registerScreenStyles.countryCodeText}>
                                    {country ? `+${country.callingCode[0]}` : '+58'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <TextInput
                    style={[registerScreenStyles.phoneTextInput, !isDocumentVerified && registerScreenStyles.disabledInput]}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholder="4141331400"
                    placeholderTextColor="#999"
                    editable={isDocumentVerified}
                />
            </View>

            <Text style={registerScreenStyles.label}>Contraseña</Text>
            <View style={registerScreenStyles.passwordInputContainer}>
                <TextInput
                    style={[registerScreenStyles.passwordInput, !isDocumentVerified && registerScreenStyles.disabledInput]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    textContentType="newPassword"
                    autoComplete="new-password"
                    editable={isDocumentVerified}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={registerScreenStyles.eyeIcon} disabled={!isDocumentVerified}>
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#999" />
                </TouchableOpacity>
            </View>

            <Text style={registerScreenStyles.label}>Repetir Contraseña</Text>
            <View style={registerScreenStyles.passwordInputContainer}>
                <TextInput
                    style={[registerScreenStyles.passwordInput, !isDocumentVerified && registerScreenStyles.disabledInput]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    textContentType="newPassword"
                    autoComplete="new-password"
                    editable={isDocumentVerified}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={registerScreenStyles.eyeIcon} disabled={!isDocumentVerified}>
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#999" />
                </TouchableOpacity>
            </View>

            <PasswordRequirements validations={passwordValidations} />

            <TouchableOpacity style={registerScreenStyles.registerButton} onPress={handleRegister} disabled={loading || !isDocumentVerified}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={registerScreenStyles.registerButtonText}>Registrarse</Text>
                )}
            </TouchableOpacity>

            <View style={registerScreenStyles.termsContainer}>
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} disabled={!isDocumentVerified}>
                    <View style={[registerScreenStyles.checkbox, !isDocumentVerified && { borderColor: '#ccc' }]}>
                        {termsAccepted && <View style={registerScreenStyles.checkedCheckbox} />}
                    </View>
                </TouchableOpacity>
                <Text style={[registerScreenStyles.termsText, !isDocumentVerified && { color: '#ccc' }]}>
                    Acepto los <Text style={registerScreenStyles.boldText}>Términos y Condiciones.</Text>
                </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(auth)")}>
                <Text style={registerScreenStyles.registerLink}>¿Ya tienes una cuenta? <Text style={{ fontFamily: FONTS.bold, color: "#65B65F" }}>Iniciar sesión</Text></Text>
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