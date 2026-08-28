import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data for Notifications
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'alert',
    title: 'Safety Alert',
    time: 'Just Now',
    description: 'High-speed winds expected. Please avoid coastal roads...',
    icon: 'alert-circle',
    iconBg: '#D81B60', // Red
    iconColor: '#FFF',
    unread: true,
    important: true,
  },
  {
    id: '2',
    type: 'job',
    title: 'Job Update',
    time: '2h ago',
    description: 'Application for "Support Staff" has been moved to the interview stage.',
    icon: 'briefcase',
    iconBg: '#5E35B1', // Purple
    iconColor: '#FFF',
    unread: true,
    important: false,
  },
  {
    id: '3',
    type: 'event',
    title: 'Event Reminder',
    time: '1h ago',
    description: '"Leadership Summit" starts in 60 minutes. Join the live stream via the dashboard.',
    icon: 'calendar',
    iconBg: '#FFEBEE', // Light Pink
    iconColor: '#8B0000',
    unread: false,
    important: false,
  },
  {
    id: '4',
    type: 'counseling',
    title: 'Counseling Reminder',
    time: '3h ago',
    description: 'Confirmed: Your session with Dr. Ananya is scheduled for tomorrow at 10 AM.',
    icon: 'medical-bag',
    iconBg: '#00695C', // Teal
    iconColor: '#FFF',
    unread: true,
    important: false,
  },
  {
    id: '5',
    type: 'community',
    title: 'Community Alert',
    time: '5h ago',
    description: 'Meera replied to your post: "Does anyone know about local tailoring hubs?"',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: false,
    important: false,
  },
  {
    id: '6',
    type: 'ngo',
    title: 'NGO Activity',
    time: 'Yesterday',
    description: 'New campaign launched: "Digital Literacy for Women". Enrollments are now open.',
    icon: 'bullhorn',
    iconBg: '#F3E5F5', // Light Purple
    iconColor: '#8E24AA',
    unread: true,
    important: false,
  },
  {
    id: '7',
    type: 'account',
    title: 'Account Update',
    time: '2d ago',
    description: 'Your profile verification was successful. Welcome to the Peravai community!',
    icon: 'account',
    iconBg: '#EAEAEA', // Light Grey
    iconColor: '#333',
    unread: false,
    important: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();
  
  const [activeTab, setActiveTab] = useState('All');
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

  const filteredNotifications = NOTIFICATIONS.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return n.unread;
    if (activeTab === 'Important') return n.important;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons name="menu" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notification</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
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
        
        {/* Top Actions Row */}
        <View style={styles.topActionsRow}>
          <Text style={styles.newNotificationsText}>4 New Notifications</Text>
          <View style={styles.actionLinks}>
            <TouchableOpacity><Text style={styles.actionText}>Clear All</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.actionText}>Mark as Read</Text></TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'All' && styles.activeTab]}
            onPress={() => setActiveTab('All')}
          >
            <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Unread' && styles.activeTab]}
            onPress={() => setActiveTab('Unread')}
          >
            <Text style={[styles.tabText, activeTab === 'Unread' && styles.activeTabText]}>Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Important' && styles.activeTab]}
            onPress={() => setActiveTab('Important')}
          >
            <Text style={[styles.tabText, activeTab === 'Important' && styles.activeTabText]}>Important</Text>
          </TouchableOpacity>
        </View>

        {/* Notification List */}
        <View style={styles.listContainer}>
          {filteredNotifications.map(notification => (
            <View 
              key={notification.id} 
              style={[
                styles.notificationCard, 
                notification.unread ? styles.notificationCardUnread : null,
                notification.important ? styles.notificationCardImportant : null
              ]}
            >
              <View style={styles.cardHeader}>
                {notification.avatar ? (
                  <Image source={{ uri: notification.avatar }} style={styles.notificationAvatar} />
                ) : (
                  <View style={[styles.notificationIconBg, { backgroundColor: notification.iconBg }]}>
                    <MaterialCommunityIcons name={notification.icon as any} size={20} color={notification.iconColor} />
                  </View>
                )}
                
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.notificationTitle, notification.important && styles.importantText]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>

              <Text style={[styles.notificationDescription, notification.important && styles.importantText]}>
                {notification.description}
              </Text>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.viewDetailsRow}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={12} color="#D81B60" />
                </TouchableOpacity>

                <View style={styles.cardFooterRight}>
                  <TouchableOpacity style={styles.trashButton}>
                    <Ionicons name="trash-outline" size={16} color="#888" />
                  </TouchableOpacity>
                  {notification.unread && <View style={styles.unreadDot} />}
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.loadOlderButton}>
          <Text style={styles.loadOlderText}>Load Older Notifications</Text>
        </TouchableOpacity>

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
                        else if (item.label === 'Notifications') {
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
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  newNotificationsText: {
    fontSize: 12,
    color: '#666',
  },
  actionLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  actionText: {
    fontSize: 12,
    color: '#D81B60',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    marginRight: 25,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#D81B60',
  },
  tabText: {
    fontSize: 13,
    color: '#888',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  notificationCardUnread: {
    backgroundColor: '#FDF7FC', // Light pink background for unread
  },
  notificationCardImportant: {
    borderLeftWidth: 4,
    borderLeftColor: '#D81B60',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notificationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  notificationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 11,
    color: '#888',
  },
  notificationDescription: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    marginBottom: 12,
    paddingLeft: 48, // Aligns with text content, past the icon
  },
  importantText: {
    color: '#D81B60', // Highlight important text in red
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 48,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 11,
    color: '#D81B60',
    fontWeight: 'bold',
    marginRight: 4,
  },
  cardFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trashButton: {
    padding: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D81B60',
  },
  loadOlderButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 30,
    padding: 10,
  },
  loadOlderText: {
    color: '#D81B60',
    fontSize: 12,
    fontWeight: '600',
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
