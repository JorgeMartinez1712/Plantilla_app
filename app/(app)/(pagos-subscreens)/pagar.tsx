import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorNotification from '../../../components/common/ErrorNotification';
import InfoNotification from '../../../components/common/InfoNotification';
import SuccessNotification from '../../../components/common/SuccessNotification';
import PaymentHeader from '../../../components/history/PaymentHeader';
import BCVRateCard from '../../../components/pagos/BCVRateCard';
import DebitImmediateForm from '../../../components/pagos/DebitImmediateForm';
import DynamicFields from '../../../components/pagos/DynamicFields';
import FastNotification from '../../../components/pagos/FastNotification';
import PaymentDestinoInfo from '../../../components/pagos/PaymentDestinoInfo';
import PaymentMethodSelector from '../../../components/pagos/PaymentMethodSelector';
import styles from '../../../components/pagos/PayScreen.styles';
import { PaymentMethod, usePayments } from '../../../hooks/usePayments';
import { useRegister } from '../../../hooks/useRegister';
import { useSales } from '../../../hooks/useSales';

export default function RealizarPagosScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { saleId, paymentType, nextInstallmentAmount, totalDueAmount } = params;
    const { paymentMethods, loadingMethods, errorMethods, fetchPaymentMethodDetails, paymentMethodDetails, loadingMethodDetails, errorMethodDetails, submitPaymentMethodForm, loadingSubmission, requestDebitOtp, chargeDebit } = usePayments();
    const { saleDetail, fetchSaleById } = useSales();
    const { getDocumentTypes } = useRegister();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod['id'] | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [successVisible, setSuccessVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [diOtpRequested, setDiOtpRequested] = useState(false);
    const [diLastAction, setDiLastAction] = useState<'otp' | 'charge' | null>(null);
    const [otpValue, setOtpValue] = useState('');
    const [warningVisible, setWarningVisible] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [docTypes, setDocTypes] = useState<{ id: number; label: string; value: string; code: string }[]>([]);
    const [selectedDocTypeId, setSelectedDocTypeId] = useState<number | null>(null);
    const [docNumber, setDocNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
    const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
    const [fastNotificationVisible, setFastNotificationVisible] = useState(false);
    const diDocTypesLoadedRef = useRef(false);

    useEffect(() => {
        let amount = '';
        if (paymentType === 'next_installment' && nextInstallmentAmount) {
            amount = Array.isArray(nextInstallmentAmount) ? nextInstallmentAmount[0] : (nextInstallmentAmount as string);
        } else if (paymentType === 'total_due' && totalDueAmount) {
            amount = Array.isArray(totalDueAmount) ? totalDueAmount[0] : (totalDueAmount as string);
        }

        setPaymentAmount(amount);
        setIsCustomAmount(paymentType === 'custom_amount');
    }, [paymentType, nextInstallmentAmount, totalDueAmount]);


    useEffect(() => {
        if (saleId) {
            const idToFetch = Array.isArray(saleId) ? saleId[0] : saleId;
            fetchSaleById(idToFetch);
        }
    }, [saleId, fetchSaleById]);

    const handleGoBackToQuotas = () => {
        const idToPass = Array.isArray(saleId) ? saleId[0] : saleId;

        if (idToPass) {
            router.replace({
                pathname: '../quotas',
                params: { saleId: idToPass },
            });
        } else {
            router.replace('../../');
        }
    };

    const title = (() => {
        switch (paymentType) {
            case 'next_installment':
                return 'Realizar Pago de Cuotas';
            case 'custom_amount':
                return 'Pago Personalizado';
            case 'total_due':
                return 'Adelantar Pago Total';
            default:
                return 'Realizar Pago de Cuotas';
        }
    })();

    const handleAmountChange = (text: string) => {
        if (isCustomAmount) {
            setPaymentAmount(text.replace(/[^0-9.]/g, ''));
        }
    };

    const allRequiredFieldsFilled = () => {
        const fields = paymentMethodDetails?.payment_methods?.fields_front;
        if (!fields) return true;

        const entries = Object.entries(fields) as [string, any][];
        for (const [key, def] of entries) {
            const required = !!(def && (def.required || def.mandatory || def.rules?.required));
            if (!required) continue;

            if (key === 'amount') {
                const amt = parseFloat(paymentAmount || '0');
                if (Number.isNaN(amt) || amt <= 0) return false;
                continue;
            }

            if (key === 'amount_converted') {
                const conv = parseFloat(String(formValues.amount_converted ?? '0'));
                if (Number.isNaN(conv) || conv <= 0) return false;
                continue;
            }

            const val = formValues[key];
            if (val === undefined || val === null) return false;
            if (typeof val === 'string' && val.trim() === '') return false;
            if (typeof val === 'number' && Number.isNaN(val)) return false;
        }
        return true;
    };

    const formattedAmount = paymentAmount ? parseFloat(paymentAmount).toFixed(2) : '0.00';
    const numericAmount = parseFloat(paymentAmount);
    const isDebitInmediato = useMemo(() => {
        const code = paymentMethodDetails?.payment_methods?.code || '';
        const name = paymentMethodDetails?.payment_methods?.name || '';
        return String(code).toUpperCase().includes('DI') || String(name).toLowerCase().includes('débito inmediato') || String(name).toLowerCase().includes('debito inmediato');
    }, [paymentMethodDetails]);

    const debitFormValid = useMemo(() => {
        if (!isDebitInmediato) return false;
        if (!paymentAmount || Number.isNaN(numericAmount) || numericAmount <= 0) return false;
        if (!selectedDocTypeId) return false;
        if (!docNumber || docNumber.trim().length < 6) return false;
        const phoneDigitsLen = phoneNumber.replace(/\D/g, '').length;
        if (!phoneNumber || (phoneDigitsLen !== 10 && phoneDigitsLen !== 11)) return false;
        if (!selectedBankCode) return false;
        return true;
    }, [isDebitInmediato, paymentAmount, numericAmount, selectedDocTypeId, docNumber, phoneNumber, selectedBankCode]);

    const otpValid = useMemo(() => {
        if (!isDebitInmediato) return false;
        const onlyNums = otpValue.replace(/\D/g, '');
        return onlyNums.length >= 6;
    }, [isDebitInmediato, otpValue]);

    const isPayButtonDisabled = isDebitInmediato
        ? diOtpRequested ? !otpValid || loadingSubmission : !debitFormValid || loadingSubmission
        : numericAmount <= 0 || !selectedPaymentMethod || !allRequiredFieldsFilled() || loadingSubmission;

    useEffect(() => {
        if (paymentMethodDetails?.payment_methods?.fields_front) {
            const fields = paymentMethodDetails.payment_methods.fields_front;
            const initial: Record<string, any> = {};

            Object.keys(fields).forEach((key) => {
                if (key === 'origin_mobile_number') {
                    initial[key] = '';
                } else if (key === 'payment_date') {
                    initial[key] = null;
                } else {
                    initial[key] = '';
                }
            });

            if (paymentMethodDetails.lista_bancos && paymentMethodDetails.lista_bancos.length > 0) {
                initial['origin_bank'] = paymentMethodDetails.lista_bancos[0].codigo;
            }
            if (paymentMethodDetails.payment_type && paymentMethodDetails.payment_type.length > 0) {
                initial['payment_type_id'] = paymentMethodDetails.payment_type[0].id;
            }

            if (paymentMethodDetails.tasa_bcv && paymentMethodDetails.tasa_bcv.rate) {
                const rate = parseFloat(paymentMethodDetails.tasa_bcv.rate);
                const amt = parseFloat(paymentAmount || '0');
                if (!Number.isNaN(rate) && !Number.isNaN(amt)) {
                    initial['amount_converted'] = (amt * rate).toFixed(2);
                } else {
                    initial['amount_converted'] = '';
                }
            }

            setFormValues(initial);
        }
    }, [paymentMethodDetails, paymentAmount]);

    useEffect(() => {
        const rateStr = paymentMethodDetails?.tasa_bcv?.rate;
        const rate = rateStr ? parseFloat(rateStr) : NaN;
        const amt = parseFloat(paymentAmount || '0');

        if (!Number.isNaN(rate) && !Number.isNaN(amt)) {
            const converted = (amt * rate).toFixed(2);
            setFormValues(prev => ({ ...prev, amount_converted: converted }));
        } else {
            setFormValues(prev => ({ ...prev, amount_converted: '' }));
        }
    }, [paymentAmount, paymentMethodDetails?.tasa_bcv?.rate]);

    useEffect(() => {
        if (isDebitInmediato && !diDocTypesLoadedRef.current) {
            diDocTypesLoadedRef.current = true;
            getDocumentTypes().then((types) => {
                setDocTypes(types || []);
                if (types && types.length > 0) {
                    const defaultType = types.find((t: any) => String(t.code || '').toUpperCase() === 'V');
                    setSelectedDocTypeId(defaultType ? defaultType.id : types[0].id);
                }
            });
        }
    }, [isDebitInmediato, getDocumentTypes]);

    useEffect(() => {
        if (!paymentMethodDetails) return;
    try {
            const info = paymentMethodDetails?.info_method ?? null;
            const code = paymentMethodDetails?.payment_methods?.code || '';
            const name = paymentMethodDetails?.payment_methods?.name || '';
            const isDi = String(code).toUpperCase().includes('DI') || String(name).toLowerCase().includes('débito inmediato') || String(name).toLowerCase().includes('debito inmediato');
            if (isDi && info) {
                const cleaned = String(info).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
                setWarningMessage(cleaned);
                setWarningVisible(true);
            }
    } catch {
        }
    }, [paymentMethodDetails]);

    useEffect(() => {
        if (isDebitInmediato && paymentMethodDetails?.lista_bancos && paymentMethodDetails.lista_bancos.length > 0) {
            if (!selectedBankCode) {
                setSelectedBankCode(paymentMethodDetails.lista_bancos[0].codigo);
            }
        }
    }, [isDebitInmediato, paymentMethodDetails?.lista_bancos, selectedBankCode]);

    

    const handleFormChange = (field: string, value: any) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const copyToClipboard = async (text: string) => {
        try {
            await Clipboard.setStringAsync(String(text ?? ''));
            setFastNotificationVisible(true);
        } catch {
            setNotificationMessage('No se pudo copiar.');
            setErrorVisible(true);
        }
    };

    const copyAllPaymentDestino = async () => {
        const destino = paymentMethodDetails?.payment_movil_destino;
        if (!destino) return;
        const movil = destino.destino_movil ?? '';
        const documento = destino.destino_documemto ?? destino.destino_documento ?? '';
        const banco = destino.destino_banco ?? '';
        const all = `Móvil: ${movil}\nDocumento: ${documento}\nBanco destino: ${banco}`;
        await copyToClipboard(all);
    };

    const handleSubmitPayment = async () => {
        if (!selectedPaymentMethod) return;

        if (isDebitInmediato) {
            try {
                const monto = parseFloat(paymentAmount);
                if (!diOtpRequested) {
                    const payload = {
                        tipoDocumento: Number(selectedDocTypeId),
                        cedula: Number(docNumber.replace(/\D/g, '')),
                        telefono: Number(phoneNumber.replace(/\D/g, '')),
                        codigoBanco: String(selectedBankCode),
                        monto: Number(monto.toFixed(2)),
                    };
                    const res = await requestDebitOtp(payload);
                    const ok = res?.success === true || res?.status === 'success';
                    const msg = res?.message || 'OTP solicitada de forma exitosa';
                    if (ok) {
                        setNotificationMessage(msg);
                        setSuccessVisible(true);
                        setDiOtpRequested(true);
                        setDiLastAction('otp');
                    } else {
                        setNotificationMessage(msg || 'No se pudo solicitar la OTP.');
                        setErrorVisible(true);
                    }
                } else {
                    const idToPass = Array.isArray(saleId) ? Number(saleId[0]) : Number(saleId);
                    const amountConvertedNum = Number(parseFloat(String(formValues.amount_converted || '0')).toFixed(2));
                    const bcvId = paymentMethodDetails?.tasa_bcv?.bcv_currency_id;
                    const phoneDigits = phoneNumber.replace(/\D/g, '');
                    const normalizedPhone = phoneDigits.length === 11 && phoneDigits.startsWith('0') ? phoneDigits.slice(1) : phoneDigits;
                    const payload = {
                        sale_id: idToPass,
                        payment_method_id: Number(selectedPaymentMethod),
                        amount: Number(monto.toFixed(2)),
                        amount_converted: amountConvertedNum,
                        ...(typeof bcvId === 'number' ? { bcv_currency_id: bcvId } : {}),
                        origin_bank: String(selectedBankCode),
                        origin_mobile_number: String(normalizedPhone),
                        type_document: Number(selectedDocTypeId),
                        document: Number(docNumber.replace(/\D/g, '')),
                        token_otp: otpValue.replace(/\D/g, ''),
                    };
                    const res = await chargeDebit(payload);
                    const ok = res?.success === true || res?.status === 'success';
                    const msg = res?.message || 'Pago procesado correctamente';
                    if (ok) {
                        setNotificationMessage(msg);
                        setSuccessVisible(true);
                        setDiLastAction('charge');
                    } else {
                        setNotificationMessage(msg || 'Error al procesar el pago.');
                        setErrorVisible(true);
                    }
                }
            } catch (e: any) {
                const msg = e?.response?.data?.message || e?.message || 'Error procesando la solicitud.';
                setNotificationMessage(msg);
                setErrorVisible(true);
            }
            return;
        }

        const payload: Record<string, any> = { ...formValues };

        if (paymentAmount) payload.amount = paymentAmount;
        if (formValues.amount_converted) payload.amount_converted = formValues.amount_converted;

        const idToPass = Array.isArray(saleId) ? saleId[0] : saleId;
        if (idToPass) payload.sale_id = Number(idToPass);

        const bcvId = paymentMethodDetails?.tasa_bcv?.bcv_currency_id ?? paymentMethodDetails?.tasa_bcv?.bcv_currency_id ?? undefined;
        if (typeof bcvId !== 'undefined' && bcvId !== null) {
            payload.bcv_currency_id = bcvId;
        }

        if (payload.payment_date) {
            try {
                const d = new Date(payload.payment_date);
                if (!Number.isNaN(d.getTime())) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    payload.payment_date = `${yyyy}-${mm}-${dd}`;
                }
            } catch {
            }
        }

        try {
            const currencyId = saleDetail?.currency?.id ?? null;
            const result = await submitPaymentMethodForm(selectedPaymentMethod, payload, currencyId ?? undefined);

            const status = result?.status ?? null;
            const message = result?.message ?? 'Respuesta del servidor';

            if (status === 'success') {
                setNotificationMessage(message);
                setSuccessVisible(true);
            } else {
                setNotificationMessage(message || 'Error al procesar el pago.');
                setErrorVisible(true);
            }
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? 'Error al enviar los datos del formulario.';
            setNotificationMessage(msg);
            setErrorVisible(true);
            console.warn('submit payment failed', e);
        }
    };

    const handleCloseSuccess = () => {
        setSuccessVisible(false);
        if (isDebitInmediato) {
            if (diLastAction === 'otp') {
                return;
            }
            if (diLastAction === 'charge') {
                const idToPass = Array.isArray(saleId) ? saleId[0] : saleId;
                if (idToPass) {
                    router.replace({ pathname: '../quotas', params: { saleId: idToPass } });
                } else {
                    router.replace('../../');
                }
                return;
            }
        }
        const idToPass = Array.isArray(saleId) ? saleId[0] : saleId;
        if (idToPass) {
            router.replace({ pathname: '../quotas', params: { saleId: idToPass } });
        } else {
            router.replace('../../');
        }
    };

    const handleCloseError = () => {
        setErrorVisible(false);
    };

    useFocusEffect(useCallback(() => {
        let amount = '';
        if (paymentType === 'next_installment' && nextInstallmentAmount) {
            amount = Array.isArray(nextInstallmentAmount) ? nextInstallmentAmount[0] : (nextInstallmentAmount as string);
        } else if (paymentType === 'total_due' && totalDueAmount) {
            amount = Array.isArray(totalDueAmount) ? totalDueAmount[0] : (totalDueAmount as string);
        }

        setSelectedPaymentMethod(null);
        setFormValues({});
        setPaymentAmount(amount);
        setIsCustomAmount(paymentType === 'custom_amount');
        setSuccessVisible(false);
        setErrorVisible(false);
        setNotificationMessage('');
        setFastNotificationVisible(false);
        setDiOtpRequested(false);
        setOtpValue('');
        setSelectedDocTypeId(null);
        setDocNumber('');
        setPhoneNumber('');
        setSelectedBankCode(null);
        diDocTypesLoadedRef.current = false;

        return () => {
        };
    }, [paymentType, nextInstallmentAmount, totalDueAmount]));

    return (
        <View style={styles.fullContainer}>
            <PaymentHeader onBackPress={handleGoBackToQuotas} />
            <KeyboardAwareScrollView
                contentContainerStyle={styles.contentScroll}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 100 : 120}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <View style={styles.paymentCard}>
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Monto a pagar</Text>
                        <TextInput
                            style={[styles.input, isCustomAmount ? styles.editableInput : styles.disabledInput]}
                            placeholder="$ 0.00"
                            keyboardType="numeric"
                            placeholderTextColor="#707070"
                            value={paymentAmount ? `$ ${paymentAmount}` : ''}
                            onChangeText={handleAmountChange}
                            editable={isCustomAmount}
                        />
                        {!isCustomAmount && <Text style={styles.infoPaymentText}>*El monto no es editable.</Text>}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Método de Pago</Text>
                        {loadingMethods ? (
                            <View style={styles.loadingMethodsContainer}>
                                <ActivityIndicator size="small" color="#65B65F" />
                                <Text style={styles.loadingMethodsText}>Cargando métodos de pago...</Text>
                            </View>
                        ) : errorMethods ? (
                            <View style={styles.errorMethodsContainer}>
                                <Text style={styles.errorMethodsText}>{errorMethods}</Text>
                            </View>
                        ) : (
                            <PaymentMethodSelector
                                methods={paymentMethods}
                                selectedId={selectedPaymentMethod}
                                onSelect={async (method) => {
                                    setSelectedPaymentMethod(method.id);
                                    setDiOtpRequested(false);
                                    setDiLastAction(null);
                                    setOtpValue('');
                                    setSelectedDocTypeId(null);
                                    setDocNumber('');
                                    setPhoneNumber('');
                                    setSelectedBankCode(null);
                                    diDocTypesLoadedRef.current = false;
                                    const currencyId = saleDetail?.currency?.id ?? (method.currency_id ?? null);
                                    if (currencyId != null) {
                                        try {
                                            await fetchPaymentMethodDetails(method.id, currencyId);
                                        } catch {}
                                    } else {
                                        await fetchPaymentMethodDetails(method.id, method.currency_id);
                                    }
                                }}
                            />
                        )}
                    </View>

                    {selectedPaymentMethod && (
                        <View style={styles.formSection}>
                            {loadingMethodDetails ? (
                                <View style={styles.loadingMethodsContainer}>
                                    <ActivityIndicator size="small" color="#65B65F" />
                                    <Text style={styles.loadingMethodsText}>Cargando detalles del método...</Text>
                                </View>
                            ) : errorMethodDetails ? (
                                <View style={styles.errorMethodsContainer}>
                                    <Text style={styles.errorMethodsText}>{errorMethodDetails}</Text>
                                </View>
                            ) : paymentMethodDetails ? (
                                <View>
                                    {!isDebitInmediato && paymentMethodDetails?.payment_movil_destino && (
                                        <PaymentDestinoInfo
                                            destino={paymentMethodDetails.payment_movil_destino}
                                            onCopy={copyToClipboard}
                                            onCopyAll={copyAllPaymentDestino}
                                        />
                                    )}

                                    {paymentMethodDetails?.tasa_bcv && (
                                        <BCVRateCard
                                            rate={paymentMethodDetails.tasa_bcv.rate}
                                            rateDate={paymentMethodDetails.tasa_bcv.rate_date}
                                            amountConverted={formValues.amount_converted}
                                        />
                                    )}

                                    {isDebitInmediato ? (
                                        <DebitImmediateForm
                                            diOtpRequested={diOtpRequested}
                                            docTypes={docTypes}
                                            selectedDocTypeId={selectedDocTypeId}
                                            setSelectedDocTypeId={setSelectedDocTypeId}
                                            showDocumentTypeModal={showDocumentTypeModal}
                                            setShowDocumentTypeModal={setShowDocumentTypeModal}
                                            docNumber={docNumber}
                                            setDocNumber={setDocNumber}
                                            phoneNumber={phoneNumber}
                                            setPhoneNumber={setPhoneNumber}
                                            selectedBankCode={selectedBankCode}
                                            setSelectedBankCode={setSelectedBankCode}
                                            listaBancos={paymentMethodDetails?.lista_bancos || []}
                                            otpValue={otpValue}
                                            setOtpValue={setOtpValue}
                                        />
                                    ) : (
                                        <>
                                            {paymentMethodDetails.payment_methods?.fields_front && (
                                                <DynamicFields
                                                    fields={paymentMethodDetails.payment_methods.fields_front}
                                                    paymentMethodDetails={paymentMethodDetails}
                                                    formValues={formValues}
                                                    onChange={handleFormChange}
                                                />
                                            )}
                                            {!paymentMethodDetails.payment_methods?.fields_front && (
                                                <Text style={{ color: '#999', marginTop: 6, fontFamily: 'Poppins_400Regular' }}>No se encontraron campos dinámicos para este método.</Text>
                                            )}
                                        </>
                                    )}
                                </View>
                            ) : null}
                        </View>
                    )}

                    <TouchableOpacity style={[styles.payButton, (isPayButtonDisabled || loadingSubmission) && styles.disabledPayButton]} disabled={isPayButtonDisabled || loadingSubmission} onPress={handleSubmitPayment}>
                        {loadingSubmission ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.payButtonText}>
                                {isDebitInmediato ? (diOtpRequested ? `Pagar ${formattedAmount}` : 'Solicitar OTP') : `Pagar ${formattedAmount}`}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            <FastNotification visible={fastNotificationVisible} onHide={() => setFastNotificationVisible(false)} />
            <SuccessNotification isVisible={successVisible} message={notificationMessage} onClose={handleCloseSuccess} />
            <ErrorNotification isVisible={errorVisible} message={notificationMessage} onClose={handleCloseError} />
            <InfoNotification isVisible={warningVisible} message={warningMessage} onConfirm={() => setWarningVisible(false)} />
        </View>
    );
}

