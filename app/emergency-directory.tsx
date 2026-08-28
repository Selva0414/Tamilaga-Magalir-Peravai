import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Dummy Data for Directory
const EMERGENCY_CONTACTS = [
  {
    id: '1',
    title: "Women's Helpline",
    description: "Get immediate help and counseling assistance for women's safety issues.",
    number: '1091',
  },
  {
    id: '2',
    title: "Police",
    description: "Contact local police stations for general emergencies and reporting.",
    number: '100',
  },
  {
    id: '3',
    title: "Ambulance / Medical Emergency",
    description: "Request urgent medical assistance and emergency services.",
    number: '108',
  },
  {
    id: '4',
    title: "Domestic Violence Hotline",
    description: "Reach out for immediate intervention and support for domestic violence victims.",
    number: '181 / 1091',
  }
];

export default function EmergencyDirectoryScreen() {
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
          <Ionicons name="arrow-back" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Emergency Directory</Text>
        
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
        
        {/* Intro Text */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Emergency Directory</Text>
          <Text style={styles.introDesc}>
            Access our emergency directory below for immediate response and support services. You will receive immediate alerts.
          </Text>
        </View>

        {/* Directory List */}
        <View style={styles.listContainer}>
          {EMERGENCY_CONTACTS.map((contact, index) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.cardHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                {index === 0 && <Ionicons name="female-outline" size={16} color="#666" style={{ marginLeft: 'auto' }} />}
              </View>
              
              <Text style={styles.contactDesc}>{contact.description}</Text>
              
              <Text style={styles.contactNumber}>{contact.number}</Text>
              
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.callButtonText}>Call Now</Text>
              </TouchableOpacity>
              
              {index < EMERGENCY_CONTACTS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Safety Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsTitle}>Safety Tips Section</Text>
            <Text style={styles.tipsSubtitle}>Tips</Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipRow}>
              <Text style={styles.tipBullet}>1.</Text>
              <Text style={styles.tipText}>Stay aware of your surroundings at all times.</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipBullet}>2.</Text>
              <Text style={styles.tipText}>Keep emergency contacts updated on your phone.</Text>
            </View>
            <View style={styles.tipRow}>
              <Text style={styles.tipBullet}>3.</Text>
              <Text style={styles.tipText}>Let someone know your whereabouts.</Text>
            </View>
          </View>
          
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.tipsImage} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Light grey background like in the screenshot
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
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8B0000',
    marginBottom: 15,
  },
  introDesc: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  contactCard: {
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberBadgeText: {
    fontSize: 12,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  contactDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  contactNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8B0000',
    marginBottom: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A0B1E', // Very dark red
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
  },
  tipsCard: {
    backgroundColor: '#FFF0F5', // Light pink background
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  tipsHeader: {
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  tipsSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  tipsList: {
    marginBottom: 20,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 10,
  },
  tipBullet: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  tipsImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  }
});
