import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ActiveEmergencyScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  // Animation for the pulsing rings
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Profile fetching
    const fetchUserProfile = async () => {
      if (email) {
        setIsLoadingProfile(true);
        try {
          const response = await fetch(`http://localhost:5000/api/user/${email}`);
          const data = await response.json();
          if (response.ok && data.user && data.user.profile_photo) {
            setProfilePhotoUri(data.user.profile_photo);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };
    fetchUserProfile();
    
    // Countdown logic
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // Pulse animation
    const animatePulse = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            })
          ]),
          Animated.sequence([
            Animated.timing(pulseAnim2, {
              toValue: 1.6,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim2, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            })
          ])
        ])
      ).start();
    };
    
    animatePulse();
    
    return () => {
      clearInterval(timer);
    };
  }, [email, pulseAnim, pulseAnim2]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Tamilaga Magalir Peravai</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push({ pathname: '/notifications', params: { name, email } })}>
            <Ionicons name="notifications-outline" size={22} color="#8B0000" />
          </TouchableOpacity>
          <TouchableOpacity>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#8B0000" style={styles.avatar} />
            ) : (
              <Image source={{ uri: profilePhotoUri }} style={styles.avatar} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Active Emergency Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.emergencyBadge}>
            <Ionicons name="warning" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.emergencyBadgeText}>ACTIVE EMERGENCY</Text>
          </View>
        </View>

        {/* Pulse Countdown Section */}
        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseRing2, { transform: [{ scale: pulseAnim2 }] }]} />
          <Animated.View style={[styles.pulseRing1, { transform: [{ scale: pulseAnim }] }]} />
          
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>0{countdown}</Text>
            <Text style={styles.countdownText}>SECONDS</Text>
          </View>
        </View>

        {/* Alert Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <Ionicons name="people" size={20} color="#8B0000" style={{ marginRight: 10 }} />
            <Text style={styles.infoTitle}>Alerting 5 Trusted Contacts</Text>
          </View>
          <Text style={styles.infoDesc}>
            SMS, automated calls, and live coordinates are being sent to your primary circle.
          </Text>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Location Map Card */}
        <View style={styles.mapCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.mapImage}
            blurRadius={2}
          />
          {/* Overlay styling to mimic the radar effect */}
          <View style={styles.mapOverlay}>
            <View style={styles.radarCircle1}>
              <View style={styles.radarCircle2}>
                <Ionicons name="location" size={40} color="#D81B60" style={styles.mapPin} />
              </View>
            </View>
          </View>
          
          <View style={styles.locationPill}>
            <Ionicons name="location" size={14} color="#8B0000" style={{ marginRight: 6 }} />
            <Text style={styles.locationText}>Current: 12.9716° N, 77.5946° E • Anna Nagar</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.callButtonText}>CALL EMERGENCY 112</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Ionicons name="close" size={20} color="#8B0000" style={{ marginRight: 10 }} />
            <Text style={styles.cancelButtonText}>CANCEL SOS</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B0000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A0B1E', // Very dark red
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emergencyBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 30,
  },
  countdownCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#8B0000',
    zIndex: 10,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#8B0000',
  },
  countdownText: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pulseRing1: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(139, 0, 0, 0.4)', // 40% opacity #8B0000
    zIndex: 5,
  },
  pulseRing2: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(139, 0, 0, 0.15)', // 15% opacity #8B0000
    zIndex: 1,
  },
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#F0E0E5',
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B0000',
    borderRadius: 2,
    width: '60%', // Static 60% fill
  },
  mapCard: {
    marginHorizontal: 20,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 25,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2C1B2A', // Dark purpleish background as fallback
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 27, 42, 0.5)', // Darken the map
  },
  radarCircle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(216, 27, 96, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 27, 96, 0.1)',
  },
  radarCircle2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(216, 27, 96, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 27, 96, 0.3)',
  },
  mapPin: {
    transform: [{ translateY: -10 }],
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  locationPill: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A0B1E',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8B0000',
  },
  cancelButtonText: {
    color: '#8B0000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
