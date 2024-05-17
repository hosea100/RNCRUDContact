import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { RootStackParamList } from '@/types/types';

type ContactDetailParams = {
  id?: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  photo?: string;
  mode: 'add' | 'edit';
};

export default function ContactDetailScreen() {
  const router = useRouter();
  const { id, firstName: initialFirstName, lastName: initialLastName, age: initialAge, photo: initialPhoto, mode } = useLocalSearchParams<ContactDetailParams>();

  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [lastName, setLastName] = useState(initialLastName || '');
  const [age, setAge] = useState(initialAge || '');
  const [photo, setPhoto] = useState(initialPhoto || '');

  useEffect(() => {
    if (mode === 'edit' && id) {
      // Fetch contact details if needed
    }
  }, [id, mode]);

  const handleSubmit = async () => {
    try {
      const contactData = { firstName, lastName, age, photo };

      if (mode === 'add') {
        await axiosInstance.postRequest('https://contact.herokuapp.com/contact', contactData);
      } else if (mode === 'edit' && id) {
        await axiosInstance.putRequest(`https://contact.herokuapp.com/contact/${id}`, contactData);
      }

      Alert.alert('Success', `Contact ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the contact.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        {photo ? (
          <Image style={styles.avatar} source={{ uri: photo }} />
        ) : (
          <Text>No Photo</Text>
        )}
        <Button title="Change Photo" onPress={() => console.log('Change Photo')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
        </View>
      </View>

      <Button title={mode === 'add' ? 'Add Contact' : 'Update Contact'} onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: 'gray',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
  },
});
