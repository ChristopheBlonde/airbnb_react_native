import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";

import Header from "../components/Header";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showIndicatorText, setShowIndicatorText] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const idUserStorage = async (id) => {
    try {
      await AsyncStorage.setItem("userInfo", id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setShowIndicatorText(true);
    } else {
      setDisableBtn(true);
      setShowIndicatorText(false);
      const data = {
        email: email,
        password: password,
      };
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          data
        );
        if (response.status === 200) {
          alert(`Thanks ${response.data.username} your are connected`);
          idUserStorage(response.data.id);
          setDisableBtn(false);
          setToken(response.data.token);
        }
      } catch (error) {
        console.log(error.response.data);
        alert("User not found");
        setDisableBtn(false);
      }
    }
  };
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <KeyboardAwareScrollView>
            <Header size="large" title="Sign In" />
            <View>
              <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                placeholder="email"
                onChangeText={(text) => setEmail(text)}
              />
              <View flexDirection="row" style={styles.viewInputPass}>
                <TextInput
                  style={styles.inputPass}
                  autoCapitalize="none"
                  secureTextEntry={hidePassword}
                  placeholder="password"
                  onChangeText={(text) => setPassword(text)}
                />
                {hidePassword ? (
                  <FontAwesome5
                    style={styles.iconPass}
                    name="eye"
                    size={24}
                    color="black"
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                ) : (
                  <FontAwesome5
                    style={styles.iconPass}
                    name="eye-slash"
                    size={24}
                    color="black"
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View alignItems="center" marginTop={90}>
            {showIndicatorText ? (
              <Text style={styles.textIndicator}>Please fill all fields</Text>
            ) : null}
            {disableBtn ? (
              <ActivityIndicator
                size="large"
                color="red"
                style={{ marginBottom: 30 }}
              />
            ) : (
              <TouchableOpacity
                disabled={disableBtn}
                onPress={handleSubmit}
                style={styles.btnSignIn}
              >
                <Text style={styles.btnText}>Sign in</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.linkToggle}>No account ? Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "red",
    borderBottomWidth: 1,
    padding: 10,
    marginHorizontal: 40,
    marginBottom: 30,
  },
  btnSignIn: {
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 30,
    width: 200,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  btnText: { fontSize: 18, color: "#B0B0B0", fontWeight: "bold" },
  textIndicator: { color: "red" },
  inputPass: { padding: 10, flex: 1 },
  viewInputPass: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    height: 35,
    marginHorizontal: 40,
  },
  iconPass: { marginTop: 5, marginRight: 10 },
  linkToggle: { color: "#8D8D8D", marginBottom: 30 },
});
