import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';



export default function AddPetScreen() {
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


  const router = useRouter();

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pet Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter pet's name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Pet Type:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Dog, Cat, etc."
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Color:</Text>
      <TextInput
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholder="Black & White, Brown, etc."
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Image URL:</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
        placeholder="Paste an image link"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Allergies:</Text>
      <TextInput
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        placeholder="Any allergies?"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Medications:</Text>
      <TextInput
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholder="List medications"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Last Bath Date:</Text>
      <TextInput
        style={styles.input}
        value={lastBath}
        onChangeText={setLastBath}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Last Medication Date:</Text>
      <TextInput
        style={styles.input}
        value={lastMedication}
        onChangeText={setLastMedication}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#999"
      />

<Text style={styles.label}>Breed:</Text>
<TextInput
  style={styles.input}
  value={breed}
  onChangeText={setBreed}
  placeholder="e.g., Husky, Siamese"
  placeholderTextColor="#999"
/>

<Text style={styles.label}>Weight:</Text>
<TextInput
  style={styles.input}
  value={weight}
  onChangeText={setWeight}
  placeholder="e.g., 25 kg"
  placeholderTextColor="#999"
/>


      <Button title="Add Pet" onPress={handleAddPet} />
    </ScrollView>


  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 18, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    marginTop: 10,
    color: '#fff',  // <-- change here!
  },
  
});

