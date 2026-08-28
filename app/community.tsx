import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Dummy Data for Community Posts
const POSTS = [
  {
    id: '1',
    author: 'Priya Sunder',
    time: '2 hours ago',
    tag: 'Skill Sharing',
    tagColor: '#00897B',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    content: 'Excited to share that I just completed the advanced tailoring workshop! Looking to collaborate with anyone interested in sustainable fashion patterns. Let\'s grow together! 🧵✨',
    image: 'https://images.unsplash.com/photo-1556228578-8d89b6acd8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: 124,
    comments: 18,
    postType: 'standard'
  },
  {
    id: '2',
    author: 'District NGO Council',
    time: '5 hours ago',
    tag: 'Job Update',
    tagColor: '#8B0000',
    iconBg: '#00695C',
    content: '',
    likes: 45,
    comments: 3,
    postType: 'job',
    jobDetails: {
      title: 'Senior Accountant Needed',
      location: 'Chennai Central',
      experience: '3+ Years',
      description: 'Join our team and help manage financial health for local women cooperatives.'
    }
  },
  {
    id: '3',
    author: 'Lakshmi Amma',
    time: 'Yesterday',
    tag: 'Success Story',
    tagColor: '#00897B',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    content: '"Two years ago, I started with just one sewing machine. Today, our group has ten! Thank you Magalir Peravai for the legal aid and entrepreneurship training that made this possible."',
    likes: 892,
    comments: 56,
    postType: 'quote'
  }
];

export default function CommunityScreen() {
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

  const renderPost = (post: any) => {
    return (
      <View key={post.id} style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          {post.avatar ? (
            <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
          ) : (
            <View style={[styles.postIconBg, { backgroundColor: post.iconBg }]}>
              <MaterialCommunityIcons name="briefcase-outline" size={24} color="#FFF" />
            </View>
          )}
          <View style={styles.postHeaderInfo}>
            <Text style={styles.postAuthor}>{post.author}</Text>
            <Text style={styles.postTime}>
              {post.time} • <Text style={{ color: post.tagColor, fontWeight: 'bold' }}>{post.tag}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.postOptionsBtn}>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        {post.postType === 'standard' && (
          <View>
            <Text style={styles.postContentText}>{post.content}</Text>
            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}
          </View>
        )}

        {post.postType === 'quote' && (
          <View>
            <Text style={[styles.postContentText, styles.quoteText]}>{post.content}</Text>
          </View>
        )}

        {post.postType === 'job' && post.jobDetails && (
          <View style={styles.jobBox}>
            <Text style={styles.jobTitle}>{post.jobDetails.title}</Text>
            <Text style={styles.jobMeta}>Location: {post.jobDetails.location} | Experience: {post.jobDetails.experience}</Text>
            <Text style={styles.jobDescription}>{post.jobDetails.description}</Text>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Post Footer */}
        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name={post.id === '3' ? "heart" : "heart-outline"} size={20} color={post.id === '3' ? "#5A67D8" : "#666"} />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={18} color="#666" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="share-variant" size={20} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
          <Ionicons name="menu" size={24} color="#8B0000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Community</Text>
        
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
        
        {/* Top Link */}
        <TouchableOpacity style={styles.topLinkContainer}>
          <Text style={styles.topLinkText}>Groups and Category <Ionicons name="arrow-forward" size={12} /></Text>
        </TouchableOpacity>

        <View style={styles.postsContainer}>
          {POSTS.map(post => renderPost(post))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="pencil-outline" size={24} color="#FFF" />
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
    backgroundColor: '#F7F7F7', // Light gray background for community feed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
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
    paddingBottom: 80, 
  },
  topLinkContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  topLinkText: {
    color: '#8B0000',
    fontWeight: '600',
    fontSize: 13,
  },
  postsContainer: {
    paddingHorizontal: 15,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 2,
    borderTopColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EAEAEA',
  },
  postIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postHeaderInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  postTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  postOptionsBtn: {
    padding: 5,
  },
  postContentText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteText: {
    fontStyle: 'italic',
    color: '#555',
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  jobBox: {
    backgroundColor: '#FDF7FC', // Light Pink
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 8,
  },
  jobMeta: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 15,
    lineHeight: 18,
  },
  applyButton: {
    backgroundColor: '#6A0923', // Dark Red
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 11,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A00B29', // Dark red
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
