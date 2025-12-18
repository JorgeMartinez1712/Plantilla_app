import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorNotification from '../../../components/common/ErrorNotification';
import SelectionModal from '../../../components/common/SelectionModal';
import SuccessNotification from '../../../components/common/SuccessNotification';
import WarningNotification from '../../../components/common/WarningNotification';
import occupations from '../../../components/Profile/OccupationList.json';
import ProfileHeader from '../../../components/Profile/ProfileHeader';
import { useAuthContext } from '../../../context/AuthContext';
import useProfile from '../../../hooks/useProfile';

export default function SocioeconomicScreen() {
    const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
    const [occupation, setOccupation] = useState('');
    const [academicLevel, setAcademicLevel] = useState('');
    const [originalIncome, setOriginalIncome] = useState<number>(0);
    const [originalOccupation, setOriginalOccupation] = useState('');
    const [originalLevel, setOriginalLevel] = useState('');
    const [recordId, setRecordId] = useState<number | null>(null);
    const [editing, setEditing] = useState<boolean>(true);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [isSuccessVisible, setIsSuccessVisible] = useState(false);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [warningAction, setWarningAction] = useState(() => () => { });
    const [isOccupationModalVisible, setIsOccupationModalVisible] = useState(false);
    const [isAcademicModalVisible, setIsAcademicModalVisible] = useState(false);

    const { fetchSocioeconomicData, createSocioeconomicData, updateSocioeconomicData, loading } = useProfile();
    const { user } = useAuthContext();
    const router = useRouter();

    const hasChanges = useMemo(() => {
        if (!editing) return false;
        return monthlyIncome !== originalIncome || occupation !== originalOccupation || academicLevel !== originalLevel;
    }, [editing, monthlyIncome, occupation, academicLevel, originalIncome, originalOccupation, originalLevel]);

    useEffect(() => {
        const load = async () => {
            if (!user?.customers_id) {
                setInitialized(true);
                return;
            }
            const res = await fetchSocioeconomicData(user.customers_id);
            if (res.success && res.data) {
                const inc = parseInt(String(res.data.approximate_monthly_income), 10) || 0;
                const occ = res.data.occupation || '';
                const lvl = res.data.education_level || '';
                setMonthlyIncome(inc);
                setOccupation(occ);
                setAcademicLevel(lvl);
                setOriginalIncome(inc);
                setOriginalOccupation(occ);
                setOriginalLevel(lvl);
                setRecordId(res.data.id);
                setEditing(false);
            } else {
                setEditing(true);
                setRecordId(null);
                setOriginalIncome(0);
                setOriginalOccupation('');
                setOriginalLevel('');
            }
            setInitialized(true);
        };
        load();
    }, [user?.customers_id]);

    const handleSave = async () => {
        if (!user?.customers_id) {
            setIsErrorVisible(true);
            return;
        }
        if (recordId) {
            const payload = {
                id: recordId,
                approximate_monthly_income: monthlyIncome,
                occupation: occupation,
                education_level: academicLevel,
            };
            const result = await updateSocioeconomicData(payload);
            if (result.success) {
                setOriginalIncome(monthlyIncome);
                setOriginalOccupation(occupation);
                setOriginalLevel(academicLevel);
                setIsSuccessVisible(true);
                setEditing(false);
                setTimeout(() => {
                    setIsSuccessVisible(false);
                    router.back();
                }, 1500);
            } else {
                setIsErrorVisible(true);
            }
        } else {
            const payload = {
                customer_id: user.customers_id,
                approximate_monthly_income: monthlyIncome,
                occupation: occupation,
                education_level: academicLevel,
            };
            const result = await createSocioeconomicData(payload);
            if (result.success) {
                setRecordId(result.data?.id || null);
                setOriginalIncome(monthlyIncome);
                setOriginalOccupation(occupation);
                setOriginalLevel(academicLevel);
                setIsSuccessVisible(true);
                setEditing(false);
                setTimeout(() => {
                    setIsSuccessVisible(false);
                    router.back();
                }, 1500);
            } else {
                setIsErrorVisible(true);
            }
        }
    };

    const handleBackPress = () => {
        if (hasChanges) {
            setWarningAction(() => () => router.back());
            setIsWarningVisible(true);
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <ProfileHeader
                title="Datos Socioeconómicos"
                onBackPress={handleBackPress}
            />
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.subtitle}>¡Gana puntos extra! Cuanta más información completes, más beneficios obtendrás.</Text>

                {!initialized ? (
                    <View />
                ) : editing ? (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Ingresos mensuales promedio</Text>
                            <View style={styles.sliderValueRow}>
                                <Text style={styles.sliderMinMax}>$0</Text>
                                <Text style={styles.sliderValue}>${monthlyIncome}</Text>
                                <Text style={styles.sliderMinMax}>$5000</Text>
                            </View>
                            <Slider
                                minimumValue={0}
                                maximumValue={5000}
                                step={10}
                                value={monthlyIncome}
                                onValueChange={(v) => setMonthlyIncome(Math.round(v))}
                                minimumTrackTintColor="#65B65F"
                                maximumTrackTintColor="#EAEFFF"
                                thumbTintColor="#65B65F"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Ocupación</Text>
                            <TouchableOpacity style={styles.selector} onPress={() => setIsOccupationModalVisible(true)}>
                                <Text style={[styles.selectorText, occupation ? styles.selectorTextValue : styles.selectorTextPlaceholder]}>
                                    {occupation || 'Selecciona tu ocupación'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nivel académico</Text>
                            <TouchableOpacity style={styles.selector} onPress={() => setIsAcademicModalVisible(true)}>
                                <Text style={[styles.selectorText, academicLevel ? styles.selectorTextValue : styles.selectorTextPlaceholder]}>
                                    {academicLevel || 'Selecciona tu nivel académico'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {hasChanges && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Ingresos mensuales promedio</Text>
                                <Text style={styles.cardValue}>${monthlyIncome}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Ocupación</Text>
                                <Text style={styles.cardValue}>{occupation || 'No disponible'}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Nivel académico</Text>
                                <Text style={styles.cardValue}>{academicLevel || 'No disponible'}</Text>
                            </View>
                            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                                <Text style={styles.editButtonText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </KeyboardAwareScrollView>

            <SuccessNotification
                isVisible={isSuccessVisible}
                message="¡Datos guardados exitosamente!"
                onClose={() => {
                    setIsSuccessVisible(false);
                    router.back();
                }}
            />
            <ErrorNotification
                isVisible={isErrorVisible}
                message="Error al guardar los datos."
                onClose={() => setIsErrorVisible(false)}
            />
            <SelectionModal
                isVisible={isOccupationModalVisible}
                title="Selecciona tu ocupación"
                options={occupations.map(o => ({ key: o, label: o }))}
                onSelect={(key) => {
                    setOccupation(key);
                    setIsOccupationModalVisible(false);
                }}
                onClose={() => setIsOccupationModalVisible(false)}
            />
            <SelectionModal
                isVisible={isAcademicModalVisible}
                title="Selecciona tu nivel académico"
                options={[
                    'Primaria',
                    'Secundaria',
                    'Técnico',
                    'Universitario',
                    'Postgrado',
                    'Maestría',
                    'Doctorado',
                    'Otro'
                ].map(o => ({ key: o, label: o }))}
                onSelect={(key) => {
                    setAcademicLevel(key);
                    setIsAcademicModalVisible(false);
                }}
                onClose={() => setIsAcademicModalVisible(false)}
            />
            <WarningNotification
                isVisible={isWarningVisible}
                message="¿Estás seguro de salir sin guardar?"
                onConfirm={() => {
                    setIsWarningVisible(false);
                    warningAction();
                }}
                onCancel={() => setIsWarningVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#F6F9FF',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#363636',
            fontFamily: 'Poppins_700Bold',
    },
    scrollViewContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 8,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    cardLabel: {
        color: '#707070',
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    cardValue: {
        color: '#363636',
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    editButton: {
        backgroundColor: '#65B65F',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'Poppins_700Bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#707070',
        marginBottom: 20,
        fontWeight: '500',
        textAlign: 'center',
            fontFamily: 'Poppins_500Medium',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#363636',
        marginBottom: 5,
        fontWeight: '600',
            fontFamily: 'Poppins_600SemiBold',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#65B65F',
        shadowColor: '#65B65F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selector: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectorText: {
        fontSize: 16,
            fontFamily: 'Poppins_400Regular',
    },
    selectorTextPlaceholder: {
        color: '#BEBEBE',
    },
    selectorTextValue: {
        color: '#363636',
    },
    sliderValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    sliderMinMax: {
        color: '#707070',
        fontSize: 12,
            fontFamily: 'Poppins_400Regular',
    },
    sliderValue: {
        color: '#65B65F',
        fontSize: 16,
        fontWeight: '700',
            fontFamily: 'Poppins_700Bold',
    },
    saveButton: {
        backgroundColor: '#3076CC',
        paddingVertical: 15,
        borderRadius: 30,
        marginHorizontal: 0,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 120,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
            fontFamily: 'Poppins_700Bold',
    },
});