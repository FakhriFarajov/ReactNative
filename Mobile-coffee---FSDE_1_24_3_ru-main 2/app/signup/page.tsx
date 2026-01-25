import { Image } from "expo-image";

import Button from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUpSchema, SignUpSchemaType } from "./sign-up.schema";

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log("onSubmit");
    console.log(data);
    try {
      // Get existing users
      const usersJson = await AsyncStorage.getItem("users");
      let users = usersJson ? JSON.parse(usersJson) : [];
      // Add new user
      users.push(data);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      // Optionally set current user and login state
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("user", JSON.stringify(data));
      router.push("/(tabs)/home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    router.replace("/");
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable onPress={handleBack}>
            <Ionicons name="chevron-back" size={22} color="white" />
          </Pressable>
          <ScrollView>
            <View style={styles.header}>
              <Image
                source={require("@/assets/images/cup.png")}
                style={styles.logo}
                contentFit="contain"
              />
              <View style={styles.brandRow}>
                <Text style={styles.brandCoffee}>Coffee</Text>
                <Text style={styles.brandShop}>Shop</Text>
              </View>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="John"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                )}
              />
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="surname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Doe"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                )}
              />
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="admin@gmail.com"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="***********"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    secureTextEntry
                    style={styles.input}
                  />
                )}
              />
              <TouchableOpacity onPress={() => router.push("/signin/page")}>
                <Text style={{ color: "white" }}>Don't have an account? Sign in</Text>
              </TouchableOpacity>
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
              <Button onPress={handleSubmit(onSubmit)}>SignUp</Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F1720",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    gap: 10,
  },
  logo: {
    width: 110,
    height: 110,
    opacity: 0.9,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  brandCoffee: {
    fontSize: 30,
    letterSpacing: 0.5,
    color: "#9A6A3A",
    fontWeight: "600",
  },
  brandShop: {
    fontSize: 30,
    letterSpacing: 0.5,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  form: {
    gap: 16,
    marginTop: 10,
  },
  input: {
    height: 54,
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  error: {
    color: "#FF6B6B",
    fontSize: 13,
    marginTop: -12,
    marginBottom: 4,
  },
  button: {
    height: 54,
    borderRadius: 10,
    backgroundColor: "#8B5A2B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5A2B",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
