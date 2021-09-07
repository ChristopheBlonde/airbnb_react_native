import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/core";
import axios from "axios";
import RoomDetails from "../components/RoomDetails";
import Header from "../components/Header";

export default function RoomScreen() {
  const { params } = useRoute();

  const id = params.id;

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View
      style={{ alignItems: "center", justifyContent: "center", height: "100%" }}
    >
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <RoomDetails data={data} />
    </SafeAreaView>
  );
}
