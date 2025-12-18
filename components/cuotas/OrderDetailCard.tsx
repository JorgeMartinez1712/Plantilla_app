import { StyleSheet, Text, View } from 'react-native';
import CarritoIcon from '../../assets/iconos/Carrito.svg';

interface OrderDetailCardProps {
    orderNumber: string | undefined;
    saleDate: string | undefined;
}

export default function OrderDetailCard({ orderNumber, saleDate }: OrderDetailCardProps) {
    return (
        <View style={styles.orderInfoContainer}>
            <View style={styles.contentWrapper}>
                <View style={styles.iconContainer}>
                    <CarritoIcon width={40} height={40} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.dateText}>{saleDate || 'Fecha no disponible'}</Text>
                    <Text style={styles.orderNumber}>Orden #{orderNumber || 'N/A'}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orderInfoContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 100,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        marginBottom: 10,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    orderNumber: {
        fontSize: 13,
        fontFamily: 'Poppins_500Medium',
        color: '#363636',
    },
    facturaButton: {
        fontSize: 12,
        borderRadius: 100,
        backgroundColor: '#efffe0ff',
        letterSpacing: -0.16,
        padding: 10,
        lineHeight: 20,
        fontWeight: "500",
        fontFamily: "Poppins_500Medium",
        color: "#65d404ff",
        textAlign: "center",
        marginRight: 15,
    },
});