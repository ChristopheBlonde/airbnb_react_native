import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator, SafeAreaView, FlatList } from "react-native";
import axios from "axios";

import Header from "../components/Header";
import RoomCard from "../components/RoomCard";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <ActivityIndicator color="red" size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView>
      <Header />
      <FlatList
        contentContainerStyle={{ paddingBottom: 90, marginTop: 10 }}
        data={data}
        renderItem={({ item }) => <RoomCard item={item} />}
        keyExtractor={(item) => String(item._id)}
      />
    </SafeAreaView>
  );
}
