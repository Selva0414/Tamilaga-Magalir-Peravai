import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Platform, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ActivityApplyScreen() {
  const router = useRouter();
  const { name, email, activityTitle } = useLocalSearchParams<{ name?: string, email?: string, activityTitle?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const [fullName, setFullName] = useState(name || '');
  const [mobile, setMobile] = useState('');
  const [emailAddress, setEmailAddress] = useState(email || '');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const displayTitle = activityTitle || 'Financial Literacy Workshop';

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

  const handleSubmit = () => {
    // Navigate to the specific success page for activity participation
    router.push({ pathname: '/activity-success', params: { name: fullName, email: emailAddress, activityTitle: displayTitle } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Tamilaga Magalir Peravai</Text>
        
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

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.formHeader}>
            <View style={styles.formTitleRow}>
              <View style={styles.titleColumn}>
                <Text style={styles.formPreTitle}>REGISTRATION FORM</Text>
                <Text style={styles.formMainTitle}>{displayTitle}</Text>
              </View>
              <View style={styles.stepColumn}>
                <Text style={styles.stepText}>Step 1</Text>
                <Text style={styles.stepText}>of 1</Text>
              </View>
            </View>
            <View style={styles.titleUnderline} />
            
            <Text style={styles.formIntro}>
              Join our expert-led session to master your personal and business finances. Please fill in the details below to secure your spot.
            </Text>
          </View>

          <View style={styles.formSection}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your full name" 
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+91</Text>
                <TextInput 
                  style={styles.phoneInput} 
                  placeholder="98765 43210" 
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="name@example.com" 
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Enter your complete residential address" 
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>District</Text>
              <TouchableOpacity style={styles.dropdownBtn}>
                <Text style={[styles.dropdownText, !district && {color: '#999'}]}>
                  {district || 'Select District'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interested Category</Text>
              <View style={styles.categoryPills}>
                {['Entrepreneur', 'Student', 'Professional'].map((cat) => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.pill, category === cat && styles.pillActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the <Text style={styles.linkText}>Terms & Conditions</Text> and understand how my data will be used to support my participation in the workshop.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitBtn, (!agreed || !fullName) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!agreed || !fullName}
            >
              <Text style={styles.submitBtnText}>Submit Registration</Text>
              <Ionicons name="send" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              "Empowering one woman, strengthening an entire community."
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formHeader: {
    marginTop: 20,
    marginBottom: 25,
  },
  formTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 10,
  },
  formPreTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A00B29',
    letterSpacing: 1,
    marginBottom: 5,
  },
  formMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    lineHeight: 28,
  },
  stepColumn: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  titleUnderline: {
    height: 4,
    backgroundColor: '#A00B29',
    width: '100%',
    borderRadius: 2,
    marginBottom: 15,
  },
  formIntro: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  phonePrefix: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#666',
    borderRightWidth: 1,
    borderRightColor: '#EAEAEA',
    backgroundColor: '#F9F9F9',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  pillActive: {
    borderColor: '#A00B29',
    backgroundColor: '#FDF7FB',
  },
  pillText: {
    fontSize: 12,
    color: '#555',
  },
  pillTextActive: {
    color: '#A00B29',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#A00B29',
    borderColor: '#A00B29',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  linkText: {
    color: '#A00B29',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#A00B29',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitBtnDisabled: {
    backgroundColor: '#EAEAEA',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  cancelBtn: {
    backgroundColor: '#F3E5F5', // Light purple/pink
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#4A148C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quoteBox: {
    backgroundColor: '#F4FBF9', // Very light mint green
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quoteText: {
    color: '#00695C',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  }
});
