import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RuralApplyScreen() {
  const router = useRouter();
  const { name, email, jobTitle } = useLocalSearchParams<{ name?: string, email?: string, jobTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Form State
  const [ownsVehicle, setOwnsVehicle] = useState(false);
  const [canTravel, setCanTravel] = useState(true);
  const [morningShift, setMorningShift] = useState(true);
  
  const [selectedSkills, setSelectedSkills] = useState(['Farming']);
  const availableSkills = ['Farming', 'Handicrafts', 'Packing', 'Dairy Work', 'Local Coordination', '+ Other'];

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
            source={{ uri: 'https://images.unsplash.com/photo-1590496155982-f56f34e62bf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Building our future, together.</Text>
            <Text style={styles.heroSubtitle}>
              Join the mission of rural empowerment and professional growth.
            </Text>
          </View>
        </View>

        {/* Section: Local Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Local Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Village / Panchayat Name</Text>
            <TextInput style={styles.input} placeholder="Enter your village" placeholderTextColor="#999" />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>District</Text>
            <View style={styles.dropdownInput}>
              <Text style={styles.dropdownText}>Select District</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nearest Landmark</Text>
            <TextInput style={styles.input} placeholder="e.g. Near Govt Hospital" placeholderTextColor="#999" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Practical Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="human-male-height" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Practical Details</Text>
          </View>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Owns Vehicle (Cycle/Scooter)</Text>
            <Switch 
              trackColor={{ false: '#E0E0E0', true: '#D81B60' }}
              thumbColor={'#FFF'}
              onValueChange={setOwnsVehicle}
              value={ownsVehicle}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Can Travel Within 5km</Text>
            <Switch 
              trackColor={{ false: '#E0E0E0', true: '#D81B60' }}
              thumbColor={'#FFF'}
              onValueChange={setCanTravel}
              value={canTravel}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Available for Morning Shift</Text>
            <Switch 
              trackColor={{ false: '#E0E0E0', true: '#D81B60' }}
              thumbColor={'#FFF'}
              onValueChange={setMorningShift}
              value={morningShift}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Work Skills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="head-lightbulb-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Work Skills</Text>
          </View>
          
          <Text style={styles.subtext}>Select all that apply to you</Text>
          
          <View style={styles.skillsContainer}>
            {availableSkills.map((skill) => (
              <TouchableOpacity 
                key={skill} 
                style={[
                  styles.skillPill, 
                  selectedSkills.includes(skill) && styles.skillPillActive,
                  skill === '+ Other' && styles.skillPillOther
                ]}
                onPress={() => toggleSkill(skill)}
              >
                {selectedSkills.includes(skill) && skill !== '+ Other' && (
                  <Ionicons name="checkmark-circle" size={14} color="#FFF" style={{marginRight: 6}} />
                )}
                <Text style={[
                  styles.skillPillText, 
                  selectedSkills.includes(skill) && styles.skillPillTextActive,
                  skill === '+ Other' && styles.skillPillTextOther
                ]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Documentation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cloud-upload-outline" size={18} color="#A00B29" />
            <Text style={styles.sectionTitle}>Documentation</Text>
          </View>
          
          {/* Upload Box 1 */}
          <View style={styles.uploadBox}>
            <MaterialCommunityIcons name="badge-account-outline" size={28} color="#A00B29" style={styles.uploadIcon} />
            <Text style={styles.uploadTitle}>Upload ID Proof</Text>
            <Text style={styles.uploadSubtitle}>Aadhaar or Voter ID (JPG, PDF)</Text>
          </View>
          
          {/* Upload Box 2 */}
          <View style={styles.uploadBox}>
            <MaterialCommunityIcons name="certificate-outline" size={28} color="#A00B29" style={styles.uploadIcon} />
            <Text style={styles.uploadTitle}>Skill Certificate</Text>
            <Text style={styles.uploadSubtitle}>Training Proof (Optional)</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)', // Lighter overlay based on image
    justifyContent: 'flex-end',
    padding: 15,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#FFF',
    fontSize: 11,
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#D81B60', // Distinct dark pink line based on image
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
    fontWeight: '500',
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#FDF7FB', // Light purple background
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: '#333',
  },
  subtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  skillPillActive: {
    backgroundColor: '#A00B29', // Dark red
    borderColor: '#A00B29',
  },
  skillPillOther: {
    borderColor: '#D81B60', // Pink border
  },
  skillPillText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  skillPillTextActive: {
    color: '#FFF',
  },
  skillPillTextOther: {
    color: '#D81B60', // Pink text
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadIcon: {
    marginBottom: 8,
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
  footer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
