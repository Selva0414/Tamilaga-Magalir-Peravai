import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BookingSessionScreen() {
  const router = useRouter();
  const { name, email, mentorName } = useLocalSearchParams<{ name?: string, email?: string, mentorName?: string }>();
  
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>('https://randomuser.me/api/portraits/women/44.jpg');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const [sessionType, setSessionType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('15');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

  const dates = [
    [ { d: '28', m: false }, { d: '29', m: false }, { d: '30', m: false }, { d: '1', m: true }, { d: '2', m: true }, { d: '3', m: true }, { d: '4', m: true } ],
    [ { d: '5', m: true }, { d: '6', m: true }, { d: '7', m: true }, { d: '8', m: true }, { d: '9', m: true }, { d: '10', m: true }, { d: '11', m: true } ],
    [ { d: '12', m: true }, { d: '13', m: true }, { d: '14', m: true }, { d: '15', m: true }, { d: '16', m: true }, { d: '17', m: true }, { d: '18', m: true } ],
  ];

  const handleConfirm = () => {
    router.push({ pathname: '/counseling-success', params: { name, email } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Counseling & Mentor</Text>
        
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperStep}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}><Text style={styles.stepTextActive}>1</Text></View>
            <Text style={styles.stepLabelActive}>Select{"\n"}Type</Text>
          </View>
          <View style={styles.stepperLine} />
          <View style={styles.stepperStep}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}><Text style={styles.stepTextActive}>2</Text></View>
            <Text style={styles.stepLabelActive}>Date &{"\n"}Time</Text>
          </View>
          <View style={styles.stepperLine} />
          <View style={styles.stepperStep}>
            <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
            <Text style={styles.stepLabel}>Confirm</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section: Session Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Session Type</Text>
          
          <TouchableOpacity 
            style={[styles.typeCard, sessionType === 'Live Chat' && styles.typeCardSelected]}
            onPress={() => setSessionType('Live Chat')}
          >
            <MaterialCommunityIcons name="chat-outline" size={24} color="#A00B29" />
            <Text style={styles.typeCardTitle}>Live Chat</Text>
            <Text style={styles.typeCardSubtitle}>Instant guidance via secure text</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeCard, sessionType === 'In-Person' && styles.typeCardSelected]}
            onPress={() => setSessionType('In-Person')}
          >
            <MaterialCommunityIcons name="account-group" size={24} color="#A00B29" />
            <Text style={styles.typeCardTitle}>In-Person Meeting</Text>
            <Text style={styles.typeCardSubtitle}>Face-to-face community support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeCard, sessionType === 'Community' && styles.typeCardSelected]}
            onPress={() => setSessionType('Community')}
          >
            <MaterialCommunityIcons name="account-multiple" size={24} color="#A00B29" />
            <Text style={styles.typeCardTitle}>Community Session</Text>
            <Text style={styles.typeCardSubtitle}>Group workshops and solidarity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Section: Pick Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick Date & Time</Text>
          
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>October 2024</Text>
            <View style={styles.monthNav}>
              <Ionicons name="chevron-back" size={16} color="#333" />
              <Ionicons name="chevron-forward" size={16} color="#333" style={{marginLeft: 15}} />
            </View>
          </View>

          <View style={styles.daysRow}>
            {['M','T','W','T','F','S','S'].map((day, i) => <Text key={i} style={styles.dayLabel}>{day}</Text>)}
          </View>

          {dates.map((week, wIndex) => (
            <View key={wIndex} style={styles.datesRow}>
              {week.map((dateObj, dIndex) => (
                <TouchableOpacity 
                  key={dIndex} 
                  style={styles.dateCell}
                  onPress={() => dateObj.m && setSelectedDate(dateObj.d)}
                  disabled={!dateObj.m}
                >
                  <View style={[
                    styles.dateBubble,
                    selectedDate === dateObj.d && styles.dateBubbleSelected
                  ]}>
                    <Text style={[
                      styles.dateText,
                      !dateObj.m && styles.dateTextDisabled,
                      selectedDate === dateObj.d && styles.dateTextSelected
                    ]}>{dateObj.d}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Time Slots */}
          <Text style={styles.timeSectionLabel}>MORNING</Text>
          <View style={styles.timeSlotsRow}>
            {['09:00 AM', '10:30 AM'].map(time => (
              <TouchableOpacity key={time} style={[styles.timeSlotBtn, selectedTime === time && styles.timeSlotSelected]} onPress={() => setSelectedTime(time)}>
                <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.timeSectionLabel}>AFTERNOON</Text>
          <View style={styles.timeSlotsRow}>
            {['01:30 PM', '03:30 PM'].map(time => (
              <TouchableOpacity key={time} style={[styles.timeSlotBtn, selectedTime === time && styles.timeSlotSelected]} onPress={() => setSelectedTime(time)}>
                <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.timeSectionLabel}>EVENING</Text>
          <View style={styles.timeSlotsRow}>
            {['06:00 PM', '07:30 PM'].map(time => (
              <TouchableOpacity key={time} style={[styles.timeSlotBtn, selectedTime === time && styles.timeSlotSelected]} onPress={() => setSelectedTime(time)}>
                <Text style={[styles.timeSlotText, selectedTime === time && styles.timeSlotTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        <View style={styles.dividerBold} />

        {/* Section: Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="calendar" size={20} color="#A00B29" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>SESSION & TIMING</Text>
              <Text style={styles.summaryValue}>
                {selectedDate && selectedTime ? `Oct ${selectedDate}, ${selectedTime}` : 'Not selected!'}
              </Text>
              <Text style={styles.summarySubtext}>
                {sessionType ? sessionType : 'Select a slot & type'}
              </Text>
            </View>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Member Status</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium Member</Text>
            </View>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.totalCostLabel}>Total Cost</Text>
            <Text style={styles.freeText}>Free</Text>
          </View>

          <View style={styles.infoAlertBox}>
            <Ionicons name="information-circle-outline" size={18} color="#00695C" />
            <Text style={styles.infoAlertText}>
              Confirmed bookings can be rescheduled up to 24 hours before the session start time.
            </Text>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Hero Image Card */}
        <View style={styles.bottomCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
            style={styles.bottomCardImg} 
          />
          <View style={styles.bottomCardOverlay}>
            <Text style={styles.bottomCardTitle}>Empowering Your Journey</Text>
            <Text style={styles.bottomCardSub}>Join thousands of women growing together.</Text>
          </View>
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
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 20,
  },
  stepperStep: {
    alignItems: 'center',
    width: 60,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#E1BEE7', // Darker purple for active
  },
  stepText: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: '#4A148C',
  },
  stepLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  stepLabelActive: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepperLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
    marginTop: 18,
    marginHorizontal: -5,
  },
  divider: {
    height: 1,
    backgroundColor: '#D81B60',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  dividerBold: {
    height: 2,
    backgroundColor: '#A00B29',
    marginHorizontal: 20,
    marginVertical: 25,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
    marginBottom: 15,
  },
  typeCard: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  typeCardSelected: {
    borderColor: '#A00B29',
    backgroundColor: '#FDF7FB',
  },
  typeCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 2,
  },
  typeCardSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  monthNav: {
    flexDirection: 'row',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayLabel: {
    width: 30,
    textAlign: 'center',
    fontSize: 11,
    color: '#888',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBubbleSelected: {
    backgroundColor: '#E1BEE7',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  dateTextDisabled: {
    color: '#CCC',
  },
  dateTextSelected: {
    color: '#4A148C',
    fontWeight: 'bold',
  },
  timeSectionLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 15,
    marginBottom: 10,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  timeSlotBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  timeSlotSelected: {
    borderColor: '#A00B29',
    backgroundColor: '#FDF7FB',
  },
  timeSlotText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#A00B29',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  summarySubtext: {
    fontSize: 11,
    color: '#666',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 12,
    color: '#333',
  },
  premiumBadge: {
    backgroundColor: '#80DEEA', // Mint green/cyan
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#006064',
  },
  totalCostLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  freeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  infoAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  infoAlertText: {
    flex: 1,
    fontSize: 10,
    color: '#555',
    marginLeft: 10,
    lineHeight: 14,
  },
  confirmBtn: {
    backgroundColor: '#A00B29',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomCard: {
    marginHorizontal: 20,
    marginTop: 25,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomCardImg: {
    width: '100%',
    height: '100%',
  },
  bottomCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(92, 28, 71, 0.6)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  bottomCardTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomCardSub: {
    color: '#F0E5F0',
    fontSize: 10,
  }
});
