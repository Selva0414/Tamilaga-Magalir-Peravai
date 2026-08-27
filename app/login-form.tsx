import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CustomInput = ({ label, placeholder, icon, secureTextEntry, value, onChangeText, keyboardType }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#B0B0B0"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {icon && <Ionicons name={icon} size={20} color="#B0B0B0" style={styles.inputIcon} />}
    </View>
  </View>
);

export default function LoginFormScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    if (!termsAgreed) {
      setErrorMsg('You must agree to the Terms of Service.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log('Login successful! Token:', data.token);
        // router.replace('/dashboard');
        alert('Login Successful!');
      } else {
        setErrorMsg(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Is the backend server running?');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Login Account</Text>
            <Text style={styles.headerSubtitle}>Welcome to Magalir Peravai Thilagam !</Text>
          </View>

          <View style={styles.card}>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <CustomInput label="Full Name" placeholder="Bharathy" icon="person-outline" value={fullName} onChangeText={setFullName} />
            <CustomInput label="Email Address" placeholder="bharathy@example.com" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <CustomInput label="Password" placeholder="........" icon="lock-closed-outline" secureTextEntry value={password} onChangeText={setPassword} />

            <TouchableOpacity 
              style={styles.checkboxContainer} 
              activeOpacity={0.7} 
              onPress={() => setTermsAgreed(!termsAgreed)}
            >
              <View style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}>
                {termsAgreed && <Ionicons name="checkmark" size={14} color="#7A0C22" />}
              </View>
              <Text style={styles.checkboxText}>
                I agree to the Terms of Service and <Text style={styles.linkText}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={handleLogin}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
             <Text style={styles.footerText}>EMPOWERING WOMEN ACROSS THE GLOBE</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#2D2D2D', 
    marginBottom: 10 
  },
  headerSubtitle: { 
    fontSize: 15, 
    color: '#666',
    fontWeight: '400'
  },
  
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 15, 
    elevation: 3,
    marginBottom: 40
  },
  errorText: { color: 'red', fontSize: 12, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' },
  
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
    borderRadius: 8, 
    paddingHorizontal: 16, 
    height: 52, 
    backgroundColor: '#FFF' 
  },
  input: { flex: 1, fontSize: 15, color: '#333', height: '100%' },
  inputIcon: { marginLeft: 10 },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
    marginBottom: 20,
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
    borderColor: '#7A0C22',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#1A1A1A'
  },
  
  buttonContainer: { 
    width: '100%', 
    marginTop: 10,
    shadowColor: '#7A0C22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5
  },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 8,
    backgroundColor: '#7A0C22'
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  buttonIcon: { marginLeft: 8 },

  footerContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 1.5,
    fontWeight: '500'
  }
});
