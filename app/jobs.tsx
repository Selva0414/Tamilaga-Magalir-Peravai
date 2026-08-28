import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data
const TRENDING_JOBS = [
  { 
    id: '1', 
    title: 'Senior UX Designer', 
    company: 'TechSolutions Global', 
    location: 'Chennai (Remote)', 
    salary: '₹15L - 22L',
    tag: 'High Growth',
    icon: 'palette-swatch-outline',
    iconColor: '#9A0B2E',
    iconBg: '#FCE4EC'
  },
  { 
    id: '2', 
    title: 'Project Manager', 
    company: 'Synergy Corp', 
    location: 'Coimbatore', 
    salary: '₹12L - 18L',
    tag: 'Urgent',
    icon: 'briefcase-outline',
    iconColor: '#2E7D32',
    iconBg: '#E8F5E9'
  }
];

const OTHER_RECOMMENDED = [
  { id: '1', title: 'Content Strategist', company: 'GlobalWomenMedia', location: 'Chennai' },
  { id: '2', title: 'HR Business Partner', company: 'ScaleUp Solutions', location: 'Remote' },
  { id: '3', title: 'Customer Success Lead', company: 'Eco-Store Bharat', location: 'Bengaluru' },
];

export default function JobsScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  const displayName = name || 'Bharathy';
  
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
        
        <Text style={styles.headerTitle}>Job Dashboard</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="#8B0000" />
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
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Find Your Next{'\n'}Opportunity, {displayName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Empowering your career journey with curated roles for women.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#7B1FA2" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by job title, skill, or location..." 
            placeholderTextColor="#888"
          />
        </View>

        {/* Quick Access */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Quick Access</Text>
        </View>
        <View style={styles.quickAccessRow}>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.quickAccessIconBg, { backgroundColor: '#FCE4EC' }]}>
              <Ionicons name="school-outline" size={24} color="#D81B60" />
            </View>
            <Text style={styles.quickAccessText}>Internship</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.quickAccessIconBg, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#8E24AA" />
            </View>
            <Text style={styles.quickAccessText}>NGO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.quickAccessIconBg, { backgroundColor: '#E0F2F1' }]}>
              <MaterialCommunityIcons name="laptop" size={24} color="#00897B" />
            </View>
            <Text style={styles.quickAccessText}>Freelance</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Opportunities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Trending Opportunities</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All <Ionicons name="arrow-forward" size={12}/></Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {TRENDING_JOBS.map(job => (
            <View key={job.id} style={styles.trendingCard}>
              <View style={styles.trendingCardHeader}>
                <View style={[styles.trendingIconContainer, { backgroundColor: job.iconBg }]}>
                  <MaterialCommunityIcons name={job.icon as any} size={20} color={job.iconColor} />
                </View>
                <View style={styles.trendingPill}>
                  <Text style={styles.trendingPillText}>{job.tag}</Text>
                </View>
              </View>
              
              <Text style={styles.trendingJobTitle}>{job.title}</Text>
              <Text style={styles.trendingJobCompany}>{job.company}</Text>
              
              <View style={styles.trendingMetaRow}>
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text style={styles.trendingMetaText}>{job.location}</Text>
                <MaterialCommunityIcons name="cash" size={12} color="#666" style={{ marginLeft: 10 }} />
                <Text style={styles.trendingMetaText}>{job.salary}</Text>
              </View>

              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Recommended for You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Recommended for You</Text>
        </View>

        {/* Main Recommended Card */}
        <View style={styles.mainRecommendedCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.mainRecommendedImage} 
          />
          <View style={styles.mainRecommendedContent}>
            <View style={styles.mainRecommendedHeaderRow}>
              <Text style={styles.mainRecommendedTitle}>Lead Data Analyst</Text>
              <View style={styles.matchPill}>
                <Text style={styles.matchPillText}>98% Match</Text>
              </View>
            </View>
            <Text style={styles.mainRecommendedCompany}>FinTech Empowerment Group</Text>
            
            <Text style={styles.mainRecommendedDescription}>
              We are looking for a data-driven leader to spearhead our financial literacy initiatives. You will work directly with our Chennai-based tech hub.
            </Text>
            
            <View style={styles.tagRow}>
              <View style={styles.skillTag}><Text style={styles.skillTagText}>Python</Text></View>
              <View style={styles.skillTag}><Text style={styles.skillTagText}>SQL</Text></View>
              <View style={styles.skillTag}><Text style={styles.skillTagText}>Leadership</Text></View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.quickApplyButton}>
                <Text style={styles.quickApplyButtonText}>Quick Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Other Recommended Items */}
        {OTHER_RECOMMENDED.map(item => (
          <TouchableOpacity key={item.id} style={styles.otherRecommendedItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.otherRecommendedTitle}>{item.title}</Text>
              <Text style={styles.otherRecommendedCompany}>{item.company}</Text>
              <Text style={styles.otherRecommendedLocation}>{item.location}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B1D2F" />
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFF" />
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
    paddingBottom: 80, // Extra padding for FAB
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#9A0B2E',
    marginBottom: 8,
    lineHeight: 30,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7FC',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F3E5F5',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B1D2F',
  },
  viewAllText: {
    fontSize: 12,
    color: '#D80000',
    fontWeight: '600',
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  quickAccessItem: {
    alignItems: 'center',
  },
  quickAccessIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  trendingScroll: {
    marginBottom: 30,
  },
  trendingCard: {
    width: 260,
    backgroundColor: '#FDF7FC',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#F3E5F5',
  },
  trendingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingPill: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingPillText: {
    fontSize: 10,
    color: '#00695C',
    fontWeight: '600',
  },
  trendingJobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  trendingJobCompany: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
  },
  trendingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendingMetaText: {
    fontSize: 10,
    color: '#718096',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#9A0B2E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mainRecommendedCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderLeftWidth: 3,
    borderLeftColor: '#D81B60',
    overflow: 'hidden',
    marginBottom: 15,
  },
  mainRecommendedImage: {
    width: '100%',
    height: 140,
  },
  mainRecommendedContent: {
    padding: 15,
  },
  mainRecommendedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainRecommendedTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  matchPill: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  matchPillText: {
    fontSize: 10,
    color: '#00695C',
    fontWeight: 'bold',
  },
  mainRecommendedCompany: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 10,
  },
  mainRecommendedDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 18,
    marginBottom: 15,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  skillTagText: {
    fontSize: 10,
    color: '#6A1B9A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickApplyButton: {
    flex: 1,
    backgroundColor: '#9A0B2E',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quickApplyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9A0B2E',
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#9A0B2E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  otherRecommendedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 10,
  },
  otherRecommendedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A0B2E',
    marginBottom: 4,
  },
  otherRecommendedCompany: {
    fontSize: 11,
    color: '#4A5568',
    marginBottom: 2,
  },
  otherRecommendedLocation: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9A0B2E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
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
