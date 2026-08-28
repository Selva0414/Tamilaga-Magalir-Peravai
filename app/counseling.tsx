import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data
const MENTORSHIP_PROGRAMS = [
  { 
    id: '1', 
    title: 'Women in Tech Leadership', 
    description: 'A 12-week intensive mentorship focusing on negotiation, presence, and technical strategy for mid-level developers.',
    tag: 'New Cohort'
  },
  { 
    id: '2', 
    title: 'Legal Literacy', 
    description: 'Rights & Regulations Workshop.',
    icon: 'gavel',
    iconColor: '#9A0B2E',
    iconBg: '#FCE4EC'
  }
];

const TOP_MENTORS = [
  { id: '1', name: 'Priya Sharma', title: 'Financial Strategist', rating: '4.9', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80' },
  { id: '2', name: 'Leila Hassan', title: 'Legal Counsel', rating: '4.8', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80' },
  { id: '3', name: 'Maya Rao', title: 'Startup Mentor', rating: '5.0', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80' },
];

const RECOMMENDED = [
  { id: '1', name: 'Anjali Mehta', title: 'Mental Health Advocate', price: '₹500 / hr', image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Deepa K.', title: 'Full Stack Engineer', price: '₹1200 / hr', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export default function CounselingScreen() {
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
        
        <Text style={styles.headerTitle}>Counseling & Mentor</Text>
        
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
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Empowering Your{'\n'}Journey</Text>
          <Text style={styles.welcomeSubtitle}>
            Find the guidance you need from our expert mentors.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search mentors, skills, or topics..." 
            placeholderTextColor="#888"
          />
        </View>

        {/* Horizontal Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#E0F2F1', borderColor: '#B2DFDB' }]}>
            <Text style={[styles.pillText, { color: '#00897B' }]}>Career Growth</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#FCE4EC', borderColor: '#F8BBD0' }]}>
            <Text style={[styles.pillText, { color: '#D81B60' }]}>Legal Aid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pill, { backgroundColor: '#F3E5F5', borderColor: '#E1BEE7' }]}>
            <Text style={[styles.pillText, { color: '#8E24AA' }]}>Mental Health</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Main Appointment Card */}
        <View style={styles.appointmentCard}>
          <Ionicons name="calendar-outline" size={100} color="rgba(255,255,255,0.1)" style={styles.cardBgIcon} />
          
          <View style={styles.cardHeaderRow}>
            <View style={styles.confirmedPill}>
              <Text style={styles.confirmedPillText}>CONFIRMED</Text>
            </View>
            <Text style={styles.nextSessionText}>Next Session</Text>
          </View>
          
          <Text style={styles.appointmentTitle}>Strategic Career{'\n'}Planning</Text>
          
          <View style={styles.mentorRow}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }} style={styles.mentorAvatar} />
            <View>
              <Text style={styles.mentorName}>Dr. Aruna Singh</Text>
              <Text style={styles.mentorTitle}>Leadership Coach</Text>
            </View>
          </View>
          
          <View style={styles.appointmentFooter}>
            <View>
              <Text style={styles.startsInText}>Starts in</Text>
              <Text style={styles.countdownText}>02:14:42</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Meeting</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mentorship Programs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Mentorship Programs</Text>
        </View>

        <View style={styles.programCardLarge}>
          <View style={styles.newCohortPill}>
            <Text style={styles.newCohortPillText}>New Cohort</Text>
          </View>
          <Text style={styles.programTitle}>Women in Tech Leadership</Text>
          <Text style={styles.programDescription}>
            {MENTORSHIP_PROGRAMS[0].description}
          </Text>
          
          <View style={styles.programFooterRow}>
            <View style={styles.avatarsRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }} style={[styles.overlapAvatar, { zIndex: 3 }]} />
              <Image source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }} style={[styles.overlapAvatar, { marginLeft: -10, zIndex: 2 }]} />
              <View style={[styles.overlapAvatarMore, { marginLeft: -10, zIndex: 1 }]}>
                <Text style={styles.overlapAvatarMoreText}>+42</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewCategoryBtn}>
              <Text style={styles.viewCategoryText}>View Category</Text>
              <Ionicons name="arrow-forward" size={14} color="#D81B60" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.programCardSmall}>
          <View style={styles.smallProgramIconBg}>
            <MaterialCommunityIcons name="gavel" size={18} color="#9A0B2E" />
          </View>
          <View>
            <Text style={styles.smallProgramTitle}>Legal Literacy</Text>
            <Text style={styles.smallProgramSubtitle}>Rights & Regulations Workshop.</Text>
          </View>
        </View>

        {/* Top Mentors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Top Mentors</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>

        {TOP_MENTORS.map(mentor => (
          <View key={mentor.id} style={styles.mentorListCard}>
            <Image source={{ uri: mentor.image }} style={styles.mentorListAvatar} />
            <View style={styles.mentorListInfo}>
              <Text style={styles.mentorListTitle}>{mentor.name}</Text>
              <Text style={styles.mentorListSubtitle}>{mentor.title}</Text>
              <TouchableOpacity style={styles.bookSessionBtn}>
                <Text style={styles.bookSessionText}>Book Session</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#00897B" />
              <Text style={styles.ratingText}>{mentor.rating}</Text>
            </View>
          </View>
        ))}

        {/* Recommended for You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleSmall}>Recommended for You</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {RECOMMENDED.map(item => (
            <View key={item.id} style={styles.recommendedCard}>
              <Image source={{ uri: item.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedName}>{item.name}</Text>
                <Text style={styles.recommendedTitle}>{item.title}</Text>
                
                <View style={styles.recommendedFooter}>
                  <Text style={styles.recommendedPrice}>{item.price}</Text>
                  <TouchableOpacity style={styles.bookNowBtn}>
                    <Text style={styles.bookNowText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabChat}>
        <Ionicons name="chatbubbles" size={24} color="#FFF" />
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
  appointmentCard: {
    backgroundColor: '#7A0C22',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBgIcon: {
    position: 'absolute',
    right: -20,
    top: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmedPill: {
    backgroundColor: '#D81B60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  confirmedPillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  nextSessionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  appointmentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mentorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  mentorName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mentorTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startsInText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginBottom: 2,
  },
  countdownText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  joinButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#7A0C22',
    fontWeight: 'bold',
    fontSize: 12,
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
    color: '#9A0B2E',
  },
  viewAllText: {
    fontSize: 11,
    color: '#D81B60',
    fontWeight: '600',
  },
  programCardLarge: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 20,
    marginBottom: 15,
  },
  newCohortPill: {
    backgroundColor: '#E0F2F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  newCohortPillText: {
    color: '#00695C',
    fontSize: 9,
    fontWeight: 'bold',
  },
  programTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 10,
  },
  programDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 15,
  },
  programFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlapAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  overlapAvatarMore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlapAvatarMoreText: {
    fontSize: 8,
    color: '#6A1B9A',
    fontWeight: 'bold',
  },
  viewCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCategoryText: {
    fontSize: 11,
    color: '#D81B60',
    fontWeight: 'bold',
    marginRight: 4,
  },
  programCardSmall: {
    marginHorizontal: 20,
    backgroundColor: '#FDF7FC',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  smallProgramIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  smallProgramTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9A0B2E',
    marginBottom: 2,
  },
  smallProgramSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  mentorListCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  mentorListAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  mentorListInfo: {
    flex: 1,
  },
  mentorListTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 2,
  },
  mentorListSubtitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  bookSessionBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D81B60',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookSessionText: {
    color: '#D81B60',
    fontSize: 9,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00897B',
    marginLeft: 4,
  },
  recommendedScroll: {
    marginBottom: 20,
  },
  recommendedCard: {
    width: 220,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
    marginRight: 15,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  recommendedContent: {
    padding: 12,
  },
  recommendedName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 2,
  },
  recommendedTitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00897B',
  },
  bookNowBtn: {
    backgroundColor: '#9A0B2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bookNowText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fabChat: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F57C00', // Orange chat button
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
