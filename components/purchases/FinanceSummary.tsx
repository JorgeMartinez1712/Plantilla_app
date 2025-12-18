import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ASSETS_BASE_URL } from '../../constants/api';
import { FONTS } from '../../constants/fonts';
import { FinancialMetrics, useAuthContext } from '../../context/AuthContext';

interface FinanceSummaryProps {
    monthTitle: string;
    progressText: string;
    financingAmount: number;
    financialMetrics: FinancialMetrics | null;
    motivationText: string;
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};


const normalizePercentage = (value: any): number => {
    if (value == null) return 0;
    let n = 0;
    if (typeof value === 'number') {
        n = value;
    } else if (typeof value === 'string') {
        const m = value.match(/\d+(?:\.\d+)?/);
        n = m ? Number(m[0]) : 0;
    } else {
        n = Number(value) || 0;
    }
    const rounded = Math.round(n);
    return Math.max(0, Math.min(100, rounded));
};

const CircleProgress = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => {
    const radius = 35;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.progressCircleItem}>
            <View style={styles.progressCircleContainer}>
                <Svg width={radius * 2} height={radius * 2}>
                    <Circle
                        stroke="#FFFFFF"
                        fill="none"
                        cx={radius}
                        cy={radius}
                        r={radius - strokeWidth / 2}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke={color}
                        fill="none"
                        cx={radius}
                        cy={radius}
                        r={radius - strokeWidth / 2}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        originX={radius}
                        originY={radius}
                    />
                </Svg>
            </View>
            <View style={styles.percentageTextOverlay}>
                <Text style={styles.circlePercentage}>{percentage}%</Text>
                <Text style={styles.circleLabel}>{label}</Text>
            </View>
        </View>
    );
};

export default function FinanceSummary({
    monthTitle,
    progressText,
    financingAmount,
    financialMetrics,
    motivationText,
}: FinanceSummaryProps) {
    const { customerDetails } = useAuthContext();
    const profilePicUri = (() => {
        const a = customerDetails?.app_user?.avatar as string | undefined;
        if (a) {
            return a.startsWith('http') ? a : `${ASSETS_BASE_URL}${a.startsWith('/') ? '' : '/'}${a}`;
        }
        return customerDetails?.profile_picture;
    })();

    const paidPercentage = normalizePercentage(
        financialMetrics?.creditoPagadoPorc ?? financialMetrics?.creditoPagado ?? financialMetrics?.porcentaje_pagado ?? 0
    );

    const solvencyPercentage = normalizePercentage(
        financialMetrics?.solvenciaPorc ?? financialMetrics?.solvencia ?? 0
    );

    const availablePercentage = normalizePercentage(
        financialMetrics?.creditoDisponiblePorc ?? financialMetrics?.disponibilidad ?? 0
    );

    return (
        <View style={styles.financeSummaryCard}>
            <View style={styles.monthSection}>
                <Text style={styles.monthTitle}>{monthTitle}</Text>
                <Text style={styles.progressText}>{progressText}</Text>
            </View>
            <View style={styles.mainFinanceRow}>
                <View style={styles.financeTextColumn}>
                    <Text style={styles.financeLabelText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7} allowFontScaling={false}>Financiamiento</Text>
                    <View style={styles.amountWithIcon}>
                        <Ionicons name="flame" size={16} color="#363636" style={styles.flameIcon} />
                        <Text style={styles.financeAmount}>{formatCurrency(financingAmount)}</Text>
                    </View>
                </View>
                <View style={styles.financeCirclesContainer}>
                    <CircleProgress percentage={paidPercentage} color="#FBC02D" label="Pagado" />
                    <CircleProgress percentage={solvencyPercentage} color="#2196F3" label="Solvencia" />
                    <CircleProgress percentage={availablePercentage} color="#8E24AA" label="Disponible" />
                </View>
            </View>
            <View style={styles.motivationWrapper}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: profilePicUri }}
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.motivationContainer}>
                    <Text style={styles.motivationText}>{motivationText}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    financeSummaryCard: {
        backgroundColor: '#E5EBFC',
        borderRadius: 35,
        marginHorizontal: 20,
        paddingVertical: 20,
        marginTop: 15,
    },
    monthSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    monthTitle: {
        fontSize: 22,
        fontFamily: FONTS.bold,
        color: '#363636',
    },
    progressText: {
        fontSize: 14,
        color: '#3076CC',
        fontFamily: FONTS.semiBold,
    },
    mainFinanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    financeTextColumn: {
        flex: 1,
        marginRight: 10,
        minWidth: '22%',
    },
    financeLabelText: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
        fontFamily: FONTS.regular,
        flexShrink: 1,
    },
    amountWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flameIcon: {
        marginRight: 0,
        fontSize: 20,
    },
    financeAmount: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: '#363636',
    },
    financeCirclesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        flexGrow: 1,
        flexShrink: 1,
        gap: 20,
    },
    progressCircleItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    progressCircleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 70,
        height: 70,
    },
    percentageTextOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circlePercentage: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: '#363636',
    },
    circleLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
        fontFamily: FONTS.regular,
    },
    motivationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    profileImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#65B65F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        overflow: 'hidden',
        flexShrink: 0,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    motivationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 100,
        padding: 10,
    },
    motivationText: {
        flex: 1,
        fontSize: 11,
        color: '#363636',
        fontFamily: FONTS.medium,
    },
});