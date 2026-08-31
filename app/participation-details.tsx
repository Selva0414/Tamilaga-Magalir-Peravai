import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ParticipationDetailsScreen() {
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
        
        <View style={styles.topSection}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#FFF" style={{marginRight: 4}} />
            <Text style={styles.statusBadgeText}>ACTIVE</Text>
          </View>
          
          <Text style={styles.pageTitle}>{displayTitle}</Text>
          
          <View style={styles.hostRow}>
            <Ionicons name="business" size={14} color="#888" />
            <Text style={styles.hostText}>Hosted by <Text style={styles.hostBold}>Care Foundation</Text></Text>
          </View>

          <TouchableOpacity style={styles.joinLiveBtn}>
            <Ionicons name="play-circle-outline" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.joinLiveBtnText}>Join Live Session</Text>
          </TouchableOpacity>
        </View>

        {/* Progress & Grid */}
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressLabel}>Program</Text>
            <Text style={styles.progressLabel}>Progress</Text>
          </View>
          <Text style={styles.progressValue}>65% Completed</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={20} color="#A00B29" />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>DATE</Text>
              <Text style={styles.infoCardValue}>Oct 24, 2026</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color="#A00B29" />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>TIME</Text>
              <Text style={styles.infoCardValue}>10:00 AM</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={20} color="#A00B29" />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>VENUE</Text>
              <Text style={styles.infoCardValue}>Online (Zoom)</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="people-outline" size={20} color="#A00B29" />
            <View style={styles.infoCardText}>
              <Text style={styles.infoCardLabel}>PARTICIPANTS</Text>
              <Text style={styles.infoCardValue}>124 Enrolled</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* What You'll Learn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          
          <View style={styles.learnItem}>
            <Ionicons name="star" size={20} color="#A00B29" style={styles.learnIcon} />
            <View style={styles.learnTextCont}>
              <Text style={styles.learnTitle}>Foundation of Wealth Building</Text>
              <Text style={styles.learnDesc}>Understanding compounding interest and inflation impact on long-term savings.</Text>
            </View>
          </View>

          <View style={styles.learnItem}>
            <Ionicons name="star" size={20} color="#A00B29" style={styles.learnIcon} />
            <View style={styles.learnTextCont}>
              <Text style={styles.learnTitle}>Diversification Strategies</Text>
              <Text style={styles.learnDesc}>How to balance your portfolio between gold, mutual funds, and fixed deposits.</Text>
            </View>
          </View>

          <View style={styles.learnItem}>
            <Ionicons name="star" size={20} color="#A00B29" style={styles.learnIcon} />
            <View style={styles.learnTextCont}>
              <Text style={styles.learnTitle}>Emergency Fund Planning</Text>
              <Text style={styles.learnDesc}>Creating a safety net for your family during unexpected economic shifts.</Text>
            </View>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          
          <TouchableOpacity style={styles.resourceRow}>
            <View style={styles.resourceLeft}>
              <Ionicons name="document-text-outline" size={18} color="#A00B29" />
              <Text style={styles.resourceName}>Session_Guide.pdf</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceRow}>
            <View style={styles.resourceLeft}>
              <Ionicons name="book-outline" size={18} color="#A00B29" />
              <Text style={styles.resourceName}>Pre-read_Materials</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceRow}>
            <View style={styles.resourceLeft}>
              <Ionicons name="grid-outline" size={18} color="#A00B29" />
              <Text style={styles.resourceName}>Budgeting_Template</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Manage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>
          
          <TouchableOpacity style={styles.manageBtnRed}>
            <Ionicons name="calendar-outline" size={16} color="#A00B29" style={{marginRight: 8}} />
            <Text style={styles.manageBtnTextRed}>Add to Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.manageBtnGrey}>
            <Ionicons name="calendar-clear-outline" size={16} color="#666" style={{marginRight: 8}} />
            <Text style={styles.manageBtnTextGrey}>Reschedule / Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Certified Partner */}
        <View style={styles.partnerCard}>
          <MaterialCommunityIcons name="shield-check" size={60} color="rgba(255,255,255,0.1)" style={styles.partnerBgIcon} />
          <Text style={styles.partnerPreTitle}>CERTIFIED PARTNER</Text>
          <Text style={styles.partnerName}>Care Foundation</Text>
          <Text style={styles.partnerDesc}>
            Supporting women's financial independence since 1998.
          </Text>
          <TouchableOpacity style={styles.partnerBtn}>
            <Text style={styles.partnerBtnText}>View NGO Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Hero Image */}
        <View style={styles.bottomHero}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.bottomHeroImg} 
          />
          <View style={styles.bottomHeroOverlay}>
            <Text style={styles.bottomHeroTitle}>Next Live Session starts in 2 hours</Text>
            <Text style={styles.bottomHeroSub}>Ensure your internet connection is stable.</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00695C', // Dark teal
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    marginBottom: 8,
    lineHeight: 28,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  hostText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  hostBold: {
    fontWeight: 'bold',
    color: '#A00B29',
  },
  joinLiveBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A000F', // Very dark red/black
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  joinLiveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  progressValue: {
    fontSize: 12,
    color: '#A00B29',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#FDF7FB', // Light pink background
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0E5F0',
  },
  infoCardText: {
    marginLeft: 10,
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 9,
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 2,
    backgroundColor: '#F0E5F0',
    marginVertical: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 15,
  },
  learnItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  learnIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  learnTextCont: {
    flex: 1,
  },
  learnTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  learnDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  resourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  manageBtnRed: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A00B29',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  manageBtnTextRed: {
    color: '#A00B29',
    fontSize: 13,
    fontWeight: 'bold',
  },
  manageBtnGrey: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FDF7FB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageBtnTextGrey: {
    color: '#666',
    fontSize: 13,
    fontWeight: 'bold',
  },
  partnerCard: {
    backgroundColor: '#A00B29', // Deep red
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  partnerBgIcon: {
    position: 'absolute',
    right: -10,
    top: 20,
  },
  partnerPreTitle: {
    fontSize: 9,
    color: '#F8DCE2',
    letterSpacing: 1,
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  partnerDesc: {
    fontSize: 11,
    color: '#F8DCE2',
    lineHeight: 16,
    marginBottom: 15,
    maxWidth: '80%',
  },
  partnerBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  partnerBtnText: {
    color: '#A00B29',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bottomHero: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  bottomHeroImg: {
    width: '100%',
    height: '100%',
  },
  bottomHeroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  bottomHeroTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bottomHeroSub: {
    color: '#CCC',
    fontSize: 11,
  }
});
