import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Reusable Custom Input Component
const CustomInput = ({ label, placeholder, icon, isPassword, isTextArea = false, value, onChangeText, keyboardType }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, isTextArea && styles.textAreaWrapper]}>
        <TextInput
          style={[styles.input, isTextArea && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor="#B0B0B0"
          secureTextEntry={isPassword ? !showPassword : false}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 4 : 1}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {icon && !isPassword && <Ionicons name={icon} size={20} color="#B0B0B0" style={styles.inputIcon} />}
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#B0B0B0" style={styles.inputIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Reusable Custom Dropdown
const CustomDropdown = ({ label, placeholder, options, value, onSelect }: any) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.inputWrapper} onPress={() => setVisible(true)}>
        <Text style={[styles.dropdownText, value && {color: '#333'}]}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color="#B0B0B0" style={styles.inputIcon} />
      </TouchableOpacity>
      
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => { onSelect(item); setVisible(false); }}>
                    <Text style={styles.modalOptionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// Custom Date Picker
const CustomDatePicker = ({ label, value, onChangeText }: any) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, { paddingHorizontal: 0, overflow: 'hidden' }]}>
          <input 
            type="date" 
            style={{flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#333', backgroundColor: 'transparent', padding: '0 12px', height: '100%', width: '100%', fontFamily: 'inherit'}}
            value={value}
            onChange={(e: any) => onChangeText(e.target.value)}
          />
        </View>
      </View>
    );
  }
  
  return <CustomInput label={label} placeholder="YYYY-MM-DD" icon="calendar-outline" value={value} onChangeText={onChangeText} />;
};

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // Form State - Step 1
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Form State - Step 2
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [nationality, setNationality] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = async () => {
    setErrorMsg('');
    
    if (step === 1) {
      if (!fullName || !mobileNumber || !email || !password) {
        setErrorMsg('Please fill out all fields.');
        return;
      }
      if (!termsAgreed) {
        setErrorMsg('You must agree to the Terms of Service.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fullName, 
            mobileNumber, 
            email, 
            password,
            dob,
            age,
            address,
            maritalStatus,
            bloodGroup,
            nationality,
            preferredLanguage
          })
        });
        const data = await response.json();
        
        if (response.ok) {
          console.log('Registered user token:', data.token);
          alert('Registration Complete!');
          // router.replace('/dashboard');
        } else {
          setErrorMsg(data.error || 'Registration failed.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Network error. Is the backend server running?');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.sectionTitle}>Create Account</Text>
      <Text style={styles.sectionSubtitle}>
        Welcome! Let's start with your basic information to set up your professional profile.
      </Text>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <CustomInput label="Full Name *" placeholder="Bharathy" icon="person-outline" value={fullName} onChangeText={setFullName} />
      <CustomInput label="Mobile Number *" placeholder="6369035633" icon="call-outline" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" />
      <CustomInput label="Email Address *" placeholder="bharathi@example.com" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <CustomInput label="Password *" placeholder="........" isPassword={true} value={password} onChangeText={setPassword} />

      <TouchableOpacity 
        style={styles.checkboxContainer} 
        activeOpacity={0.7} 
        onPress={() => setTermsAgreed(!termsAgreed)}
      >
        <View style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}>
          {termsAgreed && <Ionicons name="checkmark" size={14} color="#8B0000" />}
        </View>
        <Text style={styles.checkboxText}>
          I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={handleNext}>
        <LinearGradient
          colors={['#8B0000', '#3E0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
        </LinearGradient>
      </TouchableOpacity>
      
      <Text style={styles.footerTagline}>EMPOWERING WOMEN ACROSS THE GLOBE</Text>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      <Text style={styles.sectionSubtitle}>
        Please provide your official details for documentation and community verification.
      </Text>

      <CustomDatePicker label="Date of Birth" value={dob} onChangeText={setDob} />
      <CustomInput label="Age" placeholder="Enter Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <CustomInput label="Address" placeholder="Enter Your Address" isTextArea={true} value={address} onChangeText={setAddress} />
      
      <CustomDropdown 
        label="Marital Status" 
        placeholder="Select Status" 
        options={['Single', 'Married', 'Divorced', 'Widowed']}
        value={maritalStatus}
        onSelect={setMaritalStatus}
      />
      <CustomDropdown 
        label="Blood Group" 
        placeholder="Select Blood Group" 
        options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
        value={bloodGroup}
        onSelect={setBloodGroup}
      />
      <CustomDropdown 
        label="Nationality" 
        placeholder="Select Nationality" 
        options={['Indian', 'Other']}
        value={nationality}
        onSelect={setNationality}
      />
      <CustomDropdown 
        label="Preferred Language" 
        placeholder="Select Language" 
        options={['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam']}
        value={preferredLanguage}
        onSelect={setPreferredLanguage}
      />

      <TouchableOpacity 
        style={[styles.checkboxContainer, styles.highlightedCheckboxBox]} 
        activeOpacity={0.7} 
        onPress={() => setTermsAgreed(!termsAgreed)}
      >
        <View style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}>
          {termsAgreed && <Ionicons name="checkmark" size={14} color="#8B0000" />}
        </View>
        <Text style={styles.checkboxText}>
          I confirm that the information provided above is accurate and belongs to me. I consent to the processing of this data as per the <Text style={styles.linkTextPurple}>Privacy Policy</Text>.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={handleNext}>
        <LinearGradient
          colors={['#8B0000', '#3E0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save & Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.sectionTitle}>Upload Profile Photo</Text>
      <Text style={styles.sectionSubtitle}>
        Help us personalize your journey. A professional photo helps mentors and peers recognize you.
      </Text>

      <View style={styles.photoUploadContainer}>
        <View>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="person-outline" size={60} color="#D3D3D3" />
          </View>
          <View style={styles.cameraIconBadge}>
            <Ionicons name="camera" size={20} color="#FFF" />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.uploadOptionCard}>
        <View style={[styles.uploadIconContainer, { backgroundColor: '#F0E6FF' }]}>
          <Ionicons name="aperture-outline" size={24} color="#8B008B" />
        </View>
        <View>
          <Text style={styles.uploadOptionTitle}>Use Camera</Text>
          <Text style={styles.uploadOptionSubtitle}>Take a new photo</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadOptionCard}>
        <View style={[styles.uploadIconContainer, { backgroundColor: '#FFE6E6' }]}>
          <Ionicons name="images-outline" size={24} color="#8B0000" />
        </View>
        <View>
          <Text style={styles.uploadOptionTitle}>From Gallery</Text>
          <Text style={styles.uploadOptionSubtitle}>Choose from files</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={20} color="#8B0000" style={styles.noteIcon} />
        <View style={{flex: 1}}>
          <Text style={styles.noteTitle}>Note</Text>
          <Text style={styles.noteText}>
            Please ensure your photo follows passport-style requirements: clear face visibility, no sunglasses, and a neutral background for professional verification. Max file size: 5MB.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={handleNext}>
        <LinearGradient
          colors={['#8B0000', '#3E0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext} style={styles.skipPhotoContainer}>
        <Text style={styles.skipPhotoText}>Skip for now</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3A0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registration</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A0000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4A1525', 
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8CACA', 
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#FFF',
  },
  textAreaWrapper: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
  },
  inputIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    maxHeight: '60%',
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 25,
  },
  highlightedCheckboxBox: {
    backgroundColor: '#F7EBEB',
    padding: 12,
    borderRadius: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#E8CACA',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    borderColor: '#8B0000',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  linkText: {
    color: '#8B0000',
    fontWeight: '600',
  },
  linkTextPurple: {
    color: '#4B0082',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footerTagline: {
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    marginTop: 10,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trustBadge: {
    alignItems: 'center',
    flex: 1,
  },
  trustBadgeText: {
    fontSize: 8,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  photoUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5EDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3E0000',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  uploadOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  uploadIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  uploadOptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  uploadOptionSubtitle: {
    fontSize: 11,
    color: '#888',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FDF5F7',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F5E6E6',
  },
  noteIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3A0000',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  skipPhotoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipPhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  }
});
