import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Header from "../components/Header";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showIndicatorText, setShowIndicatorText] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [indicatorText, setIndicatorText] = useState("");

  const handleSubmit = async () => {
    if (!email || !username || !description || !password || !confirmPassword) {
      setIndicatorText("Please fill all fields");
      setShowIndicatorText(true);
    } else if (password !== confirmPassword) {
      setIndicatorText("Passwords must be the same");
      setShowIndicatorText(true);
    } else {
      setDisableBtn(true);
      setShowIndicatorText(false);
      const data = {
        email: email,
        username: username,
        description: description,
        password: password,
      };
      try {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          data
        );
        if (response.status === 200) {
          alert(
            `Thanks ${response.data.username} your account has been created`
          );
          setDisableBtn(false);
          setToken(response.data.token);
        }
      } catch (error) {
        setDisableBtn(false);
        setIndicatorText("username or email already exist");
        setShowIndicatorText(true);
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>
          <View>
            <Header size="large" title="Sign Up" />
            <View>
              <TextInput
                style={styles.textInput}
                placeholder="email"
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.textInput}
                placeholder="username"
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                style={styles.textInputArea}
                multiline
                numberOfLines={4}
                placeholder="Describe yourself in few words..."
                onChangeText={(text) => setDescription(text)}
              />
              <View flexDirection="row" style={styles.viewInputPass}>
                <TextInput
                  style={styles.inputPass}
                  placeholder="password"
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => setPassword(text)}
                  autoCapitalize="none"
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
              <View flexDirection="row" style={styles.viewInputPass}>
                <TextInput
                  style={styles.inputPass}
                  placeholder="confirm password"
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  autoCapitalize="none"
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
              <View alignItems="center">
                {showIndicatorText ? (
                  <Text style={styles.textIndicator}>{indicatorText}</Text>
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
                    style={styles.btnSignUp}
                  >
                    <Text style={styles.btnText}>Sign up</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View alignItems="center">
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <Text style={styles.linkToggle}>
                    Already have an account ? Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
  textInputArea: {
    borderWidth: 1,
    borderColor: "red",
    marginHorizontal: 40,
    padding: 10,
    height: 90,
    marginBottom: 30,
  },
  btnSignUp: {
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
    marginBottom: 30,
  },
  iconPass: { marginTop: 5, marginRight: 10 },
  linkToggle: { color: "#8D8D8D", marginBottom: 30 },
});
