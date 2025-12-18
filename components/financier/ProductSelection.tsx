import { MaterialIcons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FONTS } from '../../constants/fonts';
import { Product } from '../../hooks/useCalculator';

interface ProductSelectionProps {
    products: Product[];
    selectedProduct: Product | null;
    onSelectProduct: (product: Product | null) => void;
}

export default function ProductSelection({ products, selectedProduct, onSelectProduct }: ProductSelectionProps) {
    if (!products || products.length === 0) {
        return (
            <View style={styles.card}>
                <Text style={styles.label}>Producto a financiar:</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>No hay productos disponibles.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.label}>Producto a financiar:</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={products.map(p => ({ label: p.name, value: p.id }))}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Selecciona un producto"
                searchPlaceholder="Buscar..."
                value={selectedProduct ? selectedProduct.id : null}
                onChange={item => {
                    const product = products.find(p => p.id === item.value);
                    onSelectProduct(product || null);
                }}
                renderRightIcon={() => (
                    <MaterialIcons style={styles.icon} name="keyboard-arrow-down" size={20} color="#666" />
                )}
                containerStyle={styles.dropdownListContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
        ...Platform.select({
            ios: {
            },
            android: {
                elevation: 0,
            },
        }),
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#363636',
        fontFamily: FONTS.bold,
    },
    dropdown: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 8,
        backgroundColor: '#E6F0FF',
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#9E9E9E',
        fontFamily: FONTS.regular,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#363636',
        fontFamily: FONTS.regular,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderRadius: 20,
        borderColor: '#E0E0E0',
        paddingHorizontal: 10,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    dropdownListContainer: {
        borderRadius: 15,
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