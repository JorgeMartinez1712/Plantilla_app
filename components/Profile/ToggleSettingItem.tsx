import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface ToggleSettingItemProps {
  iconComponent: React.ElementType;
  iconName: string;
  iconColor: string;
  iconSize: number;
  label: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export default function ToggleSettingItem({ iconComponent: IconComponent, iconName, iconColor, iconSize, label, value, onValueChange }: ToggleSettingItemProps) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconLabelGroup}>
        <IconComponent name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch
        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
        thumbColor={value ? '#FFFFFF' : '#F4F4F4'}
        ios_backgroundColor="#E0E0E0"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
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