import React, { useCallback, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../components/Header";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ setToken }) {
  const { params } = useRoute();
  const { id, token } = params;

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.photo) {
          setAvatar(response.data.photo);
        }
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleImagePicked = useCallback(async (result) => {
    let uploadResponse;
    try {
      if (!result.cancelled) {
        const uri = result.uri;
        const uriArr = uri.split(".");
        const extention = uriArr[uriArr.length - 1];

        const data = new FormData();

        data.append("photo", {
          uri,
          name: `photo.${extention}`,
          type: `image/${extention}`,
        });
        uploadResponse = await axios.put(
          "https://express-airbnb-api.herokuapp.com/user/upload_picture",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (
          Array.isArray(uploadResponse.data.photo) === true &&
          uploadResponse.data.photo.length > 0
        ) {
          setAvatar(uploadResponse.data.photo[0].url);
          setUploading(null);
        }
      }
    } catch (error) {
      console.log(error.message);
      alert("uploading failed, sorry :(");
    }
  });

  const uploadImageFromLibrary = async () => {
    try {
      const permissionMediaLibrary =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionMediaLibrary.status === "granted") {
        const pictureResult = await ImagePicker.launchImageLibraryAsync();
        setUploading(pictureResult);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadFromCamera = async () => {
    try {
      const permissionCamera =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionCamera.status === "granted") {
        const pictureResult = await ImagePicker.launchCameraAsync();
        setUploading(pictureResult);
      } else {
        alert("no picture taken");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (uploading) {
        handleImagePicked(uploading);
      }
      if (email || description || userName) {
        const dataToUplaod = {};
        if (email) {
          dataToUplaod.email = email;
        } else {
          dataToUplaod.email = data.email;
        }
        if (description) {
          dataToUplaod.description = description;
        } else {
          dataToUplaod.description = data.description;
        }
        if (userName) {
          dataToUplaod.username = userName;
        }
        const response = await axios.put(
          "https://express-airbnb-api.herokuapp.com/user/update",
          dataToUplaod,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };
  return isLoading ? (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="red" />
    </View>
  ) : (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <KeyboardAwareScrollView>
          <View style={styles.safeArea}>
            <Header />
            <View style={styles.imageView}>
              <View style={styles.imageContainer}>
                {avatar || uploading ? (
                  <Image
                    style={styles.avatar}
                    source={
                      uploading
                        ? { uri: uploading.uri }
                        : { uri: avatar[0].url }
                    }
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="account-tie"
                    size={150}
                    color="lightgrey"
                  />
                )}
              </View>
              <View style={styles.iconAvatar}>
                <MaterialIcons
                  onPress={uploadImageFromLibrary}
                  name="photo-library"
                  size={30}
                  color="grey"
                />
                <MaterialIcons
                  onPress={uploadFromCamera}
                  name="photo-camera"
                  size={30}
                  color="grey"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputUpdate}
                placeholder={data.email}
                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                style={styles.inputUpdate}
                placeholder={data.username}
                onChangeText={(text) => setUserName(text)}
              />
              <View style={styles.inputArea}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder={data.description}
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
            </View>
            <View style={styles.btnView}>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setToken(null)}
              >
                <Text style={styles.btnText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  indicator: { justifyContent: "center", alignItems: "center", flex: 1 },
  safeArea: { flex: 1, marginBottom: 80 },
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 200,
    marginTop: 50,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 100,
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { height: "100%", width: "100%", borderRadius: 100 },
  iconAvatar: {
    justifyContent: "space-around",
    height: "100%",
  },
  inputContainer: { marginTop: 50 },
  inputUpdate: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    padding: 10,
    marginHorizontal: 40,
    marginBottom: 20,
  },
  inputArea: {
    borderWidth: 1,
    borderColor: "red",
    paddingHorizontal: 10,
    marginHorizontal: 40,
    height: 120,
  },
  btnView: { alignItems: "center", marginTop: 50 },
  btn: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  btnText: { fontSize: 18 },
});
