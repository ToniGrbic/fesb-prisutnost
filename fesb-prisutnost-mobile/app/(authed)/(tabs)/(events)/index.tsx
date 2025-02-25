import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";
import { HStack } from "@/components/HStack";
import { Text } from "@/components/Text";
import { VStack } from "@/components/VStack";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/AuthContext";
import { attendanceService } from "@/services/attendances";
import { eventService } from "@/services/events";
import { Event } from "@/types/event";
import { UserRole } from "@/types/user";
import { useFocusEffect } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";

export default function EventsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  function onGoToEventPage(id: number) {
    if (user?.role === UserRole.Manager) {
      router.push(`/(events)/event/${id}`);
    }
  }

  async function buyAttendance(id: number) {
    try {
      await attendanceService.createOne(id);
      Alert.alert("Success", "QR kod uspješno generiran");
      fetchEvents();
    } catch (error) {
      Alert.alert("Error", "Neuspjelo generiranje QR koda");
    }
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Predavanja",
    });
  }, [navigation, user]);

  return (
    <VStack flex={1} p={20} pb={0} gap={20}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} bold>
          {events.length} Predavanja
        </Text>
        {user?.role === UserRole.Manager && headerRight()}
      </HStack>

      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        data={events}
        onRefresh={fetchEvents}
        refreshing={isLoading}
        ItemSeparatorComponent={() => <VStack h={20} />}
        renderItem={({ item: event }) => (
          <VStack
            gap={20}
            p={20}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
            }}
            key={event.id}
          >
            <TouchableOpacity onPress={() => onGoToEventPage(event.id)}>
              <HStack alignItems="center" justifyContent="space-between">
                <HStack alignItems="center">
                  <Text fontSize={26} bold>
                    {event.name}
                  </Text>
                  <Text fontSize={26} bold>
                    {" "}
                    |{" "}
                  </Text>
                  <Text fontSize={16} bold>
                    {event.location}
                  </Text>
                </HStack>
                {user?.role === UserRole.Manager && (
                  <TabBarIcon size={24} name="chevron-forward" />
                )}
              </HStack>
            </TouchableOpacity>

            <Divider />

            <HStack justifyContent="space-between">
              <Text bold fontSize={16} color="gray">
                Generirano: {event.totalAttendancesPurchased}
              </Text>
              <Text bold fontSize={16} color="green">
                Validirano: {event.totalAttendancesEntered}
              </Text>
            </HStack>

            {user?.role === UserRole.Attendee && (
              <VStack>
                <Button
                  variant="outlined"
                  disabled={isLoading}
                  onPress={() => buyAttendance(event.id)}
                >
                  Generiraj QR kod
                </Button>
              </VStack>
            )}

            <Text fontSize={13} color="gray">
              {event.date}
            </Text>
          </VStack>
        )}
      />
    </VStack>
  );
}

function headerRight() {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("pressed");
        router.push(`/(events)/new`);
      }}
    >
      <TabBarIcon size={32} name="add-circle-outline" />
    </TouchableOpacity>
  );
}
