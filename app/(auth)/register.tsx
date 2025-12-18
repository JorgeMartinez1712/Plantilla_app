import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import RegisterForm from "../../components/register/RegisterForm";
import { registerScreenStyles } from '../../components/register/RegisterScreen.styles';

export default function RegisterScreen() {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={registerScreenStyles.screenContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable onPress={Keyboard.dismiss} style={registerScreenStyles.pressableContainer}>
                    <RegisterForm />
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}