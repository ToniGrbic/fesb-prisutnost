import { Stack } from 'expo-router';

export default function TicketsLayout() {
  return (
    <Stack screenOptions={ { headerBackTitle: "QR kodovi" } }>
      <Stack.Screen name="index" />
      <Stack.Screen name="ticket/[id]" />
    </Stack>
  );
}
