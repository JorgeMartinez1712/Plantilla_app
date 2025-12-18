import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function AnimatedWavingHand() {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 150, easing: Easing.linear }),
        withTiming(10, { duration: 150, easing: Easing.linear }),
        withTiming(0, { duration: 150, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
        <Text style={styles.handEmoji}>👋🏻</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handEmoji: {
    fontSize: 22,
    lineHeight: 22,
  },
});