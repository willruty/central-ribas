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
        // --- ESTILO DO CABEÇALHO (Top Navbar) ---
        headerStyle: {
          backgroundColor: "#08233e", // Azul escuro
          borderBottomWidth: 3,
          borderBottomColor: "#000",
          elevation: 0, // Remove sombra nativa do Android
          shadowOpacity: 0, // Remove sombra nativa do iOS
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "900",
          textTransform: "uppercase",
        },

        // --- ESTILO DA BARRA INFERIOR (Bottom Tab) ---
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 3,
          borderTopColor: "#000",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#FF3B3B",
        tabBarInactiveTintColor: "#000", 
        tabBarLabelStyle: {
          fontWeight: "900",
          textTransform: "uppercase",
          fontSize: 10,
          marginTop: 4,
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

      {/* ABA 2: SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar Documentos",
          tabBarLabel: "Buscar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search" color={color} />
          ),
        }}
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
