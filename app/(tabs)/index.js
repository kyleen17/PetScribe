import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Logo from "../../assets/images/Petscribe-Logo.png";
import bg1 from "../../assets/images/bg1.png";
import bg2 from "../../assets/images/bg2.png";
import bg3 from "../../assets/images/bg3.png";

const backgroundImages = [bg1, bg2, bg3];

export default function HomeScreen() {
  const router = useRouter();
  const { newPet } = useLocalSearchParams();
  const [pets, setPets] = useState([]);
  const [randomBackground, setRandomBackground] = useState(bg1);

useEffect(() => {
  const random =
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  setRandomBackground(random);
}, []);


  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await AsyncStorage.getItem("pets");
        const parsed = storedPets ? JSON.parse(storedPets) : [];
        setPets(parsed);
      } catch (error) {
        console.error("Failed to load pets:", error);
      }
    };
    loadPets();
  }, []);

  useEffect(() => {
    const savePets = async () => {
      try {
        await AsyncStorage.setItem("pets", JSON.stringify(pets));
      } catch (error) {
        console.error("Failed to save pets:", error);
      }
    };
    savePets();
  }, [pets]);

  useEffect(() => {
    if (newPet) {
      const parsedPet = JSON.parse(newPet);
      setPets((prev) => [...prev, parsedPet]);
    }
  }, [newPet]);

  return (
    <ImageBackground source={randomBackground} style={styles.backgroundImage}>
      <View style={styles.overlay}>
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
                    pathname: "/pet-profile",
                    params: { pet: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.petText}>
                  {item.name} ({item.type})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const filtered = pets.filter((p) => p.id !== item.id);
                  setPets(filtered);
                }}
              >
                <Text style={styles.removeButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-pet")}
        >
          <Text style={styles.addButtonText}>ADD PET</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#2a9d8f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001411",
    marginBottom: 20,
  },
  petItemRow: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  petText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#e76f51",
    padding: 10,
    borderRadius: 50,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

