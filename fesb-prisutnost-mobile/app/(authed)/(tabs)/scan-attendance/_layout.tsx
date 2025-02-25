import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { VStack } from "@/components/VStack";
import { attendanceService } from "@/services/attendances";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { ActivityIndicator, Alert, Vibration } from "react-native";

export default function ScanAttendanceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);

  if (!permission) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size={"large"} />
      </VStack>
    );
  }

  if (!permission.granted) {
    return (
      <VStack gap={20} flex={1} justifyContent="center" alignItems="center">
        <Text>Potreban je pristup kameri za skeniranje</Text>
        <Button onPress={requestPermission}>Dopusti pristup kameri</Button>
      </VStack>
    );
  }

  async function onBarcodeScanned({ data }: BarcodeScanningResult) {
    if (!scanningEnabled) return;

    try {
      Vibration.vibrate();
      setScanningEnabled(false);

      const [attendance, owner] = data.split(",");
      const attendanceId = parseInt(attendance.split(":")[1]);
      const ownerId = parseInt(owner.split(":")[1]);

      await attendanceService.validateOne(attendanceId, ownerId);

      Alert.alert("Success", "Attendance validated successfully.", [
        { text: "Ok", onPress: () => setScanningEnabled(true) },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to validate attendance. Please try again.");
      setScanningEnabled(true);
    }
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      facing="back"
      onBarcodeScanned={onBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
    />
  );
}
