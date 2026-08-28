import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, Platform, Modal, TouchableWithoutFeedback, ActivityIndicator, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data
const COURSES = [
  { id: '1', tag: 'TRENDING', title: 'Digital Marketing 101', category: 'Entrepreneurship', duration: '4 Weeks • Free', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', tag: 'POPULAR', title: 'Small Business Finance', category: 'Finance', duration: '2 Weeks • Free', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const JOBS = [
  { id: '1', title: 'Senior Project Manager', company: 'Tech Solutions Ltd', location: 'Chennai', icon: 'briefcase-outline' },
  { id: '2', title: 'Retail Floor Lead', company: 'Fashion Hub', location: 'Madurai', icon: 'storefront-outline' }
];

const MENTORS = [
  { id: '1', name: 'Dr. Anita', field: 'Health', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: '2', name: 'Priya R.', field: 'Legal Aid', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: '3', name: 'Meera K.', field: 'Business', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: '4', name: 'Lakshmi', field: 'Tech', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
];

export default function DashboardScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

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

  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  const displayName = name || 'Bharathy';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
            <Ionicons name="menu" size={24} color="#8B0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tamilaga Magalir Peravai</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push({ pathname: '/notifications', params: { name, email } })}>
              <Ionicons name="notifications-outline" size={22} color="#8B0000" />
            </TouchableOpacity>
            <TouchableOpacity>
              {isLoadingProfile ? (
                <ActivityIndicator size="small" color="#8B0000" style={styles.avatar} />
              ) : (
                <Image 
                  source={{ uri: profilePhotoUri }} 
                  style={styles.avatar} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.greetingText}>Good Morning, {displayName}!</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search programs, jobs, or mentors..." 
            placeholderTextColor="#888"
          />
        </View>

        {/* Quick Action Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push({ pathname: '/training', params: { name, email } })}>
            <Ionicons name="school-outline" size={32} color="#8B0000" />
            <Text style={styles.gridText}>Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {
            router.push({ pathname: '/jobs', params: { name, email } });
          }}>
            <Ionicons name="briefcase-outline" size={32} color="#8B0000" />
            <Text style={styles.gridText}>Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {
            router.push({ pathname: '/events', params: { name, email } });
          }}>
            <Ionicons name="calendar-outline" size={32} color="#8B0000" />
            <Text style={styles.gridText}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => {
            router.push({ pathname: '/ngo', params: { name, email } });
          }}>
            <MaterialCommunityIcons name="hand-heart-outline" size={32} color="#8B0000" />
            <Text style={styles.gridText}>NGO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {
            router.push({ pathname: '/community', params: { name, email } });
          }}>
            <MaterialCommunityIcons name="account-group-outline" size={32} color="#8B0000" />
            <Text style={styles.gridText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridItem, styles.sosItem]} onPress={() => {
            router.push({ pathname: '/safety', params: { name, email } });
          }}>
            <MaterialCommunityIcons name="asterisk" size={36} color="#FFF" />
            <Text style={[styles.gridText, { color: '#FFF' }]}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Courses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Courses</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {COURSES.map(course => (
            <View key={course.id} style={styles.courseCard}>
              <Image source={{ uri: course.image }} style={styles.courseImage} />
              <View style={styles.courseTag}>
                <Text style={styles.courseTagText}>{course.tag}</Text>
              </View>
              <View style={styles.courseContent}>
                <Text style={styles.courseCategory}>{course.category}</Text>
                <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                <View style={styles.courseMeta}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.courseDuration}>{course.duration}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Job Openings Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Job Openings</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>View all</Text></TouchableOpacity>
        </View>
        
        {JOBS.map(job => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
            <View style={styles.jobIconContainer}>
              <Ionicons name={job.icon as any} size={24} color="#5C3B6F" />
            </View>
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company} • {job.location}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))}

        {/* Meet Your Mentors Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitlePurple}>Meet Your Mentors</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {MENTORS.map(mentor => (
            <View key={mentor.id} style={styles.mentorCard}>
              <View style={styles.mentorImageWrapper}>
                <Image source={{ uri: mentor.image }} style={styles.mentorImage} />
              </View>
              <Text style={styles.mentorName}>{mentor.name}</Text>
              <Text style={styles.mentorField}>{mentor.field}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Upcoming Events Banner */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
        </View>
        
        <LinearGradient
          colors={['#8B0000', '#4A0E4E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventBanner}
        >
          <View style={styles.eventBannerContent}>
            <View style={{ flex: 1, zIndex: 2 }}>
              <Text style={styles.eventPreTitle}>LIVE WEBINAR</Text>
              <Text style={styles.eventTitle}>Empowering Rural Entrepreneurs</Text>
              <Text style={styles.eventDate}>Monday, 25th May • 4:00 PM</Text>
              <TouchableOpacity style={styles.eventButton}>
                <Text style={styles.eventButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="calendar-outline" size={70} color="rgba(255,255,255,0.15)" style={styles.eventIconBg} />
          </View>
        </LinearGradient>

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
                        if (item.label === 'Training') {
                          router.push({ pathname: '/training', params: { name, email } });
                        } else if (item.label === 'Jobs') {
                          router.push({ pathname: '/jobs', params: { name, email } });
                        } else if (item.label === 'Counseling') {
                          router.push({ pathname: '/counseling', params: { name, email } });
                        } else if (item.label === 'NGO Activities') {
                          router.push({ pathname: '/ngo', params: { name, email } });
                        } else if (item.label === 'Community') {
                          router.push({ pathname: '/community', params: { name, email } });
                        } else if (item.label === 'Messages') {
                          router.push({ pathname: '/messages', params: { name, email } });
                        } else if (item.label === 'Events') {
                          router.push({ pathname: '/events', params: { name, email } });
                        } else if (item.label === 'Safety Center') {
                          router.push({ pathname: '/safety', params: { name, email } });
                        } else if (item.label === 'Notifications') {
                          router.push({ pathname: '/notifications', params: { name, email } });
                        } else if (item.label === 'Certificates') {
                          router.push({ pathname: '/certificates', params: { name, email } });
                        } else if (item.label === 'Notifications') {
                          router.push({ pathname: '/notifications', params: { name, email } });
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
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B0000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginLeft: 8,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B0000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    marginBottom: 25,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  gridItem: {
    width: '31%',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: '#8B0000',
  },
  sosItem: {
    backgroundColor: '#FFD9D9',
    borderTopWidth: 0,
  },
  gridText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  sosText: {
    color: '#D80000',
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  sectionTitlePurple: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  seeAllText: {
    fontSize: 12,
    color: '#2E8B57',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  courseCard: {
    width: 220,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 110,
  },
  courseTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  courseTagText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#00838F',
  },
  courseContent: {
    padding: 12,
  },
  courseCategory: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseDuration: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#D11A2A',
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 11,
    color: '#666',
  },
  mentorCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  mentorImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    borderWidth: 2,
    borderColor: '#E6E6FA',
    marginBottom: 8,
  },
  mentorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  mentorName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  mentorField: {
    fontSize: 9,
    color: '#2E8B57',
    textAlign: 'center',
    marginTop: 2,
  },
  eventBanner: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  eventBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPreTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFB6C1',
    letterSpacing: 1,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 24,
  },
  eventDate: {
    fontSize: 12,
    color: '#E0E0E0',
    marginBottom: 15,
  },
  eventButton: {
    alignSelf: 'flex-start',
  },
  eventButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  eventIconBg: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
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
