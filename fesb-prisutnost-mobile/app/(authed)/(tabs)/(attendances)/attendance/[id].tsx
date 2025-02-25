import { Text } from "@/components/Text";
import { VStack } from "@/components/VStack";
import { attendanceService } from "@/services/attendances";
import { Attendance } from "@/types/attendance";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";

export default function AttendanceDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [qrcode, setQrcode] = useState<string | null>(null);

  async function fetchAttendance() {
    try {
      const { data } = await attendanceService.getOne(Number(id));
      setAttendance(data.attendance);
      setQrcode(data?.qrcode);
    } catch (error) {
      router.back();
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({ headerTitle: "" });
  }, [navigation]);

  if (!attendance) return null;

  return (
    <VStack
      alignItems="center"
      m={20}
      p={20}
      gap={20}
      flex={1}
      style={{
        backgroundColor: "white",
        borderRadius: 20,
      }}
    >
      <Text fontSize={50} bold>
        {attendance.event.name}
      </Text>
      <Text fontSize={20} bold>
        {attendance.event.location}
      </Text>
      <Text fontSize={16} color="gray">
        {new Date(attendance.event.date).toLocaleString()}
      </Text>

      <Image
        style={{ borderRadius: 20 }}
        width={300}
        height={300}
        source={{ uri: `data:image/png;base64,${qrcode}` }}
      />
    </VStack>
  );
}
