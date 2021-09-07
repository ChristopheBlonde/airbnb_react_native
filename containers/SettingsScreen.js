import React, { useEffect, useState } from "react";
import { Button, Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation, setToken }) {
  const [userId, setUserId] = useState();
  const [userToken, setUserToken] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfo = async () => {
      try {
        const id = await AsyncStorage.getItem("userInfo");
        const token = await AsyncStorage.getItem("userToken");
        setUserId(id);
        setUserToken(token);
      } catch (error) {
        console.log(error.message);
      }
    };
    userInfo();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <View>
      <ActivityIndicator />
    </View>
  ) : (
    <View>
      <Text>Hello Settings</Text>

      <Button
        title="My profile"
        onPress={() =>
          navigation.navigate("Profile", { id: userId, token: userToken })
        }
      />

      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
        }}
      />
    </View>
  );
}
