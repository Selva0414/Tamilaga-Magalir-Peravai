import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data
const BADGES = [
  { id: '1', title: 'Active Volunteer', subtitle: '120 HOURS OF SERVICE', icon: 'hand-heart', color: '#D81B60', bgColor: '#FCE4EC', active: true },
  { id: '2', title: 'Skill Expert', subtitle: '5 COURSES COMPLETED', icon: 'star-circle', color: '#00897B', bgColor: '#E0F2F1', active: true },
  { id: '3', title: 'Community Pillar', subtitle: 'IN PROGRESS', icon: 'medal', color: '#BDBDBD', bgColor: '#F5F5F5', active: false },
  { id: '4', title: 'Fast Learner', subtitle: 'IN PROGRESS', icon: 'rocket', color: '#BDBDBD', bgColor: '#F5F5F5', active: false },
];

const CERTIFICATES = [
  {
    id: 'c1',
    title: 'Digital Literacy Workshop',
    issuedBy: 'Magalir Academy',
    date: 'Completed on Oct 15, 2023',
    tag: 'TRAINING',
    tagColor: '#00897B',
    tagBg: '#E0F2F1',
    image: 'https://images.unsplash.com/photo-1589330694653-efa637388cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Replace with a generic cert-like image
  },
  {
    id: 'c2',
    title: 'Community Leadership Program',
    issuedBy: 'Empowerment Trust',
    date: 'Completed on Jan 12, 2024',
    tag: 'NGO ACTIVITIES',
    tagColor: '#00897B',
    tagBg: '#E0F2F1',
    image: 'https://images.unsplash.com/photo-1589330694653-efa637388cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c3',
    title: 'Annual Women in Tech Summit',
    issuedBy: 'Magalir Peravai',
    date: 'Completed on Mar 05, 2024',
    tag: 'EVENTS',
    tagColor: '#00897B',
    tagBg: '#E0F2F1',
    image: 'https://images.unsplash.com/photo-1589330694653-efa637388cb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

export default function CertificatesScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [activeFilter, setActiveFilter] = useState('All');
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons name="menu" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Certificates</Text>
        
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
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>My Certificates</Text>
          <Text style={styles.pageSubtitle}>Celebrate your journey and professional growth.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search certificates..."
            placeholderTextColor="#888"
          />
        </View>

        {/* Achievement Badges */}
        <View style={styles.sectionHeader}>
          <Ionicons name="medal" size={18} color="#8B0000" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
        </View>
        <View style={styles.badgesGrid}>
          {BADGES.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <View style={[styles.badgeIconWrapper, { backgroundColor: badge.bgColor }]}>
                <MaterialCommunityIcons name={badge.icon as any} size={28} color={badge.color} />
              </View>
              <Text style={[styles.badgeTitle, !badge.active && styles.inactiveText]}>{badge.title}</Text>
              <Text style={styles.badgeSubtitle}>{badge.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['All', 'Training', 'Events', 'NGO Activities'].map(filter => (
            <TouchableOpacity 
              key={filter}
              style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Certificates List */}
        <View style={styles.certificatesList}>
          {CERTIFICATES.map((cert) => (
            <View key={cert.id} style={styles.certCard}>
              <Image source={{ uri: cert.image }} style={styles.certImage} resizeMode="cover" />
              
              <View style={styles.certContent}>
                <View style={[styles.certTag, { backgroundColor: cert.tagBg }]}>
                  <Text style={[styles.certTagText, { color: cert.tagColor }]}>{cert.tag}</Text>
                </View>

                <Text style={styles.certTitle}>{cert.title}</Text>
                
                <Text style={styles.issuedText}>
                  Issued by <Text style={styles.issuedHighlight}>{cert.issuedBy}</Text>
                </Text>
                
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={12} color="#666" />
                  <Text style={styles.dateText}>{cert.date}</Text>
                </View>

                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Unlock More Potential */}
        <View style={styles.unlockCard}>
          <Ionicons name="school" size={32} color="#A00B29" style={styles.unlockIcon} />
          <Text style={styles.unlockTitle}>Unlock More Potential</Text>
          <Text style={styles.unlockDesc}>
            Complete more modules and participate in community events to earn professional certifications.
          </Text>
          <TouchableOpacity style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse Training Programs</Text>
          </TouchableOpacity>
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
                        else if (item.label === 'Certificates') {
                          // Already here
                        }
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
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 48,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  inactiveText: {
    color: '#999',
  },
  badgeSubtitle: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    fontWeight: '600',
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 25,
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F0F2',
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterPill: {
    backgroundColor: '#A00B29',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
  },
  certificatesList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  certCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  certImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F9F9F9',
  },
  certContent: {
    padding: 20,
    alignItems: 'center',
  },
  certTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  certTagText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  certTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  issuedText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  issuedHighlight: {
    color: '#D81B60',
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A00B29',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '100%',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  unlockCard: {
    backgroundColor: '#F9F0F4',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  unlockIcon: {
    marginBottom: 10,
  },
  unlockTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  unlockDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 15,
  },
  browseButton: {
    borderWidth: 1,
    borderColor: '#A00B29',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  browseButtonText: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: 'bold',
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
