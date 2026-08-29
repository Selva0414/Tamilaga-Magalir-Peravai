import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SuccessScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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

  // Display name or default
  const displayName = name || 'User';
  
  // Format current date for the registered date display
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Enrollment Confirmed</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="#A00B29" />
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
          {/* Background halos */}
          <View style={styles.haloOuter}>
            <View style={styles.haloInner}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </View>
            </View>
          </View>
          
          {/* Confetti pieces (decorative) */}
          <View style={[styles.confetti, { top: '20%', left: '10%', backgroundColor: '#80DEEA', transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confetti, { top: '10%', left: '35%', backgroundColor: '#CE93D8', transform: [{ rotate: '15deg' }] }]} />
          <View style={[styles.confetti, { top: '30%', right: '15%', backgroundColor: '#F48FB1', transform: [{ rotate: '60deg' }] }]} />
          <View style={[styles.confetti, { top: '60%', left: '5%', backgroundColor: '#A5D6A7', transform: [{ rotate: '30deg' }] }]} />
          <View style={[styles.confetti, { top: '70%', right: '25%', backgroundColor: '#F48FB1', transform: [{ rotate: '75deg' }] }]} />
          <View style={[styles.confetti, { top: '15%', right: '5%', backgroundColor: '#CE93D8', transform: [{ rotate: '45deg' }] }]} />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeTitle}>Welcome to the Movement, {displayName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Your profile is ready. You are now part of a community dedicated to growth and solidarity.
          </Text>
        </View>

        {/* Community Pill */}
        <View style={styles.communityPill}>
          <View style={styles.avatarsRow}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/11.jpg' }} style={styles.miniAvatar} />
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/42.jpg' }} style={[styles.miniAvatar, { marginLeft: -10 }]} />
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }} style={[styles.miniAvatar, { marginLeft: -10 }]} />
          </View>
          <Text style={styles.communityPillText}>+2,400 women joined this week</Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          
          {/* Profile Status Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>PROFILE STATUS</Text>
              <View style={styles.badgeVerified}>
                <Text style={styles.badgeVerifiedText}>Verified</Text>
              </View>
            </View>
            
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Setup Progress</Text>
              <Text style={styles.progressPercent}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Membership Identity Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>MEMBERSHIP IDENTITY</Text>
            <View style={styles.idRow}>
              <MaterialCommunityIcons name="badge-account-outline" size={24} color="#A00B29" />
              <Text style={styles.idText}>MPT-2024-8842</Text>
            </View>
            <Text style={styles.registeredText}>Registered on {currentDate}</Text>
          </View>

        </View>

      </View>

      {/* Footer Area */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push({ pathname: '/dashboard', params: { name, email } })}
        >
          <Text style={styles.primaryButtonText}>Go to My Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={styles.buttonIcon} />
        </TouchableOpacity>
        
        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Need help? </Text>
          <TouchableOpacity>
            <Text style={styles.contactText}>Contact support</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 10,
  },
  graphicContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  haloOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FDF0F3', // Very light pink halo
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8DCE2', // Darker pink halo
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A00B29', // Deep red core
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A00B29',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  communityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F1F8', // Very light purple background
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 30,
  },
  avatarsRow: {
    flexDirection: 'row',
    marginRight: 12,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  communityPillText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E5F0',
    padding: 18,
    marginBottom: 15,
    borderTopWidth: 2,
    borderTopColor: '#A00B29',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 11,
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  badgeVerified: {
    backgroundColor: '#80DEEA', // Cyan/teal from mockup
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeVerifiedText: {
    color: '#006064',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#A00B29',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    color: '#A00B29',
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0E5F0',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#A00B29',
    borderRadius: 3,
    width: '100%',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  idText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#A00B29',
    marginLeft: 10,
  },
  registeredText: {
    fontSize: 11,
    color: '#888',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 25 : 10,
  },
  primaryButton: {
    backgroundColor: '#A00B29',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  helpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
  },
  contactText: {
    fontSize: 12,
    color: '#D81B60',
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});
