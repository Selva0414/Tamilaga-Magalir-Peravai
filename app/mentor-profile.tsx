import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MentorProfileScreen() {
  const router = useRouter();
  const { name, email, mentorName } = useLocalSearchParams<{ name?: string, email?: string, mentorName?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Selected state for scheduling
  const [selectedDate, setSelectedDate] = useState('6');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const MENU_ITEMS = [
    { family: 'Ionicons', icon: 'home-outline', label: 'Home' },
    { family: 'Ionicons', icon: 'school-outline', label: 'Training' },
    { family: 'Ionicons', icon: 'briefcase-outline', label: 'Jobs' },
    { family: 'MaterialCommunityIcons', icon: 'head-cog-outline', label: 'Counseling' },
    { family: 'MaterialCommunityIcons', icon: 'hand-heart-outline', label: 'NGO Activities' },
    { family: 'MaterialCommunityIcons', icon: 'account-group-outline', label: 'Community' },
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

  // Mock Calendar Dates for June 2026
  const week1 = [
    { day: 'M', date: '28', active: false },
    { day: 'T', date: '29', active: false },
    { day: 'W', date: '30', active: false },
    { day: 'T', date: '1', active: true },
    { day: 'F', date: '2', active: true },
    { day: 'S', date: '3', active: true },
    { day: 'S', date: '4', active: false },
  ];
  const week2 = [
    { day: 'M', date: '5', active: false },
    { day: 'T', date: '6', active: true }, // The selected one
    { day: 'W', date: '7', active: false },
    { day: 'T', date: '8', active: false },
    { day: 'F', date: '9', active: true },
    { day: 'S', date: '10', active: true },
    { day: 'S', date: '11', active: false },
  ];

  const timeSlots = ['10:00 AM', '02:30 PM', '04:00 PM'];

  // The displayed mentor name can either be passed via params or default to Dr. Meera
  const displayMentorName = mentorName || 'Dr. Meera Vasudevan';

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
        
        {/* Profile Card Section */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }} 
              style={styles.profileImage} 
            />
            <View style={styles.onlineBadge}>
              <Ionicons name="chatbubble" size={12} color="#FFF" />
            </View>
          </View>

          <Text style={styles.mentorName}>{displayMentorName}</Text>
          
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#00695C" />
            <Text style={styles.verifiedText}>Verified Mentor</Text>
          </View>

          <Text style={styles.specialization}>Entrepreneurship Specialist</Text>
          
          <View style={styles.experienceRow}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.experienceText}>15+ Years Experience</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#A00B29" />
              <Text style={styles.statText}>4.9 (210 Reviews)</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={14} color="#A00B29" />
              <Text style={styles.statText}>Chennai, India</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.sendMessageBtn}
            onPress={() => router.push({ pathname: '/mentor-chat', params: { name, email, mentorName: displayMentorName } })}
          >
            <Ionicons name="mail" size={16} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.sendMessageText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Mentor</Text>
          <Text style={styles.aboutText}>
            With over 15 years in the micro-finance and small-scale business sector, Dr. Meera has empowered more than 500 women entrepreneurs to launch and scale their ventures. Her approach combines strategic business planning with a deep focus on community solidarity.
          </Text>
          <Text style={styles.aboutText}>
            She specializes in navigating government schemes, securing initial funding, and building resilient supply chains for local products. Her mission is to turn every woman's skill into a sustainable livelihood.
          </Text>

          <Text style={styles.subSectionTitle}>LANGUAGES KNOWN</Text>
          <View style={styles.languagesRow}>
            <View style={styles.languagePill}><Text style={styles.languagePillText}>Tamil</Text></View>
            <View style={styles.languagePill}><Text style={styles.languagePillText}>English</Text></View>
            <View style={styles.languagePill}><Text style={styles.languagePillText}>Hindi</Text></View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Ratings & Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
            <TouchableOpacity style={styles.readAllRow}>
              <Text style={styles.readAllText}>Read All (210)</Text>
              <Ionicons name="arrow-forward" size={12} color="#D81B60" />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingOverviewBox}>
            <View style={styles.ratingScoreCol}>
              <Text style={styles.ratingBigNumber}>4.9</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color="#D81B60" />)}
              </View>
            </View>
            <View style={styles.ratingBarsCol}>
              {/* Dummy bars to mimic the UI */}
              <View style={styles.barRow}><View style={[styles.barFill, {width: '95%'}]} /></View>
              <View style={styles.barRow}><View style={[styles.barFill, {width: '10%', backgroundColor: '#E0E0E0'}]} /></View>
              <View style={styles.barRow}><View style={[styles.barFill, {width: '5%', backgroundColor: '#E0E0E0'}]} /></View>
            </View>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewerHeader}>
              <View style={styles.reviewerAvatar}>
                <Text style={styles.reviewerInitials}>R</Text>
              </View>
              <View>
                <Text style={styles.reviewerName}>Rajalakshmi S.</Text>
                <Text style={styles.reviewerTime}>1 week ago</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>
              "Dr. Meera helped me transition my home baking business into a commercial kitchen. Her insights on local permits were invaluable. Highly recommended!"
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Availability / Scheduling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          
          <View style={styles.calendarContainer}>
            <View style={styles.daysHeaderRow}>
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <Text key={i} style={styles.dayHeaderText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.datesRow}>
              {week1.map((item, i) => (
                <View key={`w1-${i}`} style={styles.dateCell}>
                  <View style={[styles.dateBubble, item.active && styles.dateBubbleActive]}>
                    <Text style={[styles.dateText, item.active && styles.dateTextActive, !item.active && {color: '#CCC'}]}>
                      {item.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.datesRow}>
              {week2.map((item, i) => (
                <TouchableOpacity 
                  key={`w2-${i}`} 
                  style={styles.dateCell}
                  onPress={() => { if(item.active || item.date === '6') setSelectedDate(item.date); }}
                >
                  <View style={[
                    styles.dateBubble, 
                    item.active && styles.dateBubbleActive,
                    selectedDate === item.date && styles.dateBubbleSelected
                  ]}>
                    <Text style={[
                      styles.dateText, 
                      item.active && styles.dateTextActive,
                      selectedDate === item.date && styles.dateTextSelected,
                      !item.active && item.date !== '6' && {color: '#CCC'}
                    ]}>
                      {item.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.selectedSlotText}>Selected Slot: June {selectedDate}, 2026</Text>
          
          <View style={styles.timeSlotsRow}>
            {timeSlots.map((time, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.timeSlotBtn, selectedTime === time && styles.timeSlotBtnSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoAlertBox}>
            <Ionicons name="information-circle-outline" size={20} color="#FFF" style={{marginRight: 10}} />
            <Text style={styles.infoAlertText}>Next available slot is tomorrow at 10:00 AM. Fast to fill, book soon!</Text>
          </View>

        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity 
          style={styles.bookSessionBtn}
          onPress={() => router.push({ pathname: '/booking-session', params: { name, email, mentorName } })}
        >
          <Text style={styles.bookSessionBtnText}>Book Session</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 100, // Extra padding for sticky footer + FAB
  },
  profileHeaderSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20, // Squircle look
    backgroundColor: '#EAEAEA',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#D81B60', // Hot pink badge
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  mentorName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4A148C', // Dark purple name
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1', // Light mint green
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  verifiedText: {
    color: '#00695C',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  specialization: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 8,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  experienceText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  sendMessageBtn: {
    backgroundColor: '#A00B29',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '60%',
  },
  sendMessageText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E5F0',
    marginHorizontal: 20,
    marginVertical: 25,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 10,
  },
  languagesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  languagePill: {
    backgroundColor: '#FCE4EC', // Very light pink
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languagePillText: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  readAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readAllText: {
    fontSize: 12,
    color: '#D81B60',
    marginRight: 4,
  },
  ratingOverviewBox: {
    backgroundColor: '#FDF7FB', // Light purple tint
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingScoreCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAEAEA',
  },
  ratingBigNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  ratingBarsCol: {
    flex: 1.5,
    paddingLeft: 20,
    justifyContent: 'center',
    gap: 6,
  },
  barRow: {
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    width: '100%',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#D81B60',
    borderRadius: 3,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0E5F0',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1BEE7', // Light purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewerInitials: {
    color: '#4A148C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  reviewerTime: {
    fontSize: 10,
    color: '#888',
  },
  reviewText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  dayHeaderText: {
    fontSize: 11,
    color: '#888',
    width: 30,
    textAlign: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateCell: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBubbleActive: {
    backgroundColor: '#FCE4EC', // Light pink for active slots
  },
  dateBubbleSelected: {
    backgroundColor: '#A00B29', // Dark red for selected
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  dateTextActive: {
    color: '#D81B60',
    fontWeight: '600',
  },
  dateTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  selectedSlotText: {
    fontSize: 12,
    color: '#D81B60',
    marginBottom: 10,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  timeSlotBtn: {
    borderWidth: 1,
    borderColor: '#D81B60',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  timeSlotBtnSelected: {
    backgroundColor: '#A00B29',
    borderColor: '#A00B29',
  },
  timeSlotText: {
    color: '#D81B60',
    fontSize: 12,
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: '#FFF',
  },
  infoAlertBox: {
    backgroundColor: '#A00B29',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoAlertText: {
    color: '#FFF',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'android' ? 25 : 30,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  bookSessionBtn: {
    backgroundColor: '#4A000F', // Very dark red/black
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookSessionBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 90, // Above the sticky footer
    right: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
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
