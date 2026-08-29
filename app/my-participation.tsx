import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MyParticipationScreen() {
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
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Participation</Text>
          <Text style={styles.pageSubtitle}>
            Track your progress and manage your upcoming community sessions.
          </Text>
        </View>

        {/* Card 1: Approved */}
        <View style={[styles.card, styles.cardApproved]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeApproved}>
              <Ionicons name="checkmark-circle" size={12} color="#00695C" style={{marginRight: 4}} />
              <Text style={styles.badgeTextApproved}>Approved</Text>
            </View>
            <Text style={styles.refText}>Ref: MP-9821</Text>
          </View>
          
          <Text style={styles.cardTitle}>Financial Literacy Workshop</Text>
          <Text style={styles.cardDesc}>
            Master the basics of micro-financing, savings, and investment strategies for...
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#A00B29" />
            <Text style={styles.infoText}>May 24, 2026</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#A00B29" />
            <Text style={styles.infoText}>10:00 AM - 12:30 PM</Text>
          </View>

          <View style={styles.cardActionRow}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push({ pathname: '/participation-details', params: { name, email, activityTitle: 'Financial Literacy Workshop' } })}
            >
              <Text style={styles.primaryBtnText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>View Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Pending */}
        <View style={[styles.card, styles.cardPending]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgePending}>
              <Ionicons name="time-outline" size={12} color="#666" style={{marginRight: 4}} />
              <Text style={styles.badgeTextPending}>Registration Pending</Text>
            </View>
            <Text style={styles.refText}>Ref: MP-9043</Text>
          </View>
          
          <Text style={styles.cardTitle}>Digital Skills for Entrepreneurs</Text>
          <Text style={styles.cardDesc}>
            Learn how to leverage social media and e-commerce platforms to grow your...
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#A00B29" />
            <Text style={styles.infoText}>Nov 02, 2026</Text>
          </View>

          <View style={styles.disabledBtn}>
            <Text style={styles.disabledBtnText}>Awaiting Confirmation</Text>
          </View>
        </View>

        {/* Card 3: Active Now */}
        <View style={[styles.card, styles.cardActive]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeActive}>
              <View style={styles.dotActive} />
              <Text style={styles.badgeTextActive}>Active Now</Text>
            </View>
            <Text style={styles.refText}>Ref: MP-7712</Text>
          </View>
          
          <Text style={styles.cardTitle}>Leadership Empowerment Summit</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelLeft}>Session 4 of 6</Text>
              <Text style={styles.progressLabelRight}>65% Progress</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.liveBtn}>
            <Ionicons name="videocam-outline" size={18} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.liveBtnText}>Join Live Session</Text>
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
  pageHeader: {
    marginTop: 10,
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardApproved: {
    borderColor: '#F0E5F0',
    borderLeftWidth: 4,
    borderLeftColor: '#A00B29',
  },
  cardPending: {
    borderColor: '#EAEAEA',
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0', // Purple for pending
  },
  cardActive: {
    borderColor: '#E0F2F1', // Light mint border
    borderLeftWidth: 4,
    borderLeftColor: '#00695C', // Teal for active
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeApproved: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B2EBF2', // Cyan light
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextApproved: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#006064',
  },
  badgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5', // Light purple
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextPending: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  badgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#80DEEA', // Mint green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#006064',
    marginRight: 6,
  },
  badgeTextActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#006064',
  },
  refText: {
    fontSize: 10,
    color: '#999',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#A00B29',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#FDF7FB',
    borderWidth: 1,
    borderColor: '#A00B29',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledBtn: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  disabledBtnText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F3E5F5', // Light track
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A00B29', // Dark red fill
    borderRadius: 3,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabelLeft: {
    fontSize: 10,
    color: '#666',
  },
  progressLabelRight: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  liveBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A000F', // Very dark red/black
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  }
});
