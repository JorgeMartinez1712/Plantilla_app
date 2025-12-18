import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RequirementProps {
    isValid: boolean;
    text: string;
}

const Requirement: React.FC<RequirementProps> = ({ isValid, text }) => (
    <View style={passwordRequirementsStyles.requirementContainer}>
        <MaterialIcons
            name={isValid ? 'check-circle' : 'cancel'}
            size={16}
            color={isValid ? 'green' : 'red'}
        />
        <Text style={[passwordRequirementsStyles.requirementText, { color: isValid ? 'green' : 'red' }]}>
            {text}
        </Text>
    </View>
);

interface PasswordRequirementsProps {
    validations: {
        hasUpperCase: boolean;
        minLength: boolean;
        hasNumber: boolean;
        passwordsMatch: boolean;
    };
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ validations }) => {
    return (
        <View style={passwordRequirementsStyles.container}>
            <Requirement isValid={validations.hasUpperCase} text="Debe contener al menos una letra mayúscula" />
            <Requirement isValid={validations.minLength} text="Debe contener al menos 8 caracteres" />
            <Requirement isValid={validations.hasNumber} text="Debe contener al menos un número" />
            <Requirement isValid={validations.passwordsMatch} text="Las contraseñas deben coincidir" />
        </View>
    );
};

const passwordRequirementsStyles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    requirementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    requirementText: {
        marginLeft: 5,
        fontSize: 13,
        fontFamily: 'Poppins_400Regular',
    },
});

export default PasswordRequirements;