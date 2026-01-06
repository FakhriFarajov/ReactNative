import { Image } from "expo-image";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/coffee-cup.png")}
          style={styles.image}
        />
      </View>
      <View style={{ gap: 10, width: "100%", alignContent: "center", alignItems: "center", marginBottom: 20 }}>
        <Text
          style={{ textAlign: "center", width: "100%", marginBottom: 20, fontSize: 30,color: "white" }}
          numberOfLines={3}
        >
          {"Enjoy quality brew\nwith the finest of\nflavours"}
        </Text>
        <Text style={{ color: "white", fontSize: 15, textAlign: "center", width: "100%" }} numberOfLines={3}>
          {"The best gain, the finest roast, the\npowerful flavor."}
        </Text>
        <Pressable
          onPress={() => router.push("/auth/auth")}
          style={styles.button}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#192438",
  },
  formContainer: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#854C1F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    shadowColor: '#ffaa00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 25,
    borderRadius: 180,
    padding: 8,
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 180,
  }
});