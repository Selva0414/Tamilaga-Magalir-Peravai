import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data for Messages
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Anjali Sharma',
    time: '10:45 AM',
    message: 'The job placement workshop starts at 3 PM. Are you ready?',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    unread: true,
  },
  {
    id: '2',
    name: 'Priya Mani',
    time: 'Yesterday',
    message: 'Thank you for the legal aid resources! They were very helpful.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1b4dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    unread: false,
  },
  {
    id: '3',
    name: 'Meera Krishnan',
    time: '8:12 AM',
    message: 'I\'ve sent over the entrepreneurship application draft.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    unread: true,
  },
  {
    id: '4',
    name: 'Lakshmi Rao',
    time: 'Monday',
    message: 'Let\'s connect next week for the health awareness talk.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    unread: false,
  },
  {
    id: '5',
    name: 'Shanti Kumari',
    time: 'Aug 12',
    message: 'Great job on the community outreach program!',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    unread: false,
  },
];

export default function MessagesScreen() {
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
        
        <Text style={styles.headerTitle}>Messages</Text>
        
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

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search conversations..." 
          placeholderTextColor="#888"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {CONVERSATIONS.map(chat => (
          <TouchableOpacity 
            key={chat.id} 
            style={[styles.chatRow, chat.unread && styles.chatRowUnread]}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: chat.avatar }} 
                style={[styles.chatAvatar, chat.unread && styles.chatAvatarUnread]} 
              />
              {chat.unread && <View style={styles.onlineDot} />}
            </View>
            
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, chat.unread && styles.chatNameUnread]}>
                  {chat.name}
                </Text>
                <Text style={[styles.chatTime, chat.unread && styles.chatTimeUnread]}>
                  {chat.time}
                </Text>
              </View>
              <Text 
                style={[styles.chatMessage, chat.unread && styles.chatMessageUnread]} 
                numberOfLines={2}
              >
                {chat.message}
              </Text>
            </View>
            
            <View style={styles.chatRightAction}>
              {chat.unread && <View style={styles.unreadDotIndicator} />}
            </View>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 45,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C0C0C0',
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
  scrollContent: {
    paddingBottom: 20,
  },
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 8,
    borderRadius: 12,
  },
  chatRowUnread: {
    backgroundColor: '#FDF7FC', // Very light pink
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAEAEA',
  },
  chatAvatarUnread: {
    borderWidth: 2,
    borderColor: '#A00B29', // Dark red border for unread
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D81B60', // Red dot indicator
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  chatNameUnread: {
    fontWeight: 'bold',
    color: '#333',
  },
  chatTime: {
    fontSize: 11,
    color: '#888',
  },
  chatTimeUnread: {
    fontWeight: 'bold',
    color: '#A00B29',
  },
  chatMessage: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    paddingRight: 10,
  },
  chatMessageUnread: {
    color: '#444',
  },
  chatRightAction: {
    width: 15,
    alignItems: 'flex-end',
  },
  unreadDotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A00B29',
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
