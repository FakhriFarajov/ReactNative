import Button from "@/components/ui/button";
import { layoutTheme } from "@/constant/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paymentSchema, PaymentSchema } from "./billingInfo.schema";

export default function BillingForm() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);

  const [cardImage, setCardImage] = useState<string | null>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolderName: "",
      expiry: "",
      cvv: "",
      cardImage: "",
    },
  });

  /* =========================
     LOAD DATA (FIXED)
  ========================== */
  const loadFormData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("billingInfo");
      if (!storedData) return;

      const parsedData = JSON.parse(storedData);

      reset({
        cardNumber: parsedData.cardNumber || "",
        cardHolderName: parsedData.cardHolderName || "",
        expiry: parsedData.expiry || "",
        cvv: parsedData.cvv || "",
        cardImage: parsedData.cardImage || "",
      });

      setCardImage(parsedData.cardImage || null);
    } catch (error) {
      console.error("Error loading billing info:", error);
    }
  };

  useEffect(() => {
    loadFormData();
  }, []);

  /* =========================
     SAVE DATA
  ========================== */
  const saveFormData = async (data: PaymentSchema) => {
    try {
      const formData = { ...data, cardImage };
      await AsyncStorage.setItem("billingInfo", JSON.stringify(formData));
      Alert.alert("Success", "Billing information saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save billing information.");
      console.error(error);
    }
  };

  /* =========================
     IMAGE PICKER
  ========================== */
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission not granted to access media library");
            return
        }

        Alert.alert("Upload Cupon Photo", "Choose an option", [
            {
                text: "Take a photo",
                onPress: async () => {
                    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
                    if (cameraPermission.granted) {
                        const image = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        })

                        if (!image.canceled) {
                            setCardImage(image.assets[0].uri);
                            setValue("cardImage", image.assets[0].uri);
                        }
                    }
                }
            },
            {
                text: "Choose from library",
                onPress: async () => {
                    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (libraryPermission.granted) {
                        const image = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        })
                        if (!image.canceled) {
                            setCardImage(image.assets[0].uri);
                            setValue("cardImage", image.assets[0].uri);
                        }
                    }
                }
            },
            {
                text: "Cancel",
                style: "cancel",
            },
        ],
            { cancelable: true })
    }

  /* =========================
     SUBMIT
  ========================== */
  const onSubmit = async (data: PaymentSchema) => {
    if (!cardImage) {
      Alert.alert("Error", "Please upload a card image");
      return;
    }
    await saveFormData(data);
  };

  return (
    <View style={styles.container}>
      {/* Card Number */}
      <Controller
        control={control}
        name="cardNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber && styles.inputError]}
              value={value}
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={19}
              onBlur={onBlur}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, "");
                const formatted =
                  cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
                onChange(formatted);
              }}
            />
            {errors.cardNumber && (
              <Text style={styles.errorText}>
                {errors.cardNumber.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Card Holder */}
      <Controller
        control={control}
        name="cardHolderName"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput
              style={[styles.input, errors.cardHolderName && styles.inputError]}
              value={value}
              placeholder="Abdur Rohim Mia"
              onChangeText={(text) =>
                onChange(text.replace(/[^a-zA-Z\s]/g, ""))
              }
            />
            {errors.cardHolderName && (
              <Text style={styles.errorText}>
                {errors.cardHolderName.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Expiry + CVV */}
      <View style={styles.inputWrapperRow}>
        <Controller
          control={control}
          name="expiry"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Expiry</Text>
              <TextInput
                style={[styles.input, errors.expiry && styles.inputError]}
                value={value}
                keyboardType="numeric"
                maxLength={5}
                placeholder="MM/YY"
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, "");
                  const formatted =
                    cleaned.length >= 2
                      ? cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
                      : cleaned;
                  onChange(formatted);
                }}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="cvv"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputHalf}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={[styles.input, errors.cvv && styles.inputError]}
                value={value}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                placeholder="123"
                onChangeText={onChange}
              />
            </View>
          )}
        />
      </View>

      {/* Card Image */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Upload Card Photo</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
          {cardImage || watch("cardImage") ? (
            <Image
              source={{ uri: cardImage || watch("cardImage") }}
              style={styles.uploadedImage}
            />
          ) : (
            <Ionicons name="camera" size={60} color="#C4C4C4" />
          )}
        </TouchableOpacity>
      </View>

      <Button onPress={handleSubmit(onSubmit)}>Save info</Button>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const getStyles = (colorScheme: string) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16 },
    inputWrapper: { marginBottom: 24 },
    inputWrapperRow: { flexDirection: "row", gap: 16 },
    inputHalf: { flex: 1 },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 10,
      fontSize: 16,
      borderColor:
        colorScheme === "dark"
          ? layoutTheme.colors.neutral.dark
          : layoutTheme.colors.neutral.light,
    },
    inputError: {
      borderColor: layoutTheme.colors.text.error,
    },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    errorText: {
      color: layoutTheme.colors.text.error,
      fontSize: 12,
      marginTop: 4,
    },
    uploadArea: {
      height: 200,
      borderRadius: 12,
      backgroundColor: "#F5F5F5",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    uploadedImage: {
      width: "100%",
      height: "100%",
    },
  });
