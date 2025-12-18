import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '../../constants/fonts';

type Props = {
  visible: boolean;
  text?: string;
  duration?: number;
  onHide?: () => void;
  containerStyle?: ViewStyle;
};

export default function FastNotification({ visible, text = 'Copiado', duration = 2000, onHide, containerStyle }: Props) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
      const t = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start(() => {
          onHide && onHide();
        });
      }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, onHide, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle, { top: insets.top + 50 }, { opacity, transform: [{ translateY }] }]}>        
      <MaterialIcons name="content-copy" size={16} color="#01008A" style={{ marginRight: 6 }} />
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9EFFD',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 999,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: '#01008A',
  },
});
