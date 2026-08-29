import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, CheckBox } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

// A simple custom checkbox component since React Native doesn't have a built-in one across platforms
const CustomCheckBox = ({ label, value, onValueChange }: { label: string, value: boolean, onValueChange: (v: boolean) => void }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)} activeOpacity={0.7}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Ionicons name="checkmark" size={12} color="#FFF" />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function NgoApplyScreen() {
  const router = useRouter();
  const { name, email, jobTitle } = useLocalSearchParams<{ name?: string, email?: string, jobTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Form State
  const [areasOfInterest, setAreasOfInterest] = useState({
    womensRights: true,
    education: false,
    environment: false,
    healthcare: false,
  });
  
  const [selectedSkills, setSelectedSkills] = useState(['Fundraising']);
  const availableSkills = ['Public Speaking', 'Community Organizing', 'Fundraising', 'Counseling', 'First Aid'];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
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
            source={{ uri: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Empower Change with Us</Text>
            <Text style={styles.heroSubtitle}>
              Your journey starts here. Apply to join our network of changemakers and contribute to meaningful community growth.
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
            <TextInput style={styles.input} placeholder="Bharathy" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} placeholder="bharathy@example.com" keyboardType="email-address" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+919876543210" keyboardType="phone-pad" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Primary Location</Text>
            <View style={styles.dropdownInput}>
              <Text style={styles.dropdownText}>Chennai, Tamil Nadu</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Community Experience */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-group" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Community Experience</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Previous NGO Work</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe your roles and responsibilities in previous NGO engagements..." 
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Volunteer History</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="List significant volunteer projects you have contributed to..." 
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Areas of Interest</Text>
            <CustomCheckBox label="Women's Rights" value={areasOfInterest.womensRights} onValueChange={(v) => setAreasOfInterest({...areasOfInterest, womensRights: v})} />
            <CustomCheckBox label="Education" value={areasOfInterest.education} onValueChange={(v) => setAreasOfInterest({...areasOfInterest, education: v})} />
            <CustomCheckBox label="Environment" value={areasOfInterest.environment} onValueChange={(v) => setAreasOfInterest({...areasOfInterest, environment: v})} />
            <CustomCheckBox label="Healthcare" value={areasOfInterest.healthcare} onValueChange={(v) => setAreasOfInterest({...areasOfInterest, healthcare: v})} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Core Skills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Core Skills</Text>
          </View>
          
          <View style={styles.skillsContainer}>
            {availableSkills.map((skill) => (
              <TouchableOpacity 
                key={skill} 
                style={[styles.skillPill, selectedSkills.includes(skill) && styles.skillPillActive]}
                onPress={() => toggleSkill(skill)}
              >
                <Text style={[styles.skillPillText, selectedSkills.includes(skill) && styles.skillPillTextActive]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Solidarity Card */}
          <View style={styles.solidarityCard}>
            <MaterialCommunityIcons name="handshake-outline" size={32} color="#FFF" style={styles.solidarityIcon} />
            <Text style={styles.solidarityTitle}>Solidarity & Growth</Text>
            <Text style={styles.solidaritySubtitle}>Join 5000+ members making a daily impact</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Statement of Purpose */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Statement of Purpose</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Why do you want to join this initiative?</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Tell us about your motivation, your values, and what you hope to achieve with us..." 
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Document Upload */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-attach" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Document Upload</Text>
          </View>
          
          {/* Upload Box 1 */}
          <View style={styles.uploadBox}>
            <View style={styles.uploadIconCircle}>
              <MaterialCommunityIcons name="certificate-outline" size={24} color="#A00B29" />
            </View>
            <Text style={styles.uploadTitle}>Volunteer Certificates</Text>
            <Text style={styles.uploadSubtitle}>PDF, JPG (Max 2MB)</Text>
            <TouchableOpacity style={styles.selectFileBtn}>
              <Text style={styles.selectFileBtnText}>Select File</Text>
            </TouchableOpacity>
          </View>
          
          {/* Upload Box 2 */}
          <View style={styles.uploadBox}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="document-outline" size={24} color="#A00B29" />
            </View>
            <Text style={styles.uploadTitle}>NGO Recommendation Letters</Text>
            <Text style={styles.uploadSubtitle}>PDF only (Max 10MB)</Text>
            <TouchableOpacity style={styles.selectFileBtn}>
              <Text style={styles.selectFileBtnText}>Select File</Text>
            </TouchableOpacity>
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
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#F0F0F0',
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    backgroundColor: '#FDF7FB', // Light purple/pink tint
    borderWidth: 1,
    borderColor: '#F0E5F0',
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
    backgroundColor: '#FDF7FB',
    borderWidth: 1,
    borderColor: '#F0E5F0',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
  },
  dropdownText: {
    fontSize: 13,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FDF7FB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#5C8DF6', // Blue as seen in screenshot
    borderColor: '#5C8DF6',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  skillPill: {
    backgroundColor: '#FDEAEB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skillPillActive: {
    backgroundColor: '#8B0000',
  },
  skillPillText: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: '500',
  },
  skillPillTextActive: {
    color: '#FFF',
  },
  solidarityCard: {
    backgroundColor: '#A00B29',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  solidarityIcon: {
    marginBottom: 10,
  },
  solidarityTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  solidaritySubtitle: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.9,
    textAlign: 'center',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    marginBottom: 15,
  },
  selectFileBtn: {
    borderWidth: 1,
    borderColor: '#A00B29',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectFileBtnText: {
    color: '#A00B29',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
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
