import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { SignInInput, signInSchema } from "../types/auth_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { login } from "@/services/api";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await login(data.email, data.password);
      console.log('login result', result);
      if (result) {
        AsyncStorage.setItem('user', JSON.stringify(result));
        router.replace('/(tabs)/home');
      } else {
        setErrorMsg('Invalid credentials');
      }
    } catch (err: any) {
      console.error('login error', err);
      setErrorMsg(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Email"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign in</Text>}
          </TouchableOpacity>

          {errorMsg ? <Text style={{ color: '#ff7b7b', textAlign: 'center', marginTop: 8 }}>{errorMsg}</Text> : null}

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 12 }}>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={{ color: 'white' }}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </View>
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
    color: "white",
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