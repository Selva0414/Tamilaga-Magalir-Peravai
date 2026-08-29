import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Custom Radio Button Component
const RadioButton = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
  <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
      {selected && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function TeachingApplyScreen() {
  const router = useRouter();
  const { name, email, jobTitle } = useLocalSearchParams<{ name?: string, email?: string, jobTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Form State
  const [teachingMode, setTeachingMode] = useState('Hybrid');

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Applying</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="#A00B29" />
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
        
        {/* Hero Banner */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
          {/* A gradient-like overlay to mimic the purple fade in the design */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Empower Through Knowledge</Text>
            <Text style={styles.heroSubtitle}>
              Join our mission to nurture educational growth and solidarity among women in our community. Your expertise can change lives.
            </Text>
          </View>
        </View>

        {/* Section: Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Aaradhana Sharma" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} placeholder="aaradhana.s@example.com" keyboardType="email-address" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+91 98765 43210" keyboardType="phone-pad" placeholderTextColor="#999" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Teaching Expertise */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="book-education-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Teaching Expertise</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject Specialization</Text>
            <View style={styles.dropdownInput}>
              <Text style={styles.dropdownText}>Business Management</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Years of Experience</Text>
            <TextInput style={styles.input} placeholder="e.g. 5" keyboardType="numeric" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Teaching Mode</Text>
            <View style={styles.radioGroupRow}>
              <RadioButton 
                label="Online" 
                selected={teachingMode === 'Online'} 
                onPress={() => setTeachingMode('Online')} 
              />
              <RadioButton 
                label="Hybrid" 
                selected={teachingMode === 'Hybrid'} 
                onPress={() => setTeachingMode('Hybrid')} 
              />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Educational Background */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Educational Background</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Highest Qualification</Text>
            <TextInput style={styles.input} placeholder="e.g. MBA in Human Resources" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Institution Name</Text>
            <TextInput style={styles.input} placeholder="e.g. University of Mumbai" placeholderTextColor="#999" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Certifications & Portfolio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Certifications & Portfolio</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Upload Certificates</Text>
            <View style={styles.uploadBox}>
              <Ionicons name="cloud-upload-outline" size={24} color="#A00B29" style={styles.uploadIcon} />
              <Text style={styles.uploadTitle}>Click to upload Certificates (PDF, JPG)</Text>
              <Text style={styles.uploadSubtitle}>Maximum size: 5MB</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Portfolio / Demo Link</Text>
            <TextInput style={styles.input} placeholder="https://youtube.com/your-demo-..." placeholderTextColor="#999" />
            <Text style={styles.helperText}>A link to an article or video showcasing your teaching or public speaking skills.</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Motivation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Motivation</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Why do you want to teach our community?</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Tell us about what and how you plan to contribute..." 
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Information Cards */}
        <View style={styles.infoCardsContainer}>
          
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Why Join Us?</Text>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Impact lives of 300+ women every month</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Flexible and rewarding environment</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Professional networking with top mentors</Text>
            </View>
          </View>

          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportText}>
              If you have inquiries about the application process or required documents, contact our support team.
            </Text>
            <View style={styles.supportEmailRow}>
              <Ionicons name="mail" size={14} color="#A00B29" style={{marginRight: 6}} />
              <Text style={styles.supportEmail}>support@tmpngo.org</Text>
            </View>
          </View>

        </View>

        {/* Footer Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => router.push({ pathname: '/success', params: { name, email } })}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
    paddingBottom: 40,
  },
  heroContainer: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#6A2E5B', // Fallback purple background
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(92, 28, 71, 0.65)', // Purple gradient-like overlay based on design
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
    lineHeight: 32,
  },
  heroSubtitle: {
    color: '#FFF',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E5F0',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A00B29',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF', 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 13,
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
  },
  dropdownText: {
    fontSize: 13,
    color: '#333',
  },
  radioGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: '#A00B29',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A00B29',
  },
  radioLabel: {
    fontSize: 13,
    color: '#333',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FDF7FB', // Very light pink tint
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  helperText: {
    fontSize: 10,
    color: '#666',
    marginTop: 6,
  },
  infoCardsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  benefitsCard: {
    backgroundColor: '#A00B29', // Dark red
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  benefitsTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    color: '#FFF',
    fontSize: 12,
  },
  supportCard: {
    backgroundColor: '#FCE4EC', // Light pink
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  supportTitle: {
    color: '#A00B29',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  supportText: {
    color: '#333',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  supportEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportEmail: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#A00B29',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
