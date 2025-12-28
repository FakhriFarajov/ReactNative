import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Auth() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Image source={require("@/assets/images/coffee-cup-auth.png")}
          style={styles.image}
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={[styles.text, { color: '#854C1F', marginRight: 8 }]}>{"Coffee"}</Text>
          <Text style={styles.text}>{"Shop"}</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput placeholder="Email" style={styles.input} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Signin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#110c2aff",
    height: 40,
    width: "100%",
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    backgroundColor: "#192438",
  },
  formContainer: {
    width: "100%",
    padding: 10,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#854C1F",
    paddingVertical: 12,
    paddingHorizontal: 10,
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
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 180,
  }
});