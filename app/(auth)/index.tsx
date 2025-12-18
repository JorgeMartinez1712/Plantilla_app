import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import LoginForm from "../../components/login/LoginForm";
import { GLOBAL_STYLES, SIZES } from "../../constants/theme";

export default function LoginScreen() {
    return (
        <KeyboardAvoidingView
            style={GLOBAL_STYLES.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={[GLOBAL_STYLES.scrollContent, { alignItems: 'center', paddingTop: 60, paddingBottom: 20 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable onPress={Keyboard.dismiss} style={{ flexGrow: 1, width: '100%', alignItems: 'center' }}>
                    <Image
                        source={require("../../assets/images/sin_bordes.png")}
                        style={{ width: SIZES.width * 1, height: SIZES.width * 0.4, marginTop: 50 }}
                        resizeMode="contain"
                    />
                    <LoginForm />
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}