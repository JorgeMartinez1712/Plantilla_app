import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import SelectionModal, { CommonOption } from '../common/SelectionModal';
import styles from './PayScreen.styles';

type DocType = { id: number; label: string; value: string; code: string };

type Props = {
  diOtpRequested: boolean;
  docTypes: DocType[];
  selectedDocTypeId: number | null;
  setSelectedDocTypeId: (id: number) => void;
  showDocumentTypeModal: boolean;
  setShowDocumentTypeModal: (v: boolean) => void;
  docNumber: string;
  setDocNumber: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  selectedBankCode: string | null;
  setSelectedBankCode: (v: string) => void;
  listaBancos: any[];
  otpValue: string;
  setOtpValue: (v: string) => void;
};

export default function DebitImmediateForm({
  diOtpRequested,
  docTypes,
  selectedDocTypeId,
  setSelectedDocTypeId,
  showDocumentTypeModal,
  setShowDocumentTypeModal,
  docNumber,
  setDocNumber,
  phoneNumber,
  setPhoneNumber,
  selectedBankCode,
  setSelectedBankCode,
  listaBancos,
  otpValue,
  setOtpValue,
}: Props) {
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [bankOptions, setBankOptions] = useState<CommonOption[]>([]);

  const openBankModal = () => {
    setBankOptions((listaBancos || []).map((b: any) => ({ key: String(b.codigo), label: `${b.nombre} (${b.codigo})` })));
    setBankModalVisible(true);
  };
  return (
    <View>
      {!diOtpRequested && (
        <View>
          <Text style={styles.label}>Tipo y Número de Documento</Text>
          <View style={styles.documentInputContainer}>
            <TouchableOpacity onPress={() => setShowDocumentTypeModal(true)} style={styles.documentTypeDropdownInput}>
              <Text style={{ color: selectedDocTypeId ? '#000' : '#999' }}>
                {docTypes.find((item) => item.id === selectedDocTypeId)?.code || 'Tipo'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#999" />
            </TouchableOpacity>
            <TextInput
              style={styles.documentNumberInput}
              value={docNumber}
              onChangeText={(t) => setDocNumber(t.replace(/\D/g, '').slice(0, 8))}
              keyboardType="numeric"
              placeholder="12345678"
              placeholderTextColor="#999"
              maxLength={8}
            />
          </View>

            <SelectionModal
              isVisible={showDocumentTypeModal}
              title="Selecciona Tipo de Documento"
              options={docTypes.map((d) => ({ key: String(d.id), label: `${d.label} (${d.code})` }))}
              onSelect={(key: string) => { setSelectedDocTypeId(Number(key)); setShowDocumentTypeModal(false); }}
              onClose={() => setShowDocumentTypeModal(false)}
            />

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Número de Teléfono</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ej: 04141234567"
              placeholderTextColor="#707070"
              value={phoneNumber}
              onChangeText={(t) => setPhoneNumber(t.replace(/\D/g, '').slice(0, 11))}
              maxLength={11}
            />
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Banco</Text>
            <TouchableOpacity style={styles.input} onPress={openBankModal}>
              <Text style={{ color: selectedBankCode ? '#363636' : '#707070' }}>{(listaBancos || []).find(b => b.codigo === selectedBankCode)?.nombre ? `${(listaBancos || []).find(b => b.codigo === selectedBankCode)?.nombre} (${selectedBankCode})` : 'Seleccione el Banco'}</Text>
            </TouchableOpacity>
            <SelectionModal
              isVisible={bankModalVisible}
              title="Selecciona Banco"
              options={bankOptions}
              onSelect={(key) => { setSelectedBankCode(key); setBankModalVisible(false); }}
              onClose={() => setBankModalVisible(false)}
            />
          </View>
        </View>
      )}

      {diOtpRequested && (
        <View style={{ marginTop: 4 }}>
          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="••••••"
            placeholderTextColor="#707070"
            value={otpValue}
            onChangeText={(t) => setOtpValue(t.replace(/\D/g, '').slice(0, 8))}
            maxLength={8}
          />
        </View>
      )}
    </View>
  );
}
