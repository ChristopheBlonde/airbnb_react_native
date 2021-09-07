import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function RoomCard({ item }) {
  const navigation = useNavigation();
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

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Room", { id: item._id })}
    >
      <View style={styles.viewFlat}>
        <View style={styles.viewPrice}>
          <Text style={styles.price}>{item.price + " €"}</Text>
        </View>
        <Image style={styles.photo} source={{ uri: item.photos[0].url }} />

        <View style={styles.viewInfo}>
          <View style={{ flex: 4 }}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {ratingValue(Number(item.ratingValue))}
              <Text style={styles.textReviews}> {item.reviews} reviews</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Image
              style={styles.photoProfile}
              source={{ uri: item.user.account.photo.url }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  photo: { height: 200 },
  viewFlat: {
    position: "relative",
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomColor: "#BBBCBB",
    borderBottomWidth: 1,
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
  viewInfo: { marginVertical: 10, flexDirection: "row" },
});
