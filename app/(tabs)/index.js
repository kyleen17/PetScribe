import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../../assets/images/Petscribe-Logo.png';

export default function HomeScreen() {
  const router = useRouter();
  const { newPet } = useLocalSearchParams();
  const [pets, setPets] = useState([]);

  // Load pets
  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await AsyncStorage.getItem('pets');
        if (storedPets) {
          setPets(JSON.parse(storedPets));
        } else {
          setPets([]);
        }
      } catch (error) {
        console.error('Failed to load pets:', error);
      }
    };
    loadPets();
  }, []);

  // Save pets
  useEffect(() => {
    const savePets = async () => {
      try {
        await AsyncStorage.setItem('pets', JSON.stringify(pets));
      } catch (error) {
        console.error('Failed to save pets:', error);
      }
    };
    savePets();
  }, [pets]);

  // Handle new pet from Add Pet screen
  useEffect(() => {
    if (newPet) {
      const parsedPet = JSON.parse(newPet);
      setPets((prev) => [...prev, parsedPet]);
    }
  }, [newPet]);

  // ✅ ✅ ✅ NOW the return is inside the function
  return (
    <View style={styles.container}>
      <Image source={Logo} style={{ width: 200, height: 200 }} resizeMode="contain" />
      <Text style={styles.title}>My Pets</Text>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petItemRow}>
            <TouchableOpacity
              style={styles.petInfo}
              onPress={() => router.push({ pathname: '/pet-profile', params: { pet: JSON.stringify(item) } })}
            >
              <Text style={styles.petText}>{item.name} ({item.type})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setPets((prev) => prev.filter((p) => p.id !== item.id))}
            >
              <Text style={styles.removeButtonText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No pets added yet. Tap "Add Pet" below!</Text>}
      />

      <Button title="Add Pet" onPress={() => router.push('/add-pet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  petItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 8,
    width: '100%',
  },
  petInfo: { flex: 1 },
  removeButton: { padding: 8, backgroundColor: 'lightcoral', borderRadius: 5 },
  removeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  petText: { fontSize: 18 },
  emptyText: { fontStyle: 'italic', marginTop: 20, color: '#555' },
});






