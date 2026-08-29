import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform, TextInput, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MentorChatScreen() {
  const router = useRouter();
  const { name, email, mentorName } = useLocalSearchParams<{ name?: string, email?: string, mentorName?: string }>();
  
  const displayMentorName = mentorName || 'Dr. Meera Vasudevan';
  const [inputText, setInputText] = useState('');
  
  // Dummy messages to match the mockup
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello Dr. Meera, I would like to schedule a session regarding my home baking business.', sender: 'user', time: '10:30 AM' },
    { id: '2', text: "Hi Rajalakshmi! I'd be happy to help. Have you registered your business yet?", sender: 'mentor', time: '10:32 AM' },
    { id: '3', text: 'Not yet, I need guidance on the FSSAI registration process.', sender: 'user', time: '10:35 AM' },
  ]);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setInputText('');
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#A00B29" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>{displayMentorName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="call-outline" size={20} color="#A00B29" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="videocam-outline" size={22} color="#A00B29" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Today</Text>
          </View>

          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageRow, msg.sender === 'user' ? styles.messageRowUser : styles.messageRowMentor]}>
              {msg.sender === 'mentor' && (
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }} 
                  style={styles.messageAvatar} 
                />
              )}
              
              <View style={[styles.messageBubble, msg.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleMentor]}>
                <Text style={[styles.messageText, msg.sender === 'user' ? styles.messageTextUser : styles.messageTextMentor]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, msg.sender === 'user' ? styles.messageTimeUser : styles.messageTimeMentor]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={24} color="#888" />
          </TouchableOpacity>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : {}]} 
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color="#FFF" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7FB', // Light background as in mockup
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  iconButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A00B29',
  },
  headerStatus: {
    fontSize: 12,
    color: '#00695C',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerActionBtn: {
    padding: 5,
  },
  keyboardView: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  dateSeparator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateSeparatorText: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowMentor: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageBubbleUser: {
    backgroundColor: '#A00B29', // Dark red for user
    borderBottomRightRadius: 4,
  },
  messageBubbleMentor: {
    backgroundColor: '#FFF', // White for mentor
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFF',
  },
  messageTextMentor: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  messageTimeMentor: {
    color: '#999',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  attachBtn: {
    padding: 10,
    marginRight: 5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 15,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 10,
    paddingRight: 10,
  },
  micBtn: {
    padding: 5,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D81B60', // Pink send button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnActive: {
    backgroundColor: '#A00B29', // Darker red when active
  }
});
