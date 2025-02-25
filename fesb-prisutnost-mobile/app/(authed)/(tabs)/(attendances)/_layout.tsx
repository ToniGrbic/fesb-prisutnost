import { Stack } from "expo-router";

export default function AttendancesLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "QR kodovi" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="attendance/[id]" />
    </Stack>
  );
}
