import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface AppTextProps extends RNTextProps {
  fontWeight?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

export const AppText: React.FC<AppTextProps> = ({
  style,
  fontWeight = 'regular',
  ...props
}) => {
  const fontFamily = FONTS[fontWeight];

  return (
    <RNText
      style={[styles.defaultText, { fontFamily }, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: FONTS.regular,
  },
});

export { AppText as Text };
export default AppText;