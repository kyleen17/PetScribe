import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import bg1 from '../assets/images/bg1.png';
import bg2 from '../assets/images/bg2.png';
import bg3 from '../assets/images/bg3.png';


export default function AddPetScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [lastBath, setLastBath] = useState('');
  const [lastMedication, setLastMedication] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddPet = () => {
    if (!name.trim() || !type.trim()) {
      Alert.alert('Please enter at least name and type.');
      return;
    }

    const newPet = {
      id: Date.now().toString(),
      name,
      type,
      breed,
      color,
      weight,
      image,
      allergies,
      medications,
      logs: {
        lastBath,
        lastMedication,
      },
    };

    router.push({
      pathname: '/',
      params: { newPet: JSON.stringify(newPet) },
    });
  };

  return (
    <ImageBackground source={bg1} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentBox}>
          <Text style={styles.title}>Add New Pet</Text>

          <Text style={styles.label}>Pet Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter pet's name" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Pet Type:</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Dog, Cat, etc." placeholderTextColor="#aaa" />

          <Text style={styles.label}>Breed:</Text>
          <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="e.g., Husky, Siamese" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Color:</Text>
          <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="Black & White, Brown, etc." placeholderTextColor="#aaa" />

          <Text style={styles.label}>Weight:</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="e.g., 25 kg" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Image URL:</Text>
          <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="Paste an image link" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Allergies:</Text>
          <TextInput style={styles.input} value={allergies} onChangeText={setAllergies} placeholder="Any allergies?" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Medications:</Text>
          <TextInput style={styles.input} value={medications} onChangeText={setMedications} placeholder="List medications" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Last Bath Date:</Text>
          <TextInput style={styles.input} value={lastBath} onChangeText={setLastBath} placeholder="YYYY-MM-DD" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Last Medication Date:</Text>
          <TextInput style={styles.input} value={lastMedication} onChangeText={setLastMedication} placeholder="YYYY-MM-DD" placeholderTextColor="#aaa" />

          <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
            <Text style={styles.addButtonText}>SAVE PET</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#2a9d8f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#001411',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#001411',
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#faf3e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
    color: '#001411',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#2a9d8f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
