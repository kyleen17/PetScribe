import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// At the top (new imports)
import { Alert, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

import * as ImagePicker from "expo-image-picker";

const screenWidth = Dimensions.get("window").width;

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function PetProfileScreen() {
  const { pet } = useLocalSearchParams();
  const router = useRouter();
  const petData = JSON.parse(pet);

  // Bathing state
  const [bathFrequencyNumber, setBathFrequencyNumber] = useState("");
  const [bathFrequencyUnit, setBathFrequencyUnit] = useState("weeks");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Medication state
  const [medName, setMedName] = useState("");
  const [medFrequencyNumber, setMedFrequencyNumber] = useState("");
  const [medFrequencyUnit, setMedFrequencyUnit] = useState("days");
  const [medTime, setMedTime] = useState("");
  const [medTimesPerDay, setMedTimesPerDay] = useState("");
  const [medInstructions, setMedInstructions] = useState("");

  // Feeding state
  const [foodType, setFoodType] = useState("");
  const [amount, setAmount] = useState("");
  const [frequencyNumber, setFrequencyNumber] = useState("");
  const [frequencyUnit, setFrequencyUnit] = useState("times per day");
  const [timesOfDay, setTimesOfDay] = useState("");
  const [feedInstructions, setFeedInstructions] = useState("");

  // In your component state:
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [weightDate, setWeightDate] = useState(new Date());
  const [weightHistory, setWeightHistory] = useState(
    petData.logs?.weightHistory || []
  );
  const [showWeightDatePicker, setShowWeightDatePicker] = useState(false);

  const [medTimesOfDay, setMedTimesOfDay] = useState([]);
  const [showMedTimePicker, setShowMedTimePicker] = useState(false);

  const [petId, setPetId] = useState(petData.petId || "");
  const [vetInfo, setVetInfo] = useState(petData.vetInfo || "");
  const [notes, setNotes] = useState(petData.notes || "");

  // Birthday state
  const [birthday, setBirthday] = useState(
    petData.birthday ? new Date(petData.birthday) : null
  );
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const calculateAge = (birthdayString) => {
    if (!birthdayString) return null;

    const birthDate = new Date(birthdayString);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  };

  // Handler to save weight entry
  const handleAddWeight = async () => {
    if (!weight) {
      alert("Please enter a weight");
      return;
    }

    const newEntry = {
      date: weightDate.toISOString().split("T")[0],
      weight: parseFloat(weight),
      unit: weightUnit,
    };

    const updatedHistory = [...weightHistory, newEntry];

    const updatedPet = {
      ...petData,
      logs: {
        ...petData.logs,
        weightHistory: updatedHistory,
      },
    };

    await updatePetInStorage(updatedPet);
    setWeight("");
    setWeightHistory(updatedHistory);

    console.log("✅ Weight added:", newEntry);
  };

  // Request notification permissions once on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("We need permission to send notifications!");
      }
    };
    requestPermissions();
  }, []);

  // Opens the date picker
  const handleUpdateBath = () => {
    setShowDatePicker(true);
  };

  // Called when user selects a new date
  const onDateChange = async (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      const updatedPet = {
        ...petData,
        logs: {
          ...petData.logs,
          lastBath: formattedDate,
        },
      };
      await updatePetInStorage(updatedPet);
    }
  };

  const sortedWeightHistory = [...weightHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Launch the image picker
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImageUri = result.assets[0].uri;
      const updatedPet = { ...petData, image: newImageUri };

      await updatePetInStorage(updatedPet);
      console.log("✅ Image updated (gallery)!");
    }
  };

  // Save updated pet to AsyncStorage & refresh screen
  const updatePetInStorage = async (updatedPet) => {
    try {
      const storedPets = await AsyncStorage.getItem("pets");
      const petsArray = storedPets ? JSON.parse(storedPets) : [];
      const updatedPets = petsArray.map((pet) =>
        pet.id === updatedPet.id ? updatedPet : pet
      );
      await AsyncStorage.setItem("pets", JSON.stringify(updatedPets));

      console.log("✅ Updated pet:", updatedPet);

      router.replace({
        pathname: "/pet-profile",
        params: { pet: JSON.stringify(updatedPet) },
      });
    } catch (error) {
      console.error("❌ Failed to update pet:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Pet details */}
      <View
        style={{
          backgroundColor: "#333",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={styles.title}>{petData.name}</Text>
        <Text style={styles.subtitle}>{petData.type}</Text>
      </View>

      {petData.image ? (
        <Image
          source={{ uri: petData.image }}
          style={styles.petImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.noImage}>No image provided</Text>
      )}

      <Button title="Upload New Photo" onPress={pickImage} />

      <View style={styles.infoBox}>
        {petData.breed && (
          <Text style={styles.info}>Breed: {petData.breed}</Text>
        )}
        {petData.color && (
          <Text style={styles.info}>Color: {petData.color}</Text>
        )}
        {petData.weight && (
          <Text style={styles.info}>Weight: {petData.weight}</Text>
        )}
        {petData.allergies && (
          <Text style={styles.info}>Allergies: {petData.allergies}</Text>
        )}
        {petData.logs?.lastBath && (
          <Text style={styles.info}>Last Bath: {petData.logs.lastBath}</Text>
        )}
        {petData.logs?.bathFrequency && (
          <Text style={styles.info}>
            Bath Frequency: {petData.logs.bathFrequency}
          </Text>
        )}

        {petData.petId && (
          <Text style={styles.info}>Pet ID: {petData.petId}</Text>
        )}
        {petData.vetInfo && (
          <Text style={styles.info}>Vet: {petData.vetInfo}</Text>
        )}
        {petData.notes && (
          <Text style={styles.info}>Notes: {petData.notes}</Text>
        )}
      </View>

      {/* /* Birthday */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Birthday</Text>

        {petData.birthday ? (
          <Text style={styles.info}>🎉 Birthday: {petData.birthday}</Text>
        ) : (
          <Text style={styles.info}>No birthday set yet.</Text>
        )}

        {petData.birthday && (
          <Text style={styles.info}>
            Age:{" "}
            {(() => {
              const age = calculateAge(petData.birthday);
              if (!age) return "N/A";
              return `${age.years} year${age.years !== 1 ? "s" : ""} ${
                age.months
              } month${age.months !== 1 ? "s" : ""} old`;
            })()}
          </Text>
        )}

        <Button
          title={petData.birthday ? "Update Birthday" : "Set Birthday"}
          onPress={() => setShowBirthdayPicker(true)}
        />

        {showBirthdayPicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display="default"
            onChange={async (event, selectedDate) => {
              setShowBirthdayPicker(false);
              if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                setBirthday(selectedDate);

                // Save to storage
                const handleSaveBirthday = async () => {
                  if (!birthdayDate) {
                    alert("Please select a birthday");
                    return;
                  }

                  const formattedBirthday = birthdayDate
                    .toISOString()
                    .split("T")[0];

                  const updatedPet = {
                    ...petData,
                    logs: {
                      ...petData.logs,
                      birthday: formattedBirthday,
                    },
                  };

                  await updatePetInStorage(updatedPet);
                  console.log("🎉 Birthday saved:", formattedBirthday);
                };

                // Schedule yearly notification
                const month = selectedDate.getMonth(); // 0-11
                const day = selectedDate.getDate(); // 1-31

                console.log(
                  `🎉 Scheduling yearly birthday notification for ${
                    month + 1
                  }/${day}`
                );

                const ageNow = calculateAge(
                  selectedDate.toISOString().split("T")[0]
                );

                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `🎂 Happy Birthday, ${petData.name}!`,
                    body: `${petData.name} turns ${ageNow.years + 1} today! 🥳`,
                  },
                  trigger: {
                    month: month,
                    day: day,
                    hour: 9,
                    minute: 0,
                    repeats: true,
                  },
                });

                console.log("✅ Birthday & yearly notification scheduled.");
              }
            }}
          />
        )}
      </View>

      {/* Bathing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bathing</Text>
        <Text style={styles.info}>
          Last Bath: {petData.logs?.lastBath || "N/A"}
        </Text>
        <Button title="Update Last Bath" onPress={handleUpdateBath} />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Set Bath Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Bath Frequency</Text>

        <Text style={styles.info}>Enter number:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 6"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={bathFrequencyNumber}
          onChangeText={setBathFrequencyNumber}
        />

        <Text style={styles.info}>Choose unit:</Text>
        <Picker
          selectedValue={bathFrequencyUnit}
          onValueChange={(itemValue) => setBathFrequencyUnit(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Days" value="days" />
          <Picker.Item label="Weeks" value="weeks" />
          <Picker.Item label="Months" value="months" />
        </Picker>

        <Button
          title="Save Bath Frequency"
          onPress={async () => {
            if (!bathFrequencyNumber) {
              alert("Please enter a number");
              return;
            }

            const frequencyString = `${bathFrequencyNumber} ${bathFrequencyUnit}`;
            const updatedPet = {
              ...petData,
              logs: {
                ...petData.logs,
                bathFrequency: frequencyString,
              },
            };
            await updatePetInStorage(updatedPet);

            const lastBathDate = new Date(petData.logs?.lastBath || new Date());
            let frequencyInDays = parseInt(bathFrequencyNumber);

            if (bathFrequencyUnit === "weeks") frequencyInDays *= 7;
            else if (bathFrequencyUnit === "months") frequencyInDays *= 30;

            const nextBathDate = new Date(lastBathDate);
            nextBathDate.setDate(lastBathDate.getDate() + frequencyInDays);

            console.log("🔔 Scheduling notification for:", nextBathDate);

            await Notifications.scheduleNotificationAsync({
              content: {
                title: "🐾 Bath Time Reminder",
                body: `It's time to give ${petData.name} a bath!`,
              },
              trigger: {
                date: nextBathDate,
              },
            });

            console.log("✅ Notification scheduled.");
          }}
        />
      </View>

      {/* Pet ID Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet ID Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 12345"
          placeholderTextColor="#999"
          value={petId}
          onChangeText={setPetId}
        />
        <Button
          title="Save Pet ID"
          onPress={async () => {
            const updatedPet = {
              ...petData,
              petId,
            };
            await updatePetInStorage(updatedPet);
            console.log("✅ Pet ID saved.");
          }}
        />
      </View>

      {/* Vet Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vet Information</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Dr. Smith, Main Street Vet, (123) 456-7890"
          placeholderTextColor="#999"
          value={vetInfo}
          onChangeText={setVetInfo}
          multiline
        />
        <Button
          title="Save Vet Info"
          onPress={async () => {
            const updatedPet = {
              ...petData,
              vetInfo,
            };
            await updatePetInStorage(updatedPet);
            console.log("✅ Vet Info saved.");
          }}
        />
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="e.g., Prefers chicken flavor, gets nervous at the vet."
          placeholderTextColor="#999"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <Button
          title="Save Notes"
          onPress={async () => {
            const updatedPet = {
              ...petData,
              notes,
            };
            await updatePetInStorage(updatedPet);
            console.log("✅ Notes saved.");
          }}
        />
      </View>

      {/* Medication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medication Schedule</Text>

        {petData.logs?.medicationsList &&
        petData.logs.medicationsList.length > 0 ? (
          petData.logs.medicationsList.map((med, index) => (
            <View key={index} style={styles.medBox}>
              <Text style={styles.info}>Name: {med.name}</Text>
              <Text style={styles.info}>Frequency: {med.frequency}</Text>
              {med.timesPerDay && (
                <Text style={styles.info}>
                  Times Per Day: {med.timesPerDay}
                </Text>
              )}
              {med.timesOfDay && (
                <Text style={styles.info}>
                  Times of Day: {med.timesOfDay.join(", ")}
                </Text>
              )}
              {med.instructions && (
                <Text style={styles.info}>
                  Instructions: {med.instructions}
                </Text>
              )}

              <Button
                title="Delete"
                color="red"
                onPress={() => {
                  Alert.alert(
                    "Delete Medication",
                    `Are you sure you want to delete ${med.name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          const updatedList =
                            petData.logs.medicationsList.filter(
                              (_, i) => i !== index
                            );

                          const updatedPet = {
                            ...petData,
                            logs: {
                              ...petData.logs,
                              medicationsList: updatedList,
                            },
                          };

                          await updatePetInStorage(updatedPet);
                          console.log(`🗑️ Deleted medication: ${med.name}`);
                        },
                      },
                    ]
                  );
                }}
              />
            </View>
          ))
        ) : (
          <Text style={styles.info}>No medications added yet.</Text>
        )}

        {/* Add New Medication */}
        <Text style={styles.info}>Medication Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Heartworm Pill"
          placeholderTextColor="#999"
          value={medName}
          onChangeText={setMedName}
        />

        <Text style={styles.info}>Frequency Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={medFrequencyNumber}
          onChangeText={setMedFrequencyNumber}
        />

        <Text style={styles.info}>Frequency Unit:</Text>
        <Picker
          selectedValue={medFrequencyUnit}
          onValueChange={(itemValue) => setMedFrequencyUnit(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Days" value="days" />
          <Picker.Item label="Weeks" value="weeks" />
          <Picker.Item label="Months" value="months" />
        </Picker>

        <Text style={styles.info}>Times Per Day:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={medTimesPerDay}
          onChangeText={setMedTimesPerDay}
        />
        <Text style={styles.info}>Times of Day:</Text>
        {medTimesOfDay.length > 0 && (
          <Text style={styles.info}>{medTimesOfDay.join(", ")}</Text>
        )}

        <Button title="Add Time" onPress={() => setShowMedTimePicker(true)} />

        {showMedTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowMedTimePicker(false);
              if (selectedTime) {
                const formattedTime = new Date(selectedTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                setMedTimesOfDay((prevTimes) => [...prevTimes, formattedTime]);
              }
            }}
          />
        )}

        <Text style={styles.info}>Instructions:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Apply to skin, give with food"
          placeholderTextColor="#999"
          value={medInstructions}
          onChangeText={setMedInstructions}
        />

        <Button
          title="Add Medication"
          onPress={async () => {
            if (!medName || !medFrequencyNumber || medTimesOfDay.length === 0) {
              alert("Please fill in all medication details");
              return;
            }

            const frequencyString = `${medFrequencyNumber} ${medFrequencyUnit}`;
            const newMed = {
              name: medName,
              frequency: frequencyString,
              timesPerDay: medTimesPerDay,
              timesOfDay: medTimesOfDay,
              instructions: medInstructions,
            };

            const updatedMedicationsList = petData.logs?.medicationsList
              ? [...petData.logs.medicationsList, newMed]
              : [newMed];

            const updatedPet = {
              ...petData,
              logs: {
                ...petData.logs,
                medicationsList: updatedMedicationsList,
              },
            };

            await updatePetInStorage(updatedPet);

            console.log("🔔 Scheduling medication reminders...");

            // Loop through each time and schedule a reminder
            for (const time of medTimesOfDay) {
              let hour = parseInt(time.split(":")[0]);
              let minute = 0;

              // Handle AM/PM logic
              if (time.toLowerCase().includes("pm") && hour < 12) {
                hour += 12;
              }
              if (time.toLowerCase().includes("am") && hour === 12) {
                hour = 0;
              }

              // Extract minute if provided
              if (time.includes(":")) {
                const minuteMatch = time.match(/:(\d+)/);
                if (minuteMatch) {
                  minute = parseInt(minuteMatch[1]);
                }
              }

              console.log(
                `🔔 Scheduling medication reminder at ${hour}:${minute}`
              );

              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "💊 Medication Reminder",
                  body: `It's time to give ${petData.name} their ${medName}!`,
                },
                trigger: {
                  hour,
                  minute,
                  repeats: true,
                },
              });
            }

            console.log("✅ All medication reminders scheduled.");

            // Clear the form
            setMedName("");
            setMedFrequencyNumber("");
            setMedFrequencyUnit("days");
            setMedTimesPerDay("");
            setMedTime("");
            setMedInstructions("");
          }}
        />

        {/* Feeding Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeding Schedule</Text>

          {petData.logs?.feedingSchedule &&
          petData.logs.feedingSchedule.length > 0 ? (
            petData.logs.feedingSchedule.map((feed, index) => (
              <View key={index} style={styles.medBox}>
                <Text style={styles.info}>Food Type: {feed.foodType}</Text>
                <Text style={styles.info}>Amount: {feed.amount}</Text>
                <Text style={styles.info}>
                  Frequency: {feed.frequencyNumber} {feed.frequencyUnit}
                </Text>
                <Text style={styles.info}>
                  Times: {feed.timesOfDay.join(", ")}
                </Text>
                {feed.instructions && (
                  <Text style={styles.info}>
                    Instructions: {feed.instructions}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.info}>No feeding schedule added yet.</Text>
          )}

          {/* Add New Feeding Schedule */}
          <Text style={styles.info}>Food Type:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Kibble"
            placeholderTextColor="#999"
            value={foodType}
            onChangeText={setFoodType}
          />

          <Text style={styles.info}>Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1 cup"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.info}>Frequency Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={frequencyNumber}
            onChangeText={setFrequencyNumber}
          />

          <Text style={styles.info}>Frequency Unit:</Text>
          <Picker
            selectedValue={frequencyUnit}
            onValueChange={(itemValue) => setFrequencyUnit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Times per day" value="times per day" />
            <Picker.Item label="Times per week" value="times per week" />
          </Picker>

          <Text style={styles.info}>Times of Day (comma-separated):</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8:00 AM, 5:00 PM"
            placeholderTextColor="#999"
            value={timesOfDay}
            onChangeText={setTimesOfDay}
          />

          <Text style={styles.info}>Instructions:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mix with water"
            placeholderTextColor="#999"
            value={feedInstructions}
            onChangeText={setFeedInstructions}
          />

          <Button
            title="Add Feeding Schedule"
            onPress={async () => {
              if (!foodType || !amount || !frequencyNumber || !timesOfDay) {
                alert("Please fill in all feeding details");
                return;
              }

              const newFeeding = {
                foodType,
                amount,
                frequencyNumber,
                frequencyUnit,
                timesOfDay: timesOfDay.split(",").map((t) => t.trim()),
                instructions: feedInstructions,
              };

              const updatedFeedingSchedule = petData.logs?.feedingSchedule
                ? [...petData.logs.feedingSchedule, newFeeding]
                : [newFeeding];

              const updatedPet = {
                ...petData,
                logs: {
                  ...petData.logs,
                  feedingSchedule: updatedFeedingSchedule,
                },
              };

              await updatePetInStorage(updatedPet);

              console.log("✅ Feeding schedule updated!");

              // Schedule notifications for each time
              newFeeding.timesOfDay.forEach(async (time) => {
                const [hourStr, minuteStr] = time.split(":");
                let hour = parseInt(hourStr.trim());
                let minute = 0;

                if (time.toLowerCase().includes("pm") && hour < 12) {
                  hour += 12;
                }
                if (time.toLowerCase().includes("am") && hour === 12) {
                  hour = 0;
                }

                if (time.includes(":")) {
                  const minuteMatch = time.match(/:(\d+)/);
                  if (minuteMatch) {
                    minute = parseInt(minuteMatch[1]);
                  }
                }

                console.log(
                  `🔔 Scheduling feeding notification at ${hour}:${minute}`
                );

                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "🍽️ Feeding Reminder",
                    body: `It's time to feed ${petData.name}: ${newFeeding.amount} of ${newFeeding.foodType}`,
                  },
                  trigger: {
                    hour,
                    minute,
                    repeats: true,
                  },
                });
              });

              console.log("✅ Feeding reminders scheduled!");

              // Clear form
              setFoodType("");
              setAmount("");
              setFrequencyNumber("");
              setFrequencyUnit("times per day");
              setTimesOfDay("");
              setFeedInstructions("");
            }}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight Tracker</Text>

            <Text style={styles.info}>Enter Weight:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 45.5"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />

            <Text style={styles.info}>Select Unit:</Text>
            <Picker
              selectedValue={weightUnit}
              onValueChange={(itemValue) => setWeightUnit(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Pounds (lbs)" value="lbs" />
              <Picker.Item label="Kilograms (kg)" value="kg" />
            </Picker>

            <Button
              title={`Select Date (${weightDate.toISOString().split("T")[0]})`}
              onPress={() => setShowWeightDatePicker(true)}
            />

            {showWeightDatePicker && (
              <DateTimePicker
                value={weightDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowWeightDatePicker(false);
                  if (selectedDate) setWeightDate(selectedDate);
                }}
              />
            )}

            <Button title="Add Weight Entry" onPress={handleAddWeight} />

            {weightHistory.length > 1 && (
              <LineChart
                data={{
                  labels: sortedWeightHistory.map((entry) => entry.date),
                  datasets: [
                    {
                      data: sortedWeightHistory.map((entry) => entry.weight),
                    },
                  ],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#1E2923",
                  backgroundGradientTo: "#08130D",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
                }}
                style={{ marginVertical: 20, borderRadius: 16 }}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FAF3E0", // soft cream
    minHeight: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F4A261", // warm orange
    marginBottom: 10,
    fontFamily: "Poppins-Bold", // optional if you load fonts
  },
  subtitle: {
    fontSize: 20,
    color: "#2A9D8F", // teal
    marginBottom: 20,
    fontFamily: "Quicksand-Regular",
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#2A9D8F",
  },
  section: {
    backgroundColor: "#fff", // white cards
    width: "100%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E76F51", // coral
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontFamily: "Quicksand-Regular",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Quicksand-Regular",
  },
  picker: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  medBox: {
    backgroundColor: "#FAF3E0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#E76F51",
    borderWidth: 1,
  },
});
