import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Dummy Data for Counseling Categories
const COUNSELING_CATEGORIES = [
  { id: '1', title: 'Career Counseling', description: 'Professional paths and planning strategies for your career.', mentors: '24 Mentors Available', icon: 'trending-up' },
  { id: '2', title: 'Education Guidance', description: 'Navigate higher education, scholarships, and specialization.', mentors: '18 Mentors Available', icon: 'school-outline' },
  { id: '3', title: 'Job Mentorship', description: 'Interview prep, resume building, and workplace success.', mentors: '32 Mentors Available', icon: 'briefcase-outline' },
  { id: '4', title: 'Entrepreneurship', description: 'Start your own business with expert financial and strategic advice.', mentors: '15 Mentors Available', icon: 'rocket-outline' },
  { id: '5', title: 'Legal Awareness', description: 'Understand your rights and legal protections in all life spheres.', mentors: '9 Mentors Available', icon: 'hammer-outline' },
  { id: '6', title: 'Women Safety', description: 'Personal safety strategies and community protection networks.', mentors: '21 Mentors Available', icon: 'shield-checkmark-outline' },
  { id: '7', title: 'Financial Guidance', description: 'Wealth management, saving, and investment education.', mentors: '12 Mentors Available', icon: 'wallet-outline' },
  { id: '8', title: 'NGO Support', description: 'Connect with non-profits for specific aid and advocacy.', mentors: '45 Organizations', icon: 'heart-half-outline' },
  { id: '9', title: 'Skill Development', description: 'Technical and soft skill training from industry experts.', mentors: '27 Mentors Available', icon: 'bulb-outline' },
  { id: '10', title: 'Personal Growth', description: 'Confidence building, mindfulness, and holistic wellness.', mentors: '14 Mentors Available', icon: 'leaf-outline' },
  { id: '11', title: 'Community Support', description: 'Peer networks and group discussions for shared experiences.', mentors: '100+ Members Active', icon: 'people-outline' },
];

export default function CounselingCategoriesScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons name="menu" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Counseling & Mentor</Text>
        
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
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>OUR SUPPORT ECOSYSTEM</Text>
          </View>
          
          <Text style={styles.pageTitle}>Find the</Text>
          <Text style={styles.pageTitle}>Guidance</Text>
          <Text style={styles.pageTitle}>to Shape Your</Text>
          <Text style={styles.pageTitle}>Future</Text>
          
          <Text style={styles.pageSubtitle}>
            Connect with expert mentors and specialists tailored to your journey. Whether it's career growth, legal safety, or personal empowerment, our dedicated counselors are here to support your rise.
          </Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
        </View>

        {/* Controls Section */}
        <View style={styles.controlsSection}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={16} color="#FFF" style={{marginRight: 6}} />
              <Text style={styles.filterButtonText}>Filter Categories</Text>
            </TouchableOpacity>
            
            <View style={styles.sortDropdown}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <Text style={styles.sortValue}>Most Popular</Text>
              <Ionicons name="chevron-down" size={14} color="#666" style={{marginLeft: 4}} />
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {COUNSELING_CATEGORIES.map((cat, index) => (
            <View key={cat.id}>
              <TouchableOpacity 
                style={styles.categoryCard}
                onPress={() => router.push({ pathname: '/booking-session', params: { name, email, category: cat.title } })}
              >
                <View style={styles.cardIconBox}>
                  <Ionicons name={cat.icon as any} size={22} color="#A00B29" />
                </View>
                
                <Text style={styles.cardTitle}>{cat.title}</Text>
                <Text style={styles.cardDescription}>{cat.description}</Text>
                
                <View style={styles.cardFooter}>
                  <View style={styles.mentorsBadge}>
                    <Text style={styles.mentorsBadgeText}>{cat.mentors}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#A00B29" />
                </View>
              </TouchableOpacity>
              
              {/* Divider between cards except the last one */}
              {index < COUNSELING_CATEGORIES.length - 1 && <View style={styles.cardDivider} />}
            </View>
          ))}
        </View>

        {/* Bottom Banner */}
        <View style={styles.bottomBanner}>
          <Text style={styles.bannerTitle}>Ready to make a difference?</Text>
          <Text style={styles.bannerText}>
            Join our network of expert mentors and help empower women across the nation. Your experience can be the catalyst for someone else's success.
          </Text>
          
          <View style={styles.bannerDivider} />
          
          <TouchableOpacity style={styles.bannerPrimaryBtn}>
            <Text style={styles.bannerPrimaryBtnText}>Apply as a Mentor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bannerSecondaryBtn}>
            <Text style={styles.bannerSecondaryBtnText}>Learn More</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="message-text-outline" size={24} color="#FFF" />
      </TouchableOpacity>

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
    paddingBottom: 80, // Extra padding for FAB
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  tagBadge: {
    backgroundColor: '#E0F2F1', // Light mint
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  tagText: {
    color: '#00897B', // Teal text
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#A00B29', // Dark red/pink
    lineHeight: 40,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#555',
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 20,
  },
  heroImageContainer: {
    marginHorizontal: 20,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#A00B29',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5', // Light purple
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  sortValue: {
    fontSize: 12,
    color: '#4A148C',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    paddingVertical: 20,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDEAEB', // Very light pink
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mentorsBadge: {
    backgroundColor: '#E0F2F1', // Light mint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mentorsBadgeText: {
    color: '#00897B', // Teal text
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#A00B29',
    opacity: 0.2,
  },
  bottomBanner: {
    backgroundColor: '#8E001C', // Very dark red
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bannerText: {
    color: '#F0E5F0',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  bannerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  bannerPrimaryBtn: {
    backgroundColor: '#4A000F', // Almost black-red
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12,
  },
  bannerPrimaryBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerSecondaryBtn: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
  },
  bannerSecondaryBtnText: {
    color: '#A00B29',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F57C00', // Orange/yellow
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F57C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlayBackground: {
    ...StyleSheet.absoluteFillObject,
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
