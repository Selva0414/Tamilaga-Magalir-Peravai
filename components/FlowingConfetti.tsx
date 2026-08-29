import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
  runOnUI,
  withRepeat,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const GOLD_COLORS = [
  '#FFD700', // Gold
  '#D4AF37', // Metallic Gold
  '#DAA520', // Goldenrod
  '#B8860B', // Dark Goldenrod
  '#F0E68C', // Khaki/Light Gold
  '#998100', // Olive Gold
];

interface FlowingConfettiProps {
  particleCount?: number;
}

const Particle = () => {
  // Initial spawn off-screen above
  const translateY = useSharedValue(-100 - (Math.random() * height));
  const translateX = useSharedValue(Math.random() * width);
  
  // Appearance properties
  const pWidth = useSharedValue(10);
  const pHeight = useSharedValue(10);
  const pRadius = useSharedValue(0);
  const pOpacity = useSharedValue(1);
  const pColor = useSharedValue(GOLD_COLORS[0]);

  // Rotations
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(Math.random() * 360);

  useEffect(() => {
    runOnUI(() => {
      'worklet';
      const random = (min: number, max: number) => Math.random() * (max - min) + min;

      const startAnimationLoop = (isInitial: boolean) => {
        // 1. Determine Speed/Depth Layer
        const speedLayerRoll = Math.random();
        let fallDuration = 4000;
        let sizeScale = 1;
        let layerOpacity = 1;

        if (speedLayerRoll < 0.2) {
          // Slow (Background)
          fallDuration = random(5500, 7500); 
          sizeScale = random(0.3, 0.6);
          layerOpacity = random(0.3, 0.6);
        } else if (speedLayerRoll < 0.7) {
          // Medium (Midground)
          fallDuration = random(3500, 5000);
          sizeScale = random(0.7, 1.1);
          layerOpacity = random(0.7, 0.95);
        } else {
          // Fast (Foreground)
          fallDuration = random(2000, 3000);
          sizeScale = random(1.2, 1.8);
          layerOpacity = random(0.9, 1.0);
        }

        // 2. Shape Generation
        const shapeRoll = Math.random();
        if (shapeRoll < 0.30) {
          pWidth.value = random(3, 5) * sizeScale;
          pHeight.value = random(3, 5) * sizeScale;
          pRadius.value = pWidth.value / 2;
        } else if (shapeRoll < 0.65) {
          pWidth.value = random(5, 8) * sizeScale;
          pHeight.value = random(6, 10) * sizeScale;
          pRadius.value = 2;
        } else if (shapeRoll < 0.90) {
          pWidth.value = random(8, 12) * sizeScale;
          pHeight.value = random(12, 20) * sizeScale;
          pRadius.value = 1;
        } else {
          pWidth.value = random(1, 3) * sizeScale;
          pHeight.value = random(15, 25) * sizeScale;
          pRadius.value = 1;
        }

        // Color & Opacity
        pColor.value = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        pOpacity.value = layerOpacity;

        // Reset positions for recycle
        if (!isInitial) {
          translateY.value = -100;
          translateX.value = random(0, width);
          rotateX.value = 0;
          rotateY.value = 0;
        }

        // 3. Movement Execution
        // STRONG VERTICAL DOWNWARD MOVEMENT
        const distanceToFall = height + 150 - translateY.value;
        const totalDistance = height + 250; 
        const adjustedDuration = isInitial ? fallDuration * (distanceToFall / totalDistance) : fallDuration;

        translateY.value = withTiming(height + 150, {
          duration: adjustedDuration,
          easing: Easing.linear, // Constant downward speed (gravity)
        }, (finished) => {
          if (finished) {
            startAnimationLoop(false);
          }
        });

        // VERY GENTLE, STRICTLY DOWNWARD DRIFT
        // Instead of repeating a sine wave, just drift slightly to one side during the fall
        const targetX = translateX.value + random(-25, 25);
        translateX.value = withTiming(targetX, { duration: adjustedDuration, easing: Easing.linear });

        // CONTINUOUS TUMBLING
        rotateX.value = withRepeat(withTiming(rotateX.value + 360, { duration: random(800, 2000), easing: Easing.linear }), -1, false);
        rotateY.value = withRepeat(withTiming(rotateY.value + (Math.random() > 0.5 ? 360 : -360), { duration: random(800, 2000), easing: Easing.linear }), -1, false);
        rotateZ.value = withRepeat(withTiming(rotateZ.value + (Math.random() > 0.5 ? 360 : -360), { duration: random(1000, 3000), easing: Easing.linear }), -1, false);
      };

      startAnimationLoop(true);
    })();

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotateX);
      cancelAnimation(rotateY);
      cancelAnimation(rotateZ);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: pWidth.value,
      height: pHeight.value,
      borderRadius: pRadius.value,
      backgroundColor: pColor.value,
      opacity: pOpacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
        { rotateZ: `${rotateZ.value}deg` },
      ],
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export default function FlowingConfetti({
  particleCount = 220,
}: FlowingConfettiProps) {
  const particles = Array.from({ length: particleCount }).map((_, i) => i);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((id) => (
        <Particle key={id} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
