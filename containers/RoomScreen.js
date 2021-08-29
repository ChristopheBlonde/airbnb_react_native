import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/core";

export default function RoomScreen() {
  // const { params } = useRoute();
  return (
    <SafeAreaView>
      <View>
        <Text>Page Room</Text>
      </View>
    </SafeAreaView>
  );
}
