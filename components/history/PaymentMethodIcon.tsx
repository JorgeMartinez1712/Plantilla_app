import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

interface PaymentMethodIconProps {
    iconName: string;
    size?: number;
    color?: string;
}

const iconMap: { [key: string]: string } = {
    'FaExchangeAlt': 'exchange-alt', 
    'FaMobileAlt': 'mobile-alt', 
};

const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ iconName, size = 20, color = '#65B65F' }) => {
    const faIconName = iconMap[iconName] || 'credit-card'; 

    return (
        <FontAwesome5 name={faIconName} size={size} color={color} />
    );
};

export default PaymentMethodIcon;