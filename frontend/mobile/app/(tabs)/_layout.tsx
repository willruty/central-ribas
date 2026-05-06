import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

// Componente simples para os ícones da barra inferior
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#08233e",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.08)",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 16,
          letterSpacing: 0.3,
        },

        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      {/* ABA 1: HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Guindastes Ribas",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />

      {/* ABA 2: DOCUMENTOS */}
      <Tabs.Screen
        name="documentos"
        options={{
          title: "Meus Documentos",
          tabBarLabel: "Documentos",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text" color={color} />
          ),
        }}
      />

      {/* Oculta a rota search legada */}
      <Tabs.Screen
        name="search"
        options={{ href: null }}
      />

      {/* ABA 3: PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
