import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data
const FEATURED_COURSES = [
  { 
    id: '1', 
    category: 'MARKETING', 
    title: 'Digital Marketing for Beginners', 
    duration: '6 Hours', 
    rating: '4.9', 
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: '2', 
    category: 'FINANCE', 
    title: 'Financial Literacy & Wealth', 
    duration: '8 Hours', 
    rating: '4.7', 
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
  }
];

const POPULAR_TRAINING = [
  { id: '1', type: 'FREE', duration: '4 weeks duration', title: 'Full-Stack Web Development BootCamp', rating: '4.8', reviews: '1,200', icon: 'laptop' },
  { id: '2', type: 'FREE', duration: '3 weeks duration', title: 'Social Media Strategy for Non-Profits', rating: '4.8', reviews: '850', icon: 'bullhorn-outline' },
  { id: '3', type: 'FREE', duration: '2 weeks duration', title: 'Legal Literacy for Women Leaders', rating: '4.9', reviews: '1,150', icon: 'scale-balance' },
];

export default function TrainingScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  const displayName = name || 'Bharathy';
  
  const [menuVisible, setMenuVisible] = useState(false);

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
        
        <Text style={styles.headerTitle}>Skills & Training</Text>
        
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
          <Text style={styles.welcomeTitle}>Welcome back, {displayName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            You're making great progress. Ready to continue your journey?
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>In Progress</Text>
          </View>
          <Text style={styles.progressCourseTitle}>Entrepreneurship 101</Text>
          
          <View style={styles.progressInfoRow}>
            <Text style={styles.progressLabel}>Course Completion</Text>
            <Text style={styles.progressPercent}>65%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '65%' }]} />
          </View>

          <TouchableOpacity style={styles.resumeButton} activeOpacity={0.8}>
            <Text style={styles.resumeButtonText}>Resume Lesson</Text>
          </TouchableOpacity>
        </View>

        {/* Explore Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All ></Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <TouchableOpacity style={[styles.categoryPill, styles.categoryPillActive]}>
            <Text style={[styles.categoryPillText, styles.categoryPillTextActive]}>All Topics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>Coding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>Marketing</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Featured Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All ></Text></TouchableOpacity>
        </View>

        {FEATURED_COURSES.map(course => (
          <View key={course.id} style={styles.featuredCard}>
            <Image source={{ uri: course.image }} style={styles.featuredImage} />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredCategory}>{course.category}</Text>
              <Text style={styles.featuredTitle}>{course.title}</Text>
              
              <View style={styles.featuredMetaRow}>
                <View style={styles.featuredMetaItem}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.featuredMetaText}>{course.duration}</Text>
                </View>
                <View style={styles.featuredMetaItem}>
                  <Ionicons name="star" size={14} color="#D80000" />
                  <Text style={styles.featuredMetaText}>{course.rating}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Popular Training */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Training</Text>
        </View>

        {POPULAR_TRAINING.map(training => (
          <View key={training.id} style={styles.popularCard}>
            <View style={styles.popularIconContainer}>
              <MaterialCommunityIcons name={training.icon as any} size={28} color="#7B1FA2" />
            </View>
            
            <View style={styles.popularDetails}>
              <View style={styles.popularTopRow}>
                <View style={styles.freePill}>
                  <Text style={styles.freePillText}>{training.type}</Text>
                </View>
                <Text style={styles.popularDuration}>{training.duration}</Text>
              </View>
              
              <Text style={styles.popularTitle}>{training.title}</Text>
              
              <View style={styles.popularRatingRow}>
                <Ionicons name="star" size={12} color="#D80000" />
                <Text style={styles.popularRating}>{training.rating}</Text>
                <Text style={styles.popularReviews}> ({training.reviews} reviews)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={20} color="#7B1FA2" />
            </TouchableOpacity>
          </View>
        ))}

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
                        if (item.label === 'Home') router.back();
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: '#9A0B2E',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  progressPill: {
    backgroundColor: '#F5A623',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressCourseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  progressPercent: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 25,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F5A623',
    borderRadius: 3,
  },
  resumeButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  resumeButtonText: {
    color: '#9A0B2E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  viewAllText: {
    fontSize: 13,
    color: '#D80000',
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: 25,
  },
  categoryPill: {
    backgroundColor: '#F0F5F3',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryPillActive: {
    backgroundColor: '#9A0B2E',
  },
  categoryPillText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFF',
  },
  featuredCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredContent: {
    padding: 20,
  },
  featuredCategory: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4C8577',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  featuredMetaText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
    fontWeight: '500',
  },
  learnMoreButton: {
    borderWidth: 1,
    borderColor: '#D80000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#9A0B2E',
    fontSize: 14,
    fontWeight: '700',
  },
  popularCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  popularIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  popularDetails: {
    flex: 1,
  },
  popularTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  freePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  freePillText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: 'bold',
  },
  popularDuration: {
    fontSize: 11,
    color: '#718096',
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
    lineHeight: 20,
  },
  popularRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularRating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  popularReviews: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  bookmarkButton: {
    padding: 10,
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
