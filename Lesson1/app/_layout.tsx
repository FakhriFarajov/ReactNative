import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack >
    <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
    <Stack.Screen name="auth/auth" options={{ title: "Auth", headerShown: false }} />
    <Stack.Screen name="auth/register" options={{ title: "Register", headerShown: false }} />
    <Stack.Screen name="profile-settings" options={{ title: "Profile", headerShown: false }} />
    <Stack.Screen name="checkoutMethod" options={{ title: "checkoutMethod", headerShown: false }} />
    <Stack.Screen name="cardInfo" options={{ title: "Card Info", headerShown: false }} />
    <Stack.Screen name="orderConfirmed" options={{ title: "Order Confirmed", headerShown: false }} />
    <Stack.Screen name="productDescription" options={{ title: "Product Description", headerShown: false }} />

    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  </Stack>;
}