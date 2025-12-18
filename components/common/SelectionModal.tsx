import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CommonOption = {
  key: string;
  label: string;
  description?: string;
  left?: React.ReactNode;
};

interface SelectionModalProps {
  isVisible: boolean;
  title: string;
  options: CommonOption[];
  onSelect: (key: string) => void;
  onClose: () => void;
  renderOption?: (opt: CommonOption, onSelect: (key: string) => void) => React.ReactNode;
}

export default function SelectionModal({ isVisible, title, options, onSelect, onClose, renderOption }: SelectionModalProps) {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: CommonOption }) => {
    const rendered = renderOption ? renderOption(item, onSelect) : (
      <TouchableOpacity style={styles.option} onPress={() => onSelect(item.key)}>
        {item.left}
        <Text style={styles.optionText}>{item.label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#BEBEBE" />
      </TouchableOpacity>
    );

    return <>{rendered}</>;
  };

  return (
    <Modal transparent animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: styles.container.paddingBottom + insets.bottom }] as any}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle-outline" size={28} color="#363636" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '75%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36363663F'
    ,fontFamily: 'Poppins_700Bold'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14
  },
  optionText: {
    fontSize: 16,
    color: '#363636',
    flex: 1,
    marginRight: 8,
    textAlign: 'left',
    fontFamily: 'Poppins_400Regular'
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0'
  }
});
