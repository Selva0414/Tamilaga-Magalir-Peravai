import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NgoActivityDetailsScreen() {
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="star-circle-outline" size={14} color="#00695C" style={{marginRight: 4}} />
              <Text style={styles.badgeText}>Empowerment Series</Text>
            </View>
            <Text style={styles.heroTitle}>{displayTitle}</Text>
            <View style={styles.orgRow}>
              <Ionicons name="business-outline" size={14} color="#FFF" />
              <Text style={styles.orgName}>Care Foundation</Text>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={20} color="#A00B29" />
            <Text style={styles.infoCardLabel}>DATE</Text>
            <Text style={styles.infoCardValue}>May 24, 2026</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color="#A00B29" />
            <Text style={styles.infoCardLabel}>TIME</Text>
            <Text style={styles.infoCardValue}>10:00 AM IST</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={20} color="#A00B29" />
            <Text style={styles.infoCardLabel}>VENUE</Text>
            <Text style={styles.infoCardValue}>ONLINE (ZOOM)</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={20} color="#A00B29" />
            <Text style={styles.infoCardLabel}>PARTICIPANTS</Text>
            <Text style={styles.infoCardValue}>128 JOINED</Text>
          </View>
        </View>

        {/* About Program */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Program</Text>
          <View style={styles.aboutContentBox}>
            <View style={styles.aboutAccentLine} />
            <Text style={styles.aboutText}>
              This comprehensive workshop is designed specifically for women looking to take control of their financial future. Organized by the Care Foundation, we bridge the gap between financial concepts and practical everyday management. Whether you're a budding entrepreneur, a professional, or a homemaker, this session provides the tools to build sustainable wealth and financial independence.
            </Text>
          </View>
        </View>

        {/* What You'll Gain */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Gain</Text>
          
          <View style={styles.gainItem}>
            <View style={styles.gainIconBox}>
              <Ionicons name="wallet-outline" size={20} color="#00695C" />
            </View>
            <View style={styles.gainTextContent}>
              <Text style={styles.gainItemTitle}>Smart Budgeting</Text>
              <Text style={styles.gainItemDesc}>Master the art of tracking expenses and building an effective saving habit.</Text>
            </View>
          </View>

          <View style={styles.gainItem}>
            <View style={styles.gainIconBox}>
              <Ionicons name="trending-up" size={20} color="#00695C" />
            </View>
            <View style={styles.gainTextContent}>
              <Text style={styles.gainItemTitle}>Investment Basics</Text>
              <Text style={styles.gainItemDesc}>Understand mutual funds, gold, and equity markets from a beginner's perspective.</Text>
            </View>
          </View>

          <View style={styles.gainItem}>
            <View style={styles.gainIconBox}>
              <Ionicons name="document-text-outline" size={20} color="#00695C" />
            </View>
            <View style={styles.gainTextContent}>
              <Text style={styles.gainItemTitle}>Legal Rights</Text>
              <Text style={styles.gainItemDesc}>Get informed about inheritance laws and joint financial asset protections.</Text>
            </View>
          </View>

          <View style={styles.gainItem}>
            <View style={styles.gainIconBox}>
              <Ionicons name="people-outline" size={20} color="#00695C" />
            </View>
            <View style={styles.gainTextContent}>
              <Text style={styles.gainItemTitle}>Peer Support</Text>
              <Text style={styles.gainItemDesc}>Connect with a community of women on the same journey toward solidarity.</Text>
            </View>
          </View>
        </View>

        {/* Speaker Info */}
        <View style={styles.speakerCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }} 
            style={styles.speakerAvatar} 
          />
          <Text style={styles.speakerRole}>MAIN SPEAKER</Text>
          <Text style={styles.speakerName}>Dr. Priya Subramanian</Text>
          <Text style={styles.speakerDesc}>
            Senior Financial Consultant at Care Foundation. 15+ years of experience in women's economic empowerment.
          </Text>
        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity 
          style={styles.joinBtn}
          onPress={() => router.push({ pathname: '/activity-apply', params: { name, email, activityTitle: displayTitle } })}
        >
          <Text style={styles.joinBtnText}>Join Program</Text>
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
  scrollContent: {
    paddingBottom: 100, // Room for sticky footer
  },
  heroContainer: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark gradient effect
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#80DEEA', // Cyan/Mint green
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  badgeText: {
    color: '#006064',
    fontSize: 11,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF', // Make it pop on the dark overlay (the original image has a red title but on a faded white background. Let's stick to white for readability on an image, or replicate the faded background). 
    // Wait, the mockup shows the title as red text on a faded white gradient at the bottom of the image. Let's adjust.
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  orgName: {
    color: '#FFF',
    fontSize: 13,
    marginLeft: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -20, // Pull up to overlap the hero if needed, but let's just use top margin
    paddingTop: 10,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#FDF7FB', // Light pink background
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0E5F0',
  },
  infoCardLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A00B29', // Dark red
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 15,
  },
  aboutContentBox: {
    flexDirection: 'row',
  },
  aboutAccentLine: {
    width: 3,
    backgroundColor: '#A00B29',
    marginRight: 15,
    borderRadius: 2,
  },
  aboutText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
    lineHeight: 22,
  },
  gainItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  gainIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1', // Mint background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gainTextContent: {
    flex: 1,
  },
  gainItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 4,
  },
  gainItemDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  speakerCard: {
    backgroundColor: '#FDF7FB', // Light purple/pink tint
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  speakerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  speakerRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A00B29',
    letterSpacing: 1,
    marginBottom: 4,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 10,
  },
  speakerDesc: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'android' ? 25 : 30,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  joinBtn: {
    backgroundColor: '#4A000F', // Very dark red
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
