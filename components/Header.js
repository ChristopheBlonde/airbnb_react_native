import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Header = ({ size, title }) => {
  return (
    <View style={size === "large" ? styles.viewHeader : styles.viewHeaderSmall}>
      <Image
        style={size === "large" ? styles.logoLarge : styles.logoSmall}
        source={require("../assets/images/logo_airbnb.png")}
      />
      <Text
        style={size === "large" ? styles.textHeader : styles.textHeaderSmall}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewHeader: { alignItems: "center", marginTop: 10, marginBottom: 50 },
  viewHeaderSmall: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderBottomWidth: 1,
    borderColor: "#B0B0B0",
    flexDirection: "row",
  },
  logoLarge: { width: 200, height: 200 },
  logoSmall: {
    width: 50,
    height: 50,
  },
  textHeader: { fontSize: 30, fontWeight: "bold", color: "#B0B0B0" },
  textHeaderSmall: { fontSize: 20, fontWeight: "bold", color: "#B0B0B0" },
});

export default Header;
