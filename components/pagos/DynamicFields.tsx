import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';
import { useRegister } from '../../hooks/useRegister';
import SelectionModal, { CommonOption } from '../common/SelectionModal';
import payStyles from './PayScreen.styles';

type Props = {
    fields: Record<string, any>;
    paymentMethodDetails?: any;
    formValues: Record<string, any>;
    onChange: (field: string, value: any) => void;
};

export default function DynamicFields({ fields, paymentMethodDetails, formValues, onChange }: Props) {
    const [showDatePickerField, setShowDatePickerField] = useState<string | null>(null);
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [selectModalState, setSelectModalState] = useState<{
        visible: boolean;
        label: string;
        options: CommonOption[];
        onSelect: (key: string) => void;
        selectedKey?: string;
    } | null>(null);

    type DocType = { id: number; label: string; value: string; code: string };
    const [docTypes, setDocTypes] = useState<DocType[]>([]);
    const [showDocTypeModal, setShowDocTypeModal] = useState(false);
    const { getDocumentTypes } = useRegister();

    const handleOpenDateModal = (fieldKey: string) => {
        setTempDate(formValues[fieldKey] ?? new Date());
        setShowDatePickerField(fieldKey);
    };

    const handleCancelDateModal = () => {
        setTempDate(null);
        setShowDatePickerField(null);
    };

    const handleConfirmDateModal = (fieldKey: string) => {
        if (tempDate) {
            onChange(fieldKey, tempDate);
        }
        setTempDate(null);
        setShowDatePickerField(null);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const current = selectedDate || tempDate || new Date();
        if (Platform.OS === 'android') {
            setShowDatePickerField(null);
            onChange(showDatePickerField ?? '', current);
        } else {
            setTempDate(current);
        }
    };

    const hasDocPair = useMemo(() => {
        return !!(fields && Object.prototype.hasOwnProperty.call(fields, 'type_document') && Object.prototype.hasOwnProperty.call(fields, 'document'));
    }, [fields]);

    useEffect(() => {
        if (hasDocPair && docTypes.length === 0) {
            Promise.resolve(getDocumentTypes()).then((types: any) => {
                if (Array.isArray(types)) setDocTypes(types as DocType[]);
            }).catch(() => {});
        }
    }, [hasDocPair, getDocumentTypes, docTypes.length]);

    const currentTypeDocument = formValues['type_document'];
    useEffect(() => {
        if (!hasDocPair) return;
        if (docTypes.length === 0) return;
        const current = Number(currentTypeDocument ?? 0) || null;
        if (current) return;
        const ve = docTypes.find(d => String(d.code || '').toUpperCase() === 'V') || docTypes[0];
        if (ve) onChange('type_document', ve.id);
    }, [hasDocPair, docTypes, currentTypeDocument, onChange]);

    return (
        <>
        <View>
            {Object.entries(fields || {}).map(([fieldKey, fieldDef]: any) => {
                if (fieldKey === 'amount' || fieldKey === 'amount_converted') return null;
                const type = fieldDef.type || 'text';
                const label = fieldDef.label || fieldKey;
                const required = !!fieldDef.required;

                if (hasDocPair && fieldKey === 'type_document') {
                    const selectedDocTypeId = Number(formValues['type_document'] ?? 0) || null;
                    const selectedDocCode = docTypes.find(d => d.id === selectedDocTypeId)?.code;
                    return (
                        <View key="doc_pair" style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>Tipo y Número de Documento{required ? ' *' : ''}</Text>
                            <View style={payStyles.documentInputContainer}>
                                <TouchableOpacity onPress={() => setShowDocTypeModal(true)} style={payStyles.documentTypeDropdownInput}>
                                    <Text style={{ color: selectedDocTypeId ? '#000' : '#999' }}>{selectedDocCode || 'Tipo'}</Text>
                                    <MaterialIcons name="arrow-drop-down" size={24} color="#999" />
                                </TouchableOpacity>
                                <TextInput
                                    style={payStyles.documentNumberInput}
                                    value={String(formValues['document'] ?? '')}
                                    onChangeText={(t) => onChange('document', t.replace(/[^0-9]/g, '').slice(0, 10))}
                                    keyboardType="numeric"
                                    placeholder="1234567890"
                                    placeholderTextColor="#999"
                                    maxLength={10}
                                />
                            </View>

                            <SelectionModal
                                isVisible={showDocTypeModal}
                                title="Selecciona Tipo de Documento"
                                options={docTypes.map((d) => ({ key: String(d.id), label: `${d.label} (${d.code})` }))}
                                onSelect={(key: string) => { onChange('type_document', Number(key)); setShowDocTypeModal(false); }}
                                onClose={() => setShowDocTypeModal(false)}
                            />
                        </View>
                    );
                }

                if (hasDocPair && fieldKey === 'document') return null;

                if (type === 'textarea') {
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                multiline
                                value={formValues[fieldKey] ?? ''}
                                onChangeText={(t) => onChange(fieldKey, t)}
                                placeholder={label}
                            />
                        </View>
                    );
                }

                if (fieldKey === 'origin_bank') {
                    const options = paymentMethodDetails?.lista_bancos?.map((b: any) => ({ key: String(b.codigo), label: b.nombre })) ?? [];
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setSelectModalState({
                                visible: true,
                                label: label,
                                options: options,
                                selectedKey: String(formValues[fieldKey] ?? ''),
                                onSelect: (key: string) => { onChange(fieldKey, key); setSelectModalState(null); }
                            })}>
                                <Text style={{ color: formValues[fieldKey] ? '#363636' : '#9a9a9a' }}>{options.find((o: CommonOption) => o.key === String(formValues[fieldKey]))?.label ?? 'Seleccione el Banco'}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }

                if (fieldKey === 'payment_type_id') {
                    const options = paymentMethodDetails?.payment_type?.map((p: any) => ({ key: String(p.id), label: p.name })) ?? [];
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setSelectModalState({
                                visible: true,
                                label: label,
                                options: options,
                                selectedKey: String(formValues[fieldKey] ?? ''),
                                onSelect: (key: string) => { onChange(fieldKey, key); setSelectModalState(null); }
                            })}>
                                <Text style={{ color: formValues[fieldKey] ? '#363636' : '#9a9a9a' }}>{options.find((o: CommonOption) => o.key === String(formValues[fieldKey]))?.label ?? 'Seleccione el Tipo de Pago'}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }

                if (fieldKey === 'origin_mobile_number') {
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(formValues[fieldKey] ?? '')}
                                onChangeText={(t) => onChange(fieldKey, t.replace(/[^0-9]/g, '').slice(0, 12))}
                                placeholder={label}
                                maxLength={12}
                            />
                        </View>
                    );
                }

                if (fieldKey === 'reference_number') {
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(formValues[fieldKey] ?? '')}
                                onChangeText={(t) => onChange(fieldKey, t.replace(/[^0-9]/g, '').slice(0, 20))}
                                placeholder={label}
                                maxLength={20}
                            />
                        </View>
                    );
                }

                if (fieldKey === 'payment_date') {
                    const dateValue: Date | null = formValues[fieldKey] ?? null;
                    return (
                        <View key={fieldKey} style={{ marginBottom: 12 }}>
                            <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                            <TouchableOpacity onPress={() => handleOpenDateModal(fieldKey)} style={[styles.input, { justifyContent: 'center' }]}>
                                <Text style={{ color: dateValue ? '#363636' : '#9a9a9a' }}>{dateValue ? dateValue.toLocaleDateString() : 'Seleccione una fecha'}</Text>
                            </TouchableOpacity>

                            <Modal
                                transparent={true}
                                animationType="fade"
                                visible={showDatePickerField === fieldKey}
                                onRequestClose={handleCancelDateModal}
                            >
                                <Pressable style={styles.datePickerModalOverlay} onPress={handleCancelDateModal}>
                                    <Pressable style={styles.datePickerModalContent} onPress={(e) => e.stopPropagation()}>
                                        <Text style={styles.modalTitle}>Selecciona tu Fecha</Text>
                                        <DateTimePicker
                                            value={tempDate || new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleDateChange}
                                            maximumDate={new Date()}
                                            textColor={Platform.OS === 'ios' ? '#65B65F' : undefined}
                                        />
                                        <View style={styles.datePickerModalButtons}>
                                            <TouchableOpacity onPress={handleCancelDateModal} style={[styles.datePickerButton, { backgroundColor: '#ccc' }]}>
                                                <Text style={styles.datePickerButtonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleConfirmDateModal(fieldKey)} style={styles.datePickerButton}>
                                                <Text style={styles.datePickerButtonText}>Confirmar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Pressable>
                                </Pressable>
                            </Modal>
                        </View>
                    );
                }

                const keyboardType = type === 'number' ? 'numeric' : (type === 'email' ? 'email-address' : 'default');

                return (
                    <View key={fieldKey} style={{ marginBottom: 12 }}>
                        <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType={keyboardType as any}
                            value={String(formValues[fieldKey] ?? '')}
                            onChangeText={(t) => onChange(fieldKey, t)}
                            placeholder={label}
                        />
                    </View>
                );
            })}
        </View>
        {selectModalState && (
            <SelectionModal
                isVisible={selectModalState!.visible}
                title={selectModalState!.label}
                options={selectModalState!.options}
                onSelect={(key) => selectModalState!.onSelect(key)}
                onClose={() => setSelectModalState(null)}
            />
        )}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        color: '#545454',
        marginBottom: 10,
        fontFamily: FONTS.regular,
    },
    input: {
        backgroundColor: '#F6F9FF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#363636',
        minHeight: 50,
        fontFamily: FONTS.regular,
    },
    datePickerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePickerModalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        marginBottom: 12,
    },
    datePickerModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    datePickerButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#65B65F',
        borderRadius: 100,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    datePickerButtonText: {
        color: '#fff',
        fontFamily: FONTS.bold,
    },
});
