import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data for NGO Activities
const UPCOMING_ACTIVITIES = [
  {
    id: '1',
    title: 'Financial Literacy Workshop',
    description: 'Learn essential banking, savings, and investment strategies for financial independence.',
    date: 'May 24, 2026 • 10:00 AM',
    location: 'Community Center, Madurai',
    icon: 'cash-register',
    iconColor: '#3F51B5',
    iconBg: '#E8EAF6',
    tag: 'Empowerment',
    tagColor: '#00BFA5',
    tagBg: '#E0F2F1'
  },
  {
    id: '2',
    title: 'Digital Marketing Essentials',
    description: 'Master social media and online sales to grow your small home-based business.',
    date: 'May 28, 2026 • 02:00 PM',
    location: 'Online - Zoom Meeting',
    icon: 'cellphone-link',
    iconColor: '#00897B',
    iconBg: '#E0F2F1',
    tag: 'Technology',
    tagColor: '#00BFA5',
    tagBg: '#E0F2F1'
  },
  {
    id: '3',
    title: 'Legal Rights Awareness',
    description: 'An informative session on property rights and workplace legal protections for women.',
    date: 'May 25, 2026 • 11:00 AM',
    location: 'District Court Hall, Trichy',
    icon: 'gavel',
    iconColor: '#03A9F4',
    iconBg: '#E1F5FE',
    tag: 'Legal Aid',
    tagColor: '#00BFA5',
    tagBg: '#E0F2F1'
  }
];

export default function NGOScreen() {
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
        
        <Text style={styles.headerTitle}>NGO Activities</Text>
        
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
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for programs or NGOs..." 
            placeholderTextColor="#888"
          />
        </View>

        {/* Featured Event Card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredPill}>
            <Text style={styles.featuredPillText}>FEATURED EVENT</Text>
          </View>
          <Text style={styles.featuredTitle}>Mega Health Camp{'\n'}for Women</Text>
          <Text style={styles.featuredDescription}>
            Free comprehensive health checkups, nutritional guidance, and expert consultations.
          </Text>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register Now</Text>
            <Ionicons name="arrow-forward" size={12} color="#8B0000" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Explore by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Explore by Category</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#8B0000', borderColor: '#8B0000' }]}>
            <Text style={[styles.pillText, { color: '#FFF' }]}>All Programs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#F0F0F0', borderColor: '#EAEAEA' }]}>
            <Text style={[styles.pillText, { color: '#333' }]}>Skill Development</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#F0F0F0', borderColor: '#EAEAEA' }]}>
            <Text style={[styles.pillText, { color: '#333' }]}>Health Care</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Upcoming Activities */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleSmall}>Upcoming Activities</Text>
          <TouchableOpacity style={styles.viewCalendarRow}>
            <Text style={styles.viewCalendarText}>View Calendar</Text>
            <Ionicons name="calendar-outline" size={12} color="#8B0000" />
          </TouchableOpacity>
        </View>

        {UPCOMING_ACTIVITIES.map(activity => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityCardHeader}>
              <View style={[styles.activityIconBg, { backgroundColor: activity.iconBg }]}>
                <MaterialCommunityIcons name={activity.icon as any} size={20} color={activity.iconColor} />
              </View>
              <View style={[styles.activityTagPill, { backgroundColor: activity.tagBg }]}>
                <Text style={[styles.activityTagPillText, { color: activity.tagColor }]}>{activity.tag}</Text>
              </View>
            </View>

            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDescription}>{activity.description}</Text>

            <View style={styles.activityMetaRow}>
              <Ionicons name="calendar-outline" size={12} color="#666" />
              <Text style={styles.activityMetaText}>{activity.date}</Text>
            </View>
            <View style={styles.activityMetaRow}>
              <Ionicons name="location-outline" size={12} color="#666" />
              <Text style={styles.activityMetaText}>{activity.location}</Text>
            </View>

            <TouchableOpacity 
              style={styles.joinActivityButton}
              onPress={() => router.push({ pathname: '/ngo-activity-details', params: { name, email, activityTitle: activity.title } })}
            >
              <Text style={styles.joinActivityText}>Join Activity</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Stay Informed Newsletter Block */}
        <View style={styles.newsletterCard}>
          <Text style={styles.newsletterTitle}>Stay Informed</Text>
          <Text style={styles.newsletterDescription}>
            Subscribe to our weekly newsletter to get the latest updates on NGO programs and welfare schemes directly in your inbox.
          </Text>
          
          <View style={styles.emailInputRow}>
            <TextInput 
              style={styles.emailInput} 
              placeholder="Enter your email" 
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.newsletterIllustrationContainer}>
            <Image 
              source={{ uri: 'https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.png' }} 
              style={styles.newsletterImage} 
              resizeMode="contain"
            />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
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
  featuredCard: {
    backgroundColor: '#8B0000', // Dark Red
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  featuredPill: {
    backgroundColor: '#D81B60',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  featuredPillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  featuredDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  registerButtonText: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  viewCalendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCalendarText: {
    fontSize: 11,
    color: '#8B0000',
    fontWeight: '600',
    marginRight: 4,
  },
  pillsScroll: {
    marginBottom: 25,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 20,
    marginBottom: 15,
  },
  activityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityTagPillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 15,
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityMetaText: {
    fontSize: 11,
    color: '#555',
    marginLeft: 8,
  },
  joinActivityButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  joinActivityText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  newsletterCard: {
    marginHorizontal: 20,
    backgroundColor: '#F3E5F5', // Light Purple
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 8,
  },
  newsletterDescription: {
    fontSize: 11,
    color: '#D81B60',
    lineHeight: 16,
    marginBottom: 20,
  },
  emailInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  subscribeButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  newsletterIllustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  newsletterImage: {
    width: '80%',
    height: '80%',
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
