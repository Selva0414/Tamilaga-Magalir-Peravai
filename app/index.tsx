import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import FlowingConfetti from '../components/FlowingConfetti';

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(100, { 
      duration: 4000, 
      easing: Easing.inOut(Easing.ease) 
    });

    // Navigate to onboarding after 4.3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 4300);

    return () => clearTimeout(timer);
  }, [router]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  return (
    <LinearGradient
      colors={['#3E0000', '#9E1B32']}
      style={styles.container}
    >
      <FlowingConfetti />
      <View style={styles.borderFrame}>
        
        {/* Main Content (Lamp and Text) */}
        <View style={styles.mainContent}>
          {/* Lamp Image - reduced size further */}
          <Image
            source={require('../assets/images/Screen.png')}
            style={styles.lampImage}
            resizeMode="contain"
          />
          
          {/* Tamil Text added below the lamp */}
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>தமிழக மகளிர்</Text>
            <Text style={styles.subtitleText}>பேரவை</Text>
          </View>
        </View>

        {/* Golden Loading Bar at the bottom */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingFill, progressStyle]} />
          </View>
        </View>
        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  borderFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#D4AF37', // Gold border
    padding: 10,
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  mainContent: {
    flex: 0.9, 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  lampImage: {
    width: '55%', // Reduced the lamp size significantly
    height: '45%',
    marginBottom: 25, // Space between lamp and text
  },
  textContainer: {
    alignItems: 'center',
  },
  titleText: {
    color: '#D4AF37', // Elegant gold color
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    color: '#D4AF37',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    width: '60%', 
    marginBottom: 40, 
    alignItems: 'flex-start',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.2)', 
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#D4AF37', 
    borderRadius: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  }
});
