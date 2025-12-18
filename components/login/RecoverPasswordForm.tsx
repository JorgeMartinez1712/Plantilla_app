import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { FONTS } from '../../constants/fonts';

interface RecoverPasswordFormProps {
  onSendCode: (email: string) => void;
  onGoBack: () => void;
  loading: boolean;
}

export default function RecoverPasswordForm({ onSendCode, onGoBack, loading }: RecoverPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    onSendCode(email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/sin_bordes.png')}
            style={styles.logo}
          />
          <View style={styles.confirmationContainer}>
            <View style={styles.exclamationIconContainer}>
              <Text style={styles.exclamationIcon}>!</Text>
            </View>
            <Text style={styles.confirmationTitle}>Confirmación</Text>
            <Text style={styles.recoverTitle}>Recuperar Contraseña</Text>
            <Text style={styles.description}>
              Nos tomamos muy en serio la información que nos proporcionas, ayúdanos a confirmar que eres tú
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor="#65B65F"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.checkIconContainer}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkIcon}>✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={[
          styles.backButton,
          loading && styles.backButtonDisabled
        ]}
        onPress={onGoBack}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#F6F9FF',
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
    marginBottom: 30,
  },
  exclamationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  exclamationIcon: {
    fontSize: 40,
    fontFamily: FONTS.bold,
    color: "#65B65F",
  },
  confirmationTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: "#65B65F",
  },
  recoverTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: "#363636",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 280,
    fontFamily: FONTS.regular,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingHorizontal: 12,
    marginBottom: 20,
    width: "100%",
    height: 50,
    backgroundColor: "#cdf8c2ff"
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    fontFamily: FONTS.regular,
  },
  checkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#65B65F",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkIcon: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  backButton: {
    backgroundColor: '#65B65F',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  backButtonDisabled: {
    backgroundColor: '#81c78dff',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});