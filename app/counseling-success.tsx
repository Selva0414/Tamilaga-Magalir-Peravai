import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'react-native';

export default function CounselingSuccessScreen() {
  const router = useRouter();
  const { name, email } = useLocalSearchParams<{ name?: string, email?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Space for status bar if needed, otherwise clean at top */}
      <View style={styles.content}>
        
        {/* Success Graphic */}
        <View style={styles.graphicContainer}>
          {/* Background halos */}
          <View style={styles.haloOuter}>
            <View style={styles.haloInner}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </View>
            </View>
          </View>
          
          {/* Confetti pieces (decorative) */}
          <View style={[styles.confetti, { top: '20%', left: '10%', backgroundColor: '#80DEEA', transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confetti, { top: '10%', left: '35%', backgroundColor: '#CE93D8', transform: [{ rotate: '15deg' }] }]} />
          <View style={[styles.confetti, { top: '30%', right: '15%', backgroundColor: '#F48FB1', transform: [{ rotate: '60deg' }] }]} />
          <View style={[styles.confetti, { top: '60%', left: '5%', backgroundColor: '#A5D6A7', transform: [{ rotate: '30deg' }] }]} />
          <View style={[styles.confetti, { top: '70%', right: '25%', backgroundColor: '#F48FB1', transform: [{ rotate: '75deg' }] }]} />
          <View style={[styles.confetti, { top: '15%', right: '5%', backgroundColor: '#CE93D8', transform: [{ rotate: '45deg' }] }]} />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.successTitle}>Counseling was</Text>
          <Text style={styles.successTitle}>applied successfully !</Text>
        </View>

        {/* Community Pill */}
        <View style={styles.communityPill}>
          <View style={styles.avatarsRow}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/11.jpg' }} style={styles.miniAvatar} />
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/42.jpg' }} style={[styles.miniAvatar, { marginLeft: -10 }]} />
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }} style={[styles.miniAvatar, { marginLeft: -10 }]} />
          </View>
          <View style={styles.pillTextContainer}>
            <Text style={styles.communityPillText}>+2,400 women joined this</Text>
            <Text style={styles.communityPillText}>week</Text>
          </View>
        </View>

      </View>

      {/* Footer Area */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push({ pathname: '/dashboard', params: { name, email } })}
        >
          <Text style={styles.primaryButtonText}>Go to My Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" style={styles.buttonIcon} />
        </TouchableOpacity>
        
        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Need help? </Text>
          <TouchableOpacity>
            <Text style={styles.contactText}>Contact support</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 80 : 60,
  },
  graphicContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  haloOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FDF0F3', // Very light pink halo
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8DCE2', // Darker pink halo
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A00B29', // Deep red core
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A00B29',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#A00B29',
    textAlign: 'center',
    lineHeight: 32,
  },
  communityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F1F8', // Very light purple background
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 40,
    width: '100%',
    justifyContent: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    marginRight: 15,
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  pillTextContainer: {
    alignItems: 'center',
  },
  communityPillText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 40 : 30,
  },
  primaryButton: {
    backgroundColor: '#A00B29',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  helpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 13,
    color: '#666',
  },
  contactText: {
    fontSize: 13,
    color: '#A00B29',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});
