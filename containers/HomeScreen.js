import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import Header from "../components/Header";

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
        // console.log(response.data);
        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const ratingValue = (num) => {
    let result = [];
    for (let i = 0; i < 5; i++) {
      if (i < num) {
        result.push(<Entypo key={i} name="star" size={24} color="gold" />);
      } else {
        result.push(<Entypo key={i} name="star" size={24} color="#BBBCBB" />);
      }
    }
    return result;
  };
  return isLoading ? (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color="red" size="large" />
    </SafeAreaView>
  ) : (
    <SafeAreaView>
      <Header />

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={navigation.navigate("Room", { id: item._id })}
          >
            <View style={styles.viewFlat}>
              <View style={styles.viewPrice}>
                <Text style={styles.price}>{item.price + " €"}</Text>
              </View>
              <Image
                style={styles.photo}
                source={{ uri: item.photos[0].url }}
              />

              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.title}
                  </Text>
                  <Image
                    style={styles.photoProfile}
                    source={{ uri: item.user.account.photo.url }}
                  />
                </View>

                <View flexDirection="row" alignItems="flex-end">
                  {ratingValue(Number(item.ratingValue))}
                  <Text style={styles.textReviews}>
                    {" "}
                    {item.reviews} reviews
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => String(item._id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  photo: { height: 200 },
  viewFlat: {
    position: "relative",
    marginHorizontal: 15,
  },
  viewPrice: {
    height: 50,
    width: 100,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 140,
    left: 20,
    zIndex: 99,
  },
  price: { fontSize: 24, color: "white" },
  textReviews: { color: "#BBBCBB", fontSize: 12 },
  photoProfile: { width: 70, height: 70, borderRadius: 50 },
  title: { fontSize: 24 },
});
