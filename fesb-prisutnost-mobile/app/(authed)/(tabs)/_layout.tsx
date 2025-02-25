import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ComponentProps } from "react";
import { Text } from "react-native";

export default function TabLayout() {
  const { user } = useAuth();

  const tabs = [
    {
      showFor: [UserRole.Attendee, UserRole.Manager],
      name: "(events)",
      displayName: "Predavanja",
      icon: "calendar",
      options: {
        headerShown: false,
      },
    },
    {
      showFor: [UserRole.Attendee],
      name: "(attendances)",
      displayName: "Moji QR kodovi",
      icon: "qr-code",
      options: {
        headerShown: false,
      },
    },
    {
      showFor: [UserRole.Manager],
      name: "scan-attendance",
      displayName: "Skeniraj QR kod",
      icon: "scan",
      options: {
        headerShown: true,
      },
    },
    {
      showFor: [UserRole.Attendee, UserRole.Manager],
      name: "settings",
      displayName: "Postavke",
      icon: "cog",
      options: {
        headerShown: true,
      },
    },
  ];

  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            ...tab.options,
            headerTitle: tab.displayName,
            href: tab.showFor.includes(user?.role!) ? tab.name : null,
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? "black" : "gray", fontSize: 12 }}>
                {tab.displayName}
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={tab.icon as ComponentProps<typeof Ionicons>["name"]}
                color={focused ? "black" : "gray"}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
