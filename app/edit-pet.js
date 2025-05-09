import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bg1 from '../assets/images/bg1.png';

export default function EditPetScreen() {
  const { pet } = useLocalSearchParams();
  const router = useRouter();

  const parsedPet = JSON.parse(pet);

  const [name, setName] = useState(parsedPet.name);
  const [type, setType] = useState(parsedPet.type);
  const [color, setColor] = useState(parsedPet.color);
  const [image, setImage] = useState(parsedPet.image);
  const [allergies, setAllergies] = useState(parsedPet.allergies);
  const [breed, setBreed] = useState(parsedPet.breed);
  const [weight, setWeight] = useState(parsedPet.weight);

  const handleSaveChanges = async () => {
    if (!name.trim() || !type.trim()) {
      Alert.alert('Please enter at least name and type.');
      return;
    }

    const updatedPet = {
      ...parsedPet,
      name,
      type,
      color,
      image,
      allergies,
      breed,
      weight,
    };

    try {
      const storedPets = await AsyncStorage.getItem('pets');
      const petsArray = storedPets ? JSON.parse(storedPets) : [];

      const updatedPets = petsArray.map(p => p.id === parsedPet.id ? updatedPet : p);

      await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));

      router.replace({
        pathname: '/pet-profile',
        params: { pet: JSON.stringify(updatedPet) }
      });

    } catch (error) {
      console.error('❌ Failed to update pet:', error);
      Alert.alert('Error', 'Could not save changes.');
    }
  };

  return (
    <ImageBackground source={bg1} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Pet</Text>

          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Type:</Text>
          <TextInput style={styles.input} value={type} onChangeText={setType} />

          <Text style={styles.label}>Breed:</Text>
          <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

          <Text style={styles.label}>Color:</Text>
          <TextInput style={styles.input} value={color} onChangeText={setColor} />

          <Text style={styles.label}>Weight:</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} />

          <Text style={styles.label}>Allergies:</Text>
          <TextInput style={styles.input} value={allergies} onChangeText={setAllergies} />

          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2A9D8F', marginBottom: 20 },
  label: { fontSize: 16, color: '#333', marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 15,
  },
  button: { backgroundColor: '#2A9D8F', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
