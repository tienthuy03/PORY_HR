import { Dimensions, StyleSheet } from "react-native";

export const home = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height / 3,
    position: "absolute",
    top: -30,
  },
  over: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height / 3,
    // backgroundColor: 'rgba(1,35,100, 0.6)',
    position: "absolute",
    paddingBottom: 40,
  },
  boxI: {
    borderRadius: 12,
    overflow: "hidden",
    width: 60,
    height: 60,
    backgroundColor: "white",
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 70,
  },
  image: {
    width: 160,
    height: 25,
  },
  itemContainer: {
    width: 350,
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    marginRight: 20,
    marginLeft: 20,
    resizeMode: "cover",
  },
  linearGradient: {
    flex: 1,
    flexDirection: "column",
  },
});
