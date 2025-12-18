import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import RegisterForm from "../../components/register/RegisterForm";
import { GLOBAL_STYLES } from "../../constants/theme";

export default function RegisterScreen() {
    return (
        <KeyboardAvoidingView
            style={GLOBAL_STYLES.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={[GLOBAL_STYLES.scrollContent, { alignItems: 'center', paddingTop: 0, paddingBottom: 50 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable onPress={Keyboard.dismiss} style={{ flexGrow: 1, alignItems: 'center', width: '100%' }}>
                    <RegisterForm />
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}