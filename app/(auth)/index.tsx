import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import LoginForm from "../../components/login/LoginForm";
import { loginScreenStyles } from '../../components/login/LoginScreen.styles';

export default function LoginScreen() {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, width: '100%', backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={loginScreenStyles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable onPress={Keyboard.dismiss} style={loginScreenStyles.pressableContainer}>
                    <Image
                        source={require("../../assets/images/sin_bordes.png")}
                        style={loginScreenStyles.logo}
                        resizeMode="contain"
                    />
                    <LoginForm />
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}