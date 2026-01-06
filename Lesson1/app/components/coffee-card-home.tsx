import React, { useState } from "react";
import { Coffee } from "@/app/types/coffee-data-types";
import { Image } from "expo-image";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function CoffeeCard({ coffee, liked: likedProp, onLike, onUnlike }: { coffee: Coffee & { imageUrl?: string; category?: string }, liked?: boolean, onLike?: () => Promise<void> | void, onUnlike?: () => Promise<void> | void }) {
  const [likedLocal, setLikedLocal] = useState(false);
  const liked = typeof likedProp === 'boolean' ? likedProp : likedLocal;
  const toggleLike = async () => {
    if (typeof onLike === 'function' || typeof onUnlike === 'function') {
      try {
        if (liked) {
          await onUnlike?.()
        } else {
          await onLike?.()
        }
      } catch (e) { console.warn('like toggle failed', e) }
    } else {
      setLikedLocal(v => !v)
    }
  }
  const router = useRouter();


  const imageSource: any = (() => {
    const img = (coffee as any).imageUrl ?? (coffee as any).image;
    if (typeof img === 'string') {
      if (img.startsWith('http') || img.startsWith('data:')) return { uri: img };
      return img;
    }
    return img;
  })();
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={16} color="orange" />
            <Text style={{ color: "white", marginLeft: 6 }}>{coffee.rating}</Text>
          </View>

          <TouchableOpacity onPress={toggleLike} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#FF4C4C" : "white"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push({ pathname: '/productDescription', params: { id: String(coffee.id) } })} activeOpacity={0.9}>
          <Image source={imageSource} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.title}>{coffee.title}</Text>
        <Text style={styles.price}>$ {coffee.price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#110c2aff",
    flex: 1,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  cardContainer: {
    gap: 10,
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "white",
    fontSize: 10,
  },
  price: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
