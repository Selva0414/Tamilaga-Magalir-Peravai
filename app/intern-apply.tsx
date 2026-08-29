import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function InternApplyScreen() {
  const router = useRouter();
  const { name, email, jobTitle } = useLocalSearchParams<{ name?: string, email?: string, jobTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Form State
  const [willingToTravel, setWillingToTravel] = useState(false);
  const [skills, setSkills] = useState(['Project Planning', 'Stakeholder Management', 'Budgeting']);
  const [newSkill, setNewSkill] = useState('');

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

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

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
            <Text style={styles.heroTitle}>Join the Movement</Text>
            <Text style={styles.heroSubtitle}>Be part of the Tamilaga Magalir Peravai</Text>
          </View>
        </View>

        {/* Section: Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Priyadharshini Ravi" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} placeholder="priya@example.com" keyboardType="email-address" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
                <Ionicons name="chevron-down" size={14} color="#666" style={{marginLeft: 4}} />
              </View>
              <TextInput style={[styles.input, styles.phoneInput]} placeholder="9876543210" keyboardType="phone-pad" placeholderTextColor="#999" />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Professional Background */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Professional Background</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Highest Qualification</Text>
            <View style={styles.dropdownInput}>
              <Text style={styles.dropdownText}>Post Graduate</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Years of Experience</Text>
            <TextInput style={styles.input} placeholder="e.g. 5" keyboardType="numeric" placeholderTextColor="#999" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillPill}>
                  <Text style={styles.skillPillText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Ionicons name="close" size={14} color="#2E7D32" style={{marginLeft: 4}} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addSkillRow}>
              <TextInput 
                style={[styles.input, styles.addSkillInput]} 
                placeholder="Add a skill..." 
                placeholderTextColor="#999"
                value={newSkill}
                onChangeText={setNewSkill}
              />
              <TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
                <Text style={styles.addSkillButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Work Samples & Portfolio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Work Samples & Portfolio</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Portfolio Link</Text>
            <TextInput style={styles.input} placeholder="https://linkedin.com/in/username" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Link (Optional)</Text>
            <TextInput style={styles.input} placeholder="GitHub, Behance, or Drive Link" placeholderTextColor="#999" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Resume Upload */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Resume Upload</Text>
          </View>
          
          <View style={styles.uploadBox}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="cloud-upload-outline" size={24} color="#A00B29" />
            </View>
            <Text style={styles.uploadTitle}>Drag & drop your resume here</Text>
            <Text style={styles.uploadSubtitle}>Supported formats: PDF, DOCX | Max 5MB</Text>
            <TouchableOpacity>
              <Text style={styles.browseLink}>Or browse files</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Availability & Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Availability & Preferences</Text>
          </View>
          
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.inputLabel}>Willingness to Travel</Text>
              <Text style={styles.switchDesc}>Are you open to travel for work?</Text>
            </View>
            <Switch 
              trackColor={{ false: '#E0E0E0', true: '#A00B29' }}
              thumbColor={'#FFF'}
              onValueChange={setWillingToTravel}
              value={willingToTravel}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Available Start Date</Text>
            <TextInput style={styles.input} placeholder="mm/dd/yyyy" placeholderTextColor="#999" />
          </View>
        </View>

        {/* Footer actions */}
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By submitting, you agree to our Terms of Professional Conduct.
          </Text>
          
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
    height: 120,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#F0F0F0',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E5F0',
    marginHorizontal: 20,
    marginVertical: 15,
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
    fontWeight: '500',
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
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7FB',
    borderWidth: 1,
    borderColor: '#F0E5F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 13,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 8,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Pale green
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillPillText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  addSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addSkillInput: {
    flex: 1,
  },
  addSkillButton: {
    backgroundColor: '#5A0B1E',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSkillButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#F0E5F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FDF7FB',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#666',
    marginBottom: 12,
  },
  browseLink: {
    fontSize: 13,
    color: '#A00B29',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchDesc: {
    fontSize: 11,
    color: '#888',
    marginTop: -4,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
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
