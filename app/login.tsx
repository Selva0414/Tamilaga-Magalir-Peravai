import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Header Texts */}
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitleText}>STRENGTH IN SOLIDARITY</Text>

        {/* Image Card */}
        <View style={styles.imageCard}>
          <Image
            source={require('../assets/images/fourth.png')}
            style={styles.image}
            contentFit="contain"
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity 
          style={styles.registerButtonContainer} 
          activeOpacity={0.8}
          onPress={() => router.push('/register')}
        >
          <LinearGradient
            colors={['#8B0000', '#3E0000']} // Dark red gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>Register Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.registerIcon} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton} 
          activeOpacity={0.6}
          onPress={() => router.push('/login-form')}
        >
          <Text style={styles.loginButtonText}>Login to Your Account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.6}>
          <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Footer Terms */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#8B0000', // Deep red
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 1.5,
    marginBottom: 25,
  },
  imageCard: {
    width: width * 0.8,
    height: width * 0.65,
    maxHeight: 280,
    backgroundColor: '#FFF8F8', // Very light pink/white background for the card
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  registerButtonContainer: {
    width: '100%',
    marginBottom: 16,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerIcon: {
    marginLeft: 8,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5A9A9',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  footerText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },
  linkText: {
    color: '#4B0082', // Purple color for the link
    fontWeight: 'bold',
  }
});
