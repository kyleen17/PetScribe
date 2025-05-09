import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../../assets/images/Petscribe-Logo.png';
import bg1 from '../../assets/images/bg1.png';
import bg2 from '../../assets/images/bg2.png';
import bg3 from '../../assets/images/bg3.png';

const backgroundImages = [bg1, bg2, bg3];


export default function HomeScreen() {
  const router = useRouter();
  const { newPet } = useLocalSearchParams();
  const [pets, setPets] = useState([]);
  const [randomBackground, setRandomBackground] = useState(backgroundImages[0]);

  useEffect(() => {
    const random = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setRandomBackground(random);
  }, []);
  
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
    <ImageBackground source={randomBackground} style={styles.backgroundImage}>
  <View style={styles.contentBox}>
    <Image source={Logo} style={styles.logo} resizeMode="contain" />
    <Text style={styles.title}>My Pets</Text>
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.petItemRow}>
              <TouchableOpacity
                style={styles.petInfo}
                onPress={() =>
                  router.push({
                    pathname: '/pet-profile',
                    params: { pet: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.petText}>{item.name} ({item.type})</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setPets(prev => prev.filter(p => p.id !== item.id))}
              >
                <Text style={styles.removeButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-pet')}>
          <Text style={styles.addButtonText}>ADD PET</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',   // ✅ center vertically
    alignItems: 'center',       // ✅ center horizontally
  },
  

    contentBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: 20,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: '#2a9d8f', // ✅ your palette color
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,      // ✅ reduce opacity for softer shadow
      shadowRadius: 10,        // ✅ increase for more spread / softness
      elevation: 5,
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',     // ✅ center horizontally
      justifyContent: 'center',// ✅ center vertically inside parent
    },
    
    

    logo: {
      width: 200,
      height: 200,
      marginBottom: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#001411',  // ✅ dark green from palette
      marginBottom: 20,
    },
    
    petItemRow: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 15,
      borderRadius: 16,
      marginBottom: 15,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    petText: {
      fontSize: 18,
      color: '#333',
      fontWeight: '600',
    },
    removeButton: {
      backgroundColor: '#e76f51',
      padding: 10,
      borderRadius: 50,
    },
    removeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    addButton: {
      marginTop: 20,
      backgroundColor: '#2a9d8f',
      padding: 12,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  






