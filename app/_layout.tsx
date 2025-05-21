// app/_layout.tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      {/* Render the tabs layout without a header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* These screens will use the default header (with back button) */}
      <Stack.Screen name="add-pet" options={{ title: 'Add Pet' }} />
<Stack.Screen name="edit-pet" options={{ title: 'Edit Pet' }} />

      <Stack.Screen name="pet-profile" options={{ title: 'Pet Profile' }} />

    </Stack>
  );
}
