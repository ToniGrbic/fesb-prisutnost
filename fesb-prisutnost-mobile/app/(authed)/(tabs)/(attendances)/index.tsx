import { HStack } from "@/components/HStack";
import { Text } from "@/components/Text";
import { VStack } from "@/components/VStack";
import { attendanceService } from "@/services/attendances";
import { Attendance } from "@/types/attendance";
import { useFocusEffect } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";

export default function AttendanceScreen() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  function onGoToAttendancePage(id: number) {
    router.push(`/(attendances)/attendance/${id}`);
  }

  async function fetchAttendances() {
    try {
      setIsLoading(true);
      const response = await attendanceService.getAll();
      setAttendances(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch attendances");
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAttendances();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({ headerTitle: "QR kodovi" });
  }, [navigation]);

  return (
    <VStack flex={1} p={20} pb={0} gap={20}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} bold>
          {attendances.length} kodova
        </Text>
      </HStack>

      <FlatList
        keyExtractor={({ id }) => id.toString()}
        data={attendances}
        onRefresh={fetchAttendances}
        refreshing={isLoading}
        renderItem={({ item: attendance }) => (
          <TouchableOpacity
            disabled={attendance.entered}
            onPress={() => onGoToAttendancePage(attendance.id)}
          >
            <VStack
              gap={20}
              h={120}
              key={attendance.id}
              style={{ opacity: attendance.entered ? 0.5 : 1 }}
            >
              <HStack>
                <VStack
                  h={120}
                  w={"69%"}
                  p={20}
                  justifyContent="space-between"
                  style={{
                    backgroundColor: "white",
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <HStack alignItems="center">
                    <Text fontSize={22} bold>
                      {attendance.event.name}
                    </Text>
                    <Text fontSize={22} bold>
                      {" "}
                      |{" "}
                    </Text>
                    <Text fontSize={16} bold>
                      {attendance.event.location}
                    </Text>
                  </HStack>
                  <Text fontSize={12}>
                    {new Date(attendance.event.date).toLocaleString()}
                  </Text>
                </VStack>

                <VStack
                  h={110}
                  w={"1%"}
                  style={{
                    alignSelf: "center",
                    borderColor: "lightgray",
                    borderWidth: 2,
                    borderStyle: "dashed",
                  }}
                />

                <VStack
                  h={120}
                  w={"29%"}
                  justifyContent="center"
                  alignItems="center"
                  style={{
                    backgroundColor: "white",
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                >
                  <Text fontSize={16} bold>
                    {attendance.entered ? "Used" : "Available"}
                  </Text>
                  {attendance.entered && (
                    <Text mt={12} fontSize={10}>
                      {new Date(attendance.updatedAt).toLocaleString()}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </VStack>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <VStack h={20} />}
      />
    </VStack>
  );
}
