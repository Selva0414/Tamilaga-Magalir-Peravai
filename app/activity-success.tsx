import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ActivitySuccessScreen() {
  const router = useRouter();
  const { name, email, activityTitle } = useLocalSearchParams<{ name?: string, email?: string, activityTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const displayTitle = activityTitle || 'Financial Literacy Workshop';

  useEffect(() => {
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
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Tamilaga Magalir Peravai</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push({ pathname: '/notifications', params: { name, email } })}>
            <Ionicons name="notifications-outline" size={22} color="#A00B29" />
          </TouchableOpacity>
          <TouchableOpacity>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color="#A00B29" style={styles.avatar} />
            ) : (
              <Image source={{ uri: profilePhotoUri }} style={styles.avatar} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        
        {/* Success Graphic */}
        <View style={styles.graphicContainer}>
          <View style={styles.haloInner}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={40} color="#5A0B1E" />
            </View>
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.successTitle}>Participation Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            You have successfully registered for the <Text style={styles.boldRedText}>{displayTitle}</Text>. We will notify you with further details.
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={18} color="#A00B29" />
            <Text style={styles.infoText}>Upcoming Event: Oct 24, 2024</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#A00B29" />
            <Text style={styles.infoText}>Community Center, Chennai</Text>
          </View>
        </View>

      </View>

      {/* Footer Area */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push({ pathname: '/my-participation', params: { name, email } })}
        >
          <Text style={styles.primaryButtonText}>View My Participation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push({ pathname: '/dashboard', params: { name, email } })}
        >
          <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Actually mockup shows a slight gradient or just white with a light pink bottom. Let's use white.
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A00B29',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  graphicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  haloInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#5A0B1E', // Very dark red/burgundy behind the check
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    marginBottom: 15,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  boldRedText: {
    fontWeight: 'bold',
    color: '#A00B29',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0E5F0',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderTopWidth: 2,
    borderTopColor: '#F8DCE2', // Light pink top border
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 40 : 30,
  },
  primaryButton: {
    backgroundColor: '#A00B29',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FDF7FB', // Very light pink
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: '#A00B29',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
