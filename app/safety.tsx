import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SafetyScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  const MENU_ITEMS = [
    { family: 'Ionicons', icon: 'home-outline', label: 'Home' },
    { family: 'Ionicons', icon: 'school-outline', label: 'Training' },
    { family: 'Ionicons', icon: 'briefcase-outline', label: 'Jobs' },
    { family: 'MaterialCommunityIcons', icon: 'head-cog-outline', label: 'Counseling' },
    { family: 'MaterialCommunityIcons', icon: 'hand-heart-outline', label: 'NGO Activities' },
    { family: 'MaterialCommunityIcons', icon: 'account-group-outline', label: 'Community' },
    { family: 'Ionicons', icon: 'calendar-outline', label: 'Events' },
    { family: 'Ionicons', icon: 'mail-outline', label: 'Messages' },
    { family: 'Ionicons', icon: 'shield-outline', label: 'Safety Center' },
    { family: 'Ionicons', icon: 'notifications-outline', label: 'Notifications' },
    { family: 'MaterialCommunityIcons', icon: 'certificate-outline', label: 'Certificates' },
  ];

  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      if (callback) callback();
    });
  };

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
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons name="menu" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>SOS Support</Text>
        
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
        
        {/* Large SOS Button Area */}
        <View style={styles.sosContainer}>
          <TouchableOpacity style={styles.sosButton} activeOpacity={0.8} onPress={() => router.push({ pathname: '/active-emergency', params: { name, email } })}>
            <MaterialCommunityIcons name="podcast" size={48} color="#FFF" style={styles.sosIcon} />
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>

          <Text style={styles.sosTitle}>Emergency Assistance</Text>
          <Text style={styles.sosDescription}>
            Hold for 3 seconds to alert your trusted contacts and local authorities.
          </Text>

          <TouchableOpacity style={styles.emergencyCallLink} onPress={() => router.push({ pathname: '/emergency-directory', params: { name, email } })}>
            <Text style={styles.emergencyCallText}>Emergency Call</Text>
            <Ionicons name="arrow-forward" size={14} color="#A00B29" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Emergency Helplines */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emergency Helplines</Text>
          
          <View style={styles.helplineGrid}>
            <TouchableOpacity style={styles.helplineCard}>
              <Ionicons name="shield-checkmark" size={16} color="#A00B29" />
              <Text style={styles.helplineLabel}>Police</Text>
              <Text style={styles.helplineNumber}>100</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard}>
              <Ionicons name="woman" size={16} color="#A00B29" />
              <Text style={styles.helplineLabel}>Women Help</Text>
              <Text style={styles.helplineNumber}>1091</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard}>
              <FontAwesome5 name="ambulance" size={16} color="#A00B29" />
              <Text style={styles.helplineLabel}>Ambulance</Text>
              <Text style={styles.helplineNumber}>108</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineCard}>
              <Ionicons name="warning" size={16} color="#A00B29" />
              <Text style={styles.helplineLabel}>Domestic Abuse</Text>
              <Text style={styles.helplineNumber}>181</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Incident Reporting */}
        <View style={styles.incidentCard}>
          <Ionicons name="warning-outline" size={32} color="#FFF" style={styles.incidentIcon} />
          <Text style={styles.incidentTitle}>Incident Reporting</Text>
          <Text style={styles.incidentDescription}>
            Securely report harassment or safety concerns to the community leads and authorities.
          </Text>
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>File a Report Now</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips Carousel */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeaderRow}>
            <Text style={styles.sectionTitle}>Safety Tips</Text>
            <View style={styles.carouselControls}>
              <TouchableOpacity style={styles.carouselButton}>
                <Ionicons name="chevron-back" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.carouselButton}>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
                style={styles.tipImage} 
              />
              <View style={styles.quickReadBadge}>
                <Text style={styles.quickReadText}>QUICK READ</Text>
              </View>
            </View>
            <Text style={styles.tipTitle}>Digital Safety: Protecting Your Private Information</Text>
            <Text style={styles.tipDescription}>
              Learn how to manage location settings and social media privacy to stay safe in...
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Side Menu Modal */}
      <Modal visible={menuVisible} animationType="fade" transparent={true} onRequestClose={() => closeMenu()}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => closeMenu()}>
            <View style={styles.modalOverlayBackground} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sideMenuHeader}>
              <View style={styles.sideMenuLogoContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.sideMenuLogoImage} />
              </View>
              <Text style={styles.sideMenuTitle}>Tamilaga Magalir Peravai</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.menuItemsContainer}>
                {MENU_ITEMS.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.menuItem} 
                    activeOpacity={0.7} 
                    onPress={() => {
                      closeMenu(() => {
                        if (item.label === 'Home') router.push({ pathname: '/dashboard', params: { name, email } });
                        else if (item.label === 'Training') router.push({ pathname: '/training', params: { name, email } });
                        else if (item.label === 'Jobs') router.push({ pathname: '/jobs', params: { name, email } });
                        else if (item.label === 'Counseling') router.push({ pathname: '/counseling', params: { name, email } });
                        else if (item.label === 'NGO Activities') router.push({ pathname: '/ngo', params: { name, email } });
                        else if (item.label === 'Community') router.push({ pathname: '/community', params: { name, email } });
                        else if (item.label === 'Messages') router.push({ pathname: '/messages', params: { name, email } });
                        else if (item.label === 'Events') router.push({ pathname: '/events', params: { name, email } });
                        else if (item.label === 'Safety Center') router.push({ pathname: '/safety', params: { name, email } });
                        else if (item.label === 'Notifications') router.push({ pathname: '/notifications', params: { name, email } });
                        else if (item.label === 'Certificates') router.push({ pathname: '/certificates', params: { name, email } });
                      });
                    }}
                  >
                    {item.family === 'Ionicons' ? (
                      <Ionicons name={item.icon as any} size={20} color="#6B1D2F" style={styles.menuItemIcon} />
                    ) : (
                      <MaterialCommunityIcons name={item.icon as any} size={20} color="#6B1D2F" style={styles.menuItemIcon} />
                    )}
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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
  sosContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#A00B29', // Deep dark red
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A00B29',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 25,
  },
  sosIcon: {
    marginBottom: 5,
  },
  sosButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  sosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sosDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  emergencyCallLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyCallText: {
    color: '#A00B29',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 15,
  },
  helplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  helplineCard: {
    width: '48%',
    backgroundColor: '#F7F2F4', // Light pinkish-grey background
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  helplineLabel: {
    fontSize: 11,
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  helplineNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  incidentCard: {
    backgroundColor: '#333333', // Dark grey/black card
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
  },
  incidentIcon: {
    marginBottom: 15,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  incidentDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
    marginBottom: 20,
  },
  reportButton: {
    backgroundColor: '#6A0923', // Very dark red
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reportButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tipsSection: {
    paddingHorizontal: 20,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  carouselControls: {
    flexDirection: 'row',
    gap: 10,
  },
  carouselButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  tipCard: {
    marginBottom: 20,
  },
  tipImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 15,
  },
  tipImage: {
    width: '100%',
    height: '100%',
  },
  quickReadBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: '#00695C', // Teal color
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quickReadText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlayBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    width: '65%',
    maxWidth: 280,
    backgroundColor: '#FFF',
    height: '100%',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
    marginBottom: 10,
  },
  sideMenuLogoContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  sideMenuLogoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    transform: [{ translateY: 3 }],
  },
  sideMenuTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  menuItemsContainer: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 13,
    color: '#4A1525',
    fontWeight: '500',
  }
});
