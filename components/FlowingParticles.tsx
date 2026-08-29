import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FlowingParticlesProps {
  particleCount?: number;
  color?: string;
  speed?: number; // 1 is normal, < 1 is slower, > 1 is faster
  opacity?: number;
}

const Particle = ({ color, speedMultiplier, baseOpacity }: { color: string, speedMultiplier: number, baseOpacity: number }) => {
  const startX = Math.random() * width;
  const startY = -(Math.random() * height * 0.5) - 50; // Start offscreen above
  
  const size = Math.random() * 8 + 4; // Between 4 and 12
  
  // Reanimated values
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const rotation = useSharedValue(Math.random() * 360);
  const particleOpacity = useSharedValue(0);

  // Randomize characteristics
  const fallDuration = (Math.random() * 4000 + 4000) / speedMultiplier; // 4s to 8s
  const driftDistance = (Math.random() * 100 - 50); // -50 to 50
  const driftDuration = Math.random() * 2000 + 2000;
  const rotationDuration = Math.random() * 3000 + 3000;
  
  // Random delay so they don't all start falling at once
  const delay = Math.random() * 5000;

  useEffect(() => {
    // Falling animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 50, {
          duration: fallDuration,
          easing: Easing.linear,
        }),
        -1, // infinite
        false // don't reverse
      )
    );

    // Drifting (wave) animation
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + driftDistance, { duration: driftDuration, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX - driftDistance, { duration: driftDuration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true // reverse to create smooth back and forth
      )
    );

    // Rotation animation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(rotation.value + (Math.random() > 0.5 ? 360 : -360), {
          duration: rotationDuration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Opacity animation (fade in at top, stay visible, fade out at bottom)
    // We simulate this by fading in at the start of the drop and fading out towards the end.
    // A simpler approach for continuous effect is pulsing slightly while falling, 
    // or just maintaining the base opacity and letting it loop. 
    // To prevent popping, we fade it in after delay.
    particleOpacity.value = withDelay(
      delay,
      withTiming(baseOpacity * (Math.random() * 0.5 + 0.5), { duration: 1000 })
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotation);
      cancelAnimation(particleOpacity);
    };
  }, [delay, fallDuration, driftDistance, driftDuration, rotationDuration, startX, baseOpacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { rotateX: `${rotation.value * 0.5}deg` }, // 3D leaf flutter effect
        { rotateY: `${rotation.value * 0.8}deg` },
      ],
      opacity: particleOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size * 1.5, // Slightly elongated like a leaf
          backgroundColor: color,
          // Asymmetric border radii for an irregular confetti/leaf shape
          borderTopLeftRadius: size,
          borderBottomRightRadius: size,
          borderTopRightRadius: size * 0.2,
          borderBottomLeftRadius: size * 0.2,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function FlowingParticles({
  particleCount = 40,
  color = '#D4AF37', // Gold
  speed = 1,
  opacity = 0.8,
}: FlowingParticlesProps) {
  // Create an array to map over
  const particles = Array.from({ length: particleCount }).map((_, i) => i);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((id) => (
        <Particle 
          key={id} 
          color={color} 
          speedMultiplier={speed} 
          baseOpacity={opacity} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10, // Ensure it floats above the background but you can adjust zIndex in parent
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    // Add subtle shadow for premium look
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
