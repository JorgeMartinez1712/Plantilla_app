import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  iconComponent: React.ElementType;
  iconName: string;
  iconColor: string;
  iconSize: number;
  label: string;
  onPress: () => void;
}

export default function SettingItem({ iconComponent: IconComponent, iconName, iconColor, iconSize, label, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconLabelGroup}>
        <IconComponent name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#B0B0B0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 100,
    marginBottom: 10,
  },
  iconLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 17,
    color: '#363636',
  },
});