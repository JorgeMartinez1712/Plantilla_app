import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FONTS } from '../../constants/fonts';
import { FinancingPlan } from '../../hooks/useCalculator';

interface FinancingDetailsProps {
    productPrice: number | null;
    installments: number;
    onInstallmentsChange: (value: number) => void;
    interestRate: number | null;
    initialPayment: number;
    onInitialPaymentChange: (value: number) => void;
    minInitialPayment: number;
    financingPlans: FinancingPlan[];
    selectedFinancingPlan: FinancingPlan | null;
    onSelectFinancingPlan: (plan: FinancingPlan | null) => void;
}

export default function FinancingDetails({
    productPrice,
    installments,
    onInstallmentsChange,
    interestRate,
    initialPayment,
    onInitialPaymentChange,
    minInitialPayment,
    financingPlans,
    selectedFinancingPlan,
    onSelectFinancingPlan,
}: FinancingDetailsProps) {

    const maxCuotasForPlan = selectedFinancingPlan ? parseInt(selectedFinancingPlan.cuotas, 10) : 6;
    const minCuotasForPlan = 1;

    return (
        <View style={styles.card}>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Precio del Producto:</Text>
                <TextInput
                    style={styles.fullWidthInput}
                    value={productPrice !== null ? `$ ${productPrice.toFixed(2)}` : '$ 0.00'}
                    editable={false}
                />
            </View>
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Plan de Financiamiento:</Text>
                {financingPlans.length > 0 ? (
                    <Dropdown
                        style={styles.fullWidthDropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={financingPlans.map(p => ({ label: p.name, value: p.id }))}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Selecciona un plan"
                        value={selectedFinancingPlan ? selectedFinancingPlan.id : null}
                        onChange={item => {
                            const plan = financingPlans.find(p => p.id === item.value);
                            onSelectFinancingPlan(plan || null);
                        }}
                        renderRightIcon={() => (
                            <MaterialIcons style={styles.icon} name="keyboard-arrow-down" size={20} color="#666" />
                        )}
                        containerStyle={styles.dropdownListContainer}
                    />
                ) : (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>No hay planes de financiamiento disponibles para este producto.</Text>
                    </View>
                )}
            </View>
            <View style={styles.sliderRow}>
                <Text style={styles.label}>Número de cuotas ({minCuotasForPlan} a {maxCuotasForPlan}):</Text>
                <Text style={styles.sliderValueText}>{installments}</Text>
            </View>
            <Slider
                style={styles.sliderFullWidth}
                minimumValue={minCuotasForPlan}
                maximumValue={maxCuotasForPlan}
                step={1}
                value={installments}
                onValueChange={onInstallmentsChange}
                minimumTrackTintColor="#B1C4EE"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#B1C4EE"
            />

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Tasa de interés mensual (%):</Text>
                <TextInput
                    style={styles.fullWidthInput}
                    value={interestRate !== null ? `${(interestRate * 100).toFixed(2)}%` : '0.00%'}
                    editable={false}
                />
            </View>
            <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                    <Text style={styles.label}>Inicial (${minInitialPayment.toFixed(2)} Mín):</Text>
                </View>
                <Slider
                    style={styles.sliderFullWidth}
                    minimumValue={minInitialPayment}
                    maximumValue={productPrice || 1000}
                    step={1}
                    value={initialPayment}
                    onValueChange={onInitialPaymentChange}
                    minimumTrackTintColor="#B1C4EE"
                    maximumTrackTintColor="#E0E0E0"
                    thumbTintColor="#B1C4EE"
                />
                <View style={styles.sliderLabels}>
                    <Text>${minInitialPayment.toFixed(2)}</Text>
                    <Text>${productPrice ? productPrice.toFixed(2) : '0.00'}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        ...Platform.select({
            ios: {},
            android: {
                elevation: 0,
            },
        }),
    },
    fieldContainer: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#363636',
        fontFamily: FONTS.bold,
        marginBottom: 8,
    },
    fullWidthInput: {
        fontSize: 16,
        color: '#363636',
        backgroundColor: '#E6F0FF',
        fontFamily: FONTS.medium,
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: '100%',
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    dropdown: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 8,
        flex: 1,
        marginLeft: 10,
    },
    fullWidthDropdown: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 12,
        width: '100%',
    },
    sliderContainer: {
        marginTop: 10,
        marginBottom: 15,
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    sliderValueText: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: '#363636',
        marginLeft: 10,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    sliderFullWidth: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        marginTop: -5,
    },
    dropdownSmall: {
        height: 50,
        width: 80,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 8,
        marginLeft: 10,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#9E9E9E',
        textAlign: 'left',
        fontFamily: FONTS.regular,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#363636',
        textAlign: 'center',
        fontFamily: FONTS.regular,
    },
    icon: {
        marginRight: 5,
    },
    dropdownListContainer: {
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#90CAF9',
        alignItems: 'center',
    },
    infoText: {
        color: '#2196F3',
        fontSize: 15,
        textAlign: 'center',
        fontFamily: FONTS.regular,
    },
});