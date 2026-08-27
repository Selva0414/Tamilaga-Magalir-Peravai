import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, FlatList, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  interpolateColor,
  SharedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Learn New Skills',
    description: 'Empower yourself with high-demand digital and vocational skills designed for the modern world.',
    image: require('../assets/images/first.png'),
  },
  {
    id: 2,
    title: 'Career & Job\nOpportunities',
    description: 'Connect with a network of employers and find opportunities that match your aspirations.',
    image: require('../assets/images/Second.png'),
  },
  {
    id: 3,
    title: 'Women Safety & SOS',
    description: 'Your safety is our priority. Access instant help and security features with a single tap.',
    image: require('../assets/images/third.png'),
  },
  {
    id: 4,
    title: 'Community & Mentorship',
    description: 'Join a sisterhood of support. Connect with mentors and peers to grow together.',
    image: require('../assets/images/fourth.png'),
  }
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Animated pagination dot component
const PaginationDot = ({ index, scrollX }: { index: number, scrollX: SharedValue<number> }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    // Determine the input range based on the index and screen width
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    // Animate the width: expands to 24 when active, shrinks to 8 when inactive
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP
    );

    // Smoothly transition colors between grey (inactive) and dark burgundy (active)
    const backgroundColor = interpolateColor(
      scrollX.value,
      inputRange,
      ['#D3D3D3', '#3A0000', '#D3D3D3']
    );

    return {
      width: dotWidth,
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  // Track scroll position for animations
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onMomentumScrollEnd = (e: any) => {
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const handleNext = () => {
    const apparentIndex = Math.round(scrollX.value / width);
    if (apparentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentIndex(apparentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: apparentIndex + 1, animated: true });
    } else {
      router.replace('/login');
    }
  };

  const handleBack = () => {
    const apparentIndex = Math.round(scrollX.value / width);
    if (apparentIndex > 0) {
      setCurrentIndex(apparentIndex - 1);
      flatListRef.current?.scrollToIndex({ index: apparentIndex - 1, animated: true });
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.slide}>
        <Image
          source={item.image}
          style={styles.illustrationImage}
          contentFit="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3A0000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} /> // Spacer to balance header
        )}
        
        <Text style={styles.headerTitle}>Tamilaga Magalir Peravai</Text>
        
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slider (Swipable Pages) */}
      <View style={styles.sliderContainer}>
        <AnimatedFlatList
          ref={flatListRef}
          data={ONBOARDING_STEPS}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16} // High frequency for smooth animations
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Animated Pagination Dots */}
        <View style={styles.pagination}>
          {ONBOARDING_STEPS.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDING_STEPS.length - 1 ? 'Get Started 🚀' : 'Next >'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A0000',
  },
  skipText: {
    fontSize: 15,
    color: '#687076',
    fontWeight: '500',
    padding: 5,
  },
  sliderContainer: {
    flex: 1,
  },
  slide: {
    width, // Each slide takes full screen width
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  illustrationImage: {
    width: width * 0.8,
    height: width * 0.7,
    maxHeight: 280,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3A0000', 
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    marginHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#8B0000',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
