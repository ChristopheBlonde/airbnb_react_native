import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { SwiperFlatList } from "react-native-swiper-flatlist";

export default function RoomDetails({ data }) {
  const [textVision, setTextVision] = useState(3);

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

  const textShow = () => {
    if (textVision === 3) {
      setTextVision(null);
    } else {
      setTextVision(3);
    }
  };

  const pictures = [];
  data.photos.forEach((elem) => pictures.push(elem.url));
  console.log(data.location);
  const markers = {
    id: 1,
    latitude: data.location[1],
    longitude: data.location[0],
    title: data.title,
  };

  return (
    <ScrollView>
      <View style={{ paddingBottom: 90 }}>
        <View style={styles.imageContainer}>
          <SwiperFlatList
            autoplay
            autoplayDelay={2}
            autoplayLoop
            index={2}
            showPagination
            data={pictures}
            renderItem={({ item }) => (
              <ImageBackground style={styles.image} source={{ uri: item }}>
                <View style={styles.viewContainer}>
                  <Text style={styles.priceRoom}>{data.price} €</Text>
                </View>
              </ImageBackground>
            )}
          />
        </View>
        <View style={styles.roomDetails}>
          <View style={styles.roomInfo}>
            <Text numberOfLines={1} style={styles.title}>
              {data.title}
            </Text>
            <View style={styles.stars}>{ratingValue(data.ratingValue)}</View>
          </View>
          <View>
            <Image
              style={styles.imageIcon}
              source={{ uri: data.user.account.photo.url }}
            />
          </View>
        </View>
        <Text numberOfLines={textVision} style={styles.description}>
          {data.description}
        </Text>
        <TouchableOpacity style={styles.btnShow} onPress={() => textShow()}>
          <Text style={styles.showText}>Show more</Text>
          {textVision === 3 ? (
            <Entypo name="chevron-down" size={24} color="#BBBCBB" />
          ) : (
            <Entypo name="chevron-up" size={24} color="#BBBCBB" />
          )}
        </TouchableOpacity>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.viewMap}
            initialRegion={{
              latitude: 48.8566614,
              longitude: 2.3522219,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            showsUserLocation
          >
            <MapView.Marker
              key={markers.id}
              coordinate={{
                latitude: markers.latitude,
                longitude: markers.longitude,
              }}
              title={markers.title}
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  viewContainer: {
    width: 120,
    height: 50,
    backgroundColor: "black",
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  priceRoom: { color: "white", fontSize: 24 },
  image: {
    width: width,
    height: 300,
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  roomDetails: { flexDirection: "row", marginHorizontal: 20 },
  roomInfo: { flex: 4 },
  title: { fontSize: 20 },
  stars: { flexDirection: "row" },
  imageIcon: { height: 70, width: 70, borderRadius: 50 },
  description: { marginHorizontal: 20, marginVertical: 10 },
  btnShow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  showText: {
    color: "#BBBCBB",
    fontSize: 14,
    marginLeft: 20,
  },
  container: { flex: 1, backgroundColor: "white" },

  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  viewMap: { width: width, height: 400 },
});
