import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Header from "../components/Header";

export default function AroundScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState({});
  const [denied, setDenied] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    try {
      const getAuthorization = async () => {
        const response = await Location.requestForegroundPermissionsAsync();
        if (response.status === "granted") {
          const location = await Location.getCurrentPositionAsync();
          setCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setDenied(false);
          return coords;
        } else {
          setIsLoading(false);
          setDenied(true);
        }
      };
      getAuthorization();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
      );
      const rooms = [];
      response.data.forEach((elem) => {
        rooms.push({
          id: elem._id,
          latitude: elem.location[1],
          longitude: elem.location[0],
          title: elem.title,
        });
      });
      setData(rooms);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (coords) {
      fetchData();
    }
  }, [coords]);

  const handleAllRooms = async () => {
    try {
      const response = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms/around"
      );
      const rooms = [];
      response.data.forEach((elem) => {
        rooms.push({
          id: elem._id,
          latitude: elem.location[1],
          longitude: elem.location[0],
          title: elem.title,
        });
      });
      setData(rooms);
      setDenied(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : denied ? (
    <View style={styles.indicator}>
      <TouchableOpacity
        style={styles.btnDenied}
        onPress={() => navigation.navigate({ name: "Home" })}
      >
        <Text style={styles.textBtnDenied}>
          Access location denied press to return home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnDenied} onPress={handleAllRooms}>
        <Text style={styles.textBtnDenied}>Voir toutes les annonces</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <View style={styles.indicator}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coords.latitude || 48.855617,
            longitude: coords.longitude || 2.360023,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation
        >
          {data.map((marker) => {
            return (
              <MapView.Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
              />
            );
          })}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  indicator: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  map: { width: width, height: 400 },
  btnDenied: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 15,
  },
  textBtnDenied: { color: "white", fontSize: 18 },
});
