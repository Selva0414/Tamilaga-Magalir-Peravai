import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EventDetailsScreen() {
  const router = useRouter();
  const { name, email, eventTitle } = useLocalSearchParams<{ name?: string, email?: string, eventTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const displayTitle = eventTitle || 'Empowering Leadership: Women in Tech 2026';

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
            source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#A00B29' }]}>
                <Text style={styles.badgeText}>Workshop</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#00695C' }]}>
                <Text style={styles.badgeText}>Featured</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{displayTitle}</Text>
          </View>
        </View>

        {/* Organizer Section */}
        <View style={styles.organizerCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }} 
            style={styles.organizerAvatar} 
          />
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerLabel}>Organized by</Text>
            <Text style={styles.organizerName}>Dr. Anita Ramanathan</Text>
            <Text style={styles.organizerRole}>Director, Women's Empowerment Hub</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="information-circle-outline" size={18} color="#A00B29" style={{marginRight: 8}} />
            <Text style={styles.sectionTitle}>About the Event</Text>
          </View>
          <Text style={styles.aboutText}>
            Magalir Peravai proudly presents a transformative workshop designed for the next generation of women leaders. This session focuses on bridging the gap between technical expertise and strategic leadership, providing participants with the tools needed to navigate complex corporate landscapes.
          </Text>
          <Text style={styles.aboutText}>
            Our curriculum is built on the pillars of <Text style={{fontWeight: 'bold'}}>Strength, Growth, and Solidarity</Text>, ensuring that every attendee leaves not just with knowledge, but with a community of support. We will cover emotional intelligence, negotiation strategies, and personal branding in the digital age.
          </Text>
        </View>

        {/* What You'll Gain */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color="#A00B29" style={{marginRight: 8}} />
            <Text style={styles.sectionTitle}>What you'll gain</Text>
          </View>

          <View style={[styles.gainCard, { borderLeftColor: '#4A148C' }]}>
            <Ionicons name="school-outline" size={20} color="#4A148C" style={styles.gainIcon} />
            <View>
              <Text style={[styles.gainTitle, { color: '#4A148C' }]}>Certified Training</Text>
              <Text style={styles.gainDesc}>Earn a digital certificate recognized by global NGO partners.</Text>
            </View>
          </View>

          <View style={[styles.gainCard, { borderLeftColor: '#D81B60' }]}>
            <Ionicons name="people-outline" size={20} color="#D81B60" style={styles.gainIcon} />
            <View>
              <Text style={[styles.gainTitle, { color: '#D81B60' }]}>Networking</Text>
              <Text style={styles.gainDesc}>Connect with over 200+ influential women in your field.</Text>
            </View>
          </View>

          <View style={[styles.gainCard, { borderLeftColor: '#00695C' }]}>
            <MaterialCommunityIcons name="head-lightbulb-outline" size={20} color="#00695C" style={styles.gainIcon} />
            <View>
              <Text style={[styles.gainTitle, { color: '#00695C' }]}>1-on-1 Mentorship</Text>
              <Text style={styles.gainDesc}>Exclusive post-event access to industry mentors.</Text>
            </View>
          </View>

          <View style={[styles.gainCard, { borderLeftColor: '#6A1B9A' }]}>
            <Ionicons name="briefcase-outline" size={20} color="#6A1B9A" style={styles.gainIcon} />
            <View>
              <Text style={[styles.gainTitle, { color: '#6A1B9A' }]}>Career Resources</Text>
              <Text style={styles.gainDesc}>Access to our private job portal and resume builders.</Text>
            </View>
          </View>
        </View>

        {/* Info Card (Date, Venue, Map, Fee) */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={18} color="#4A148C" />
            </View>
            <View style={styles.infoTextCont}>
              <Text style={styles.infoTitle}>Date & Time</Text>
              <Text style={styles.infoSub}>Saturday, May 26, 2026</Text>
              <Text style={styles.infoSub}>09:00 AM - 04:00 PM IST</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={18} color="#A00B29" />
            </View>
            <View style={styles.infoTextCont}>
              <Text style={styles.infoTitle}>Venue</Text>
              <Text style={styles.infoSub}>Grand Convention Centre, Hall B</Text>
              <Text style={styles.infoSub}>Chennai, Tamil Nadu</Text>
            </View>
          </View>

          <View style={styles.mapContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }} 
              style={styles.mapImage} 
            />
            {/* Fake map overlay text just for effect matching mockup */}
            <View style={styles.mapOverlay}>
              <Text style={styles.mapTextBig}>Chennai</Text>
              <Text style={styles.mapTextTamil}>சென்னை</Text>
              <Text style={styles.mapTextSmall}>EGMORE</Text>
            </View>
          </View>

          <View style={styles.feeContainer}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Registration Fee</Text>
              <Text style={styles.feeValue}>₹1,200</Text>
            </View>
            <Text style={styles.feeNote}>*Includes lunch, kit, and certificates.</Text>
          </View>
        </View>

        {/* Urgency Banner */}
        <View style={styles.urgencyBanner}>
          <Ionicons name="timer-outline" size={16} color="#A00B29" style={{marginRight: 8}} />
          <Text style={styles.urgencyText}>Only 12 seats left! Register soon.</Text>
        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => router.push({ pathname: '/activity-apply', params: { name, email, activityTitle: displayTitle } })}
        >
          <Text style={styles.registerBtnText}>Register Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" style={{marginLeft: 8}} />
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
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 25,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 26,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FDF7FB',
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: -20, // Overlap the hero
    borderWidth: 1,
    borderColor: '#F0E5F0',
  },
  organizerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 10,
    color: '#666',
  },
  organizerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  organizerRole: {
    fontSize: 10,
    color: '#555',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  aboutText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  gainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  gainIcon: {
    marginRight: 12,
  },
  gainTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gainDesc: {
    fontSize: 10,
    color: '#666',
    paddingRight: 20,
  },
  infoCard: {
    backgroundColor: '#F3E5F5', // Light lavender
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 16,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextCont: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 11,
    color: '#555',
  },
  mapContainer: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 5,
    marginBottom: 15,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(178, 235, 242, 0.4)', // Light cyan tint
  },
  mapTextBig: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  mapTextTamil: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mapTextSmall: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    marginTop: 2,
  },
  feeContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E1BEE7',
    paddingTop: 15,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feeLabel: {
    fontSize: 12,
    color: '#555',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  feeNote: {
    fontSize: 9,
    color: '#888',
    textAlign: 'right',
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8DCE2', // Light red
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A00B29',
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
  registerBtn: {
    flexDirection: 'row',
    backgroundColor: '#A00B29', // Dark red
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
