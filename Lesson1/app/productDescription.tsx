import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import IonIcon from '@expo/vector-icons/Ionicons'
import { fetchProductById, Coffee_Config, addToCart } from '@/services/api'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ProductDescription() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<any | null>(null)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M')
  const sizes = ['S', 'M', 'L']
  const [liked, setLiked] = useState(false)
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const p = await fetchProductById(String(id))
      console.log('Fetched product by id', p)
      setProduct(p)
    } catch (e: any) {
      console.warn('fetchProductById failed', e)
      setError(e?.message ?? 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const title = product?.title ?? 'Product'
  const description = product?.description ?? 'Delicious coffee.'
  const price = product?.price ?? '0.00'

  const rawImage = product?.imageUrl ?? product?.image ?? null
  let imageSource: any
  if (typeof rawImage === 'string') {
    const uri = rawImage.startsWith('/') ? `${Coffee_Config.baseURL}${rawImage}` : rawImage
    imageSource = { uri }
  } else if (rawImage) {
    imageSource = rawImage
  } else {
    imageSource = require('@/assets/images/coffee-cup.png')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#192438" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IonIcon name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <IonIcon name={liked ? "heart" : "heart-outline"} size={24} color={liked ? "red" : "white"} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFB84D" style={{ marginTop: 24 }} />
        ) : error ? (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text style={{ color: 'white', marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity onPress={load} style={{ backgroundColor: '#FFB84D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 }}>
              <Text>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Image source={imageSource} style={styles.image} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginTop: 12 }}>Description</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.price}>$ {price}</Text>

            <View style={{ width: '100%', marginTop: 20 }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sizes}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                renderItem={({ item }) => {
                  const selected = item === selectedSize
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedSize(item as any)}
                      style={[styles.pill, selected ? styles.pillSelected : null]}
                      activeOpacity={0.8}
                    >
                      <Text style={selected ? styles.pillTextSelected : styles.pillText}>{item}</Text>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, adding ? { opacity: 0.7 } : null]}
              onPress={async () => {
                if (!product) return
                setAdding(true)
                try {
                  // Map size label to numeric size if needed; here keep 1 for S, 2 for M, 3 for L
                  const sizeMap: Record<string, number> = { S: 1, M: 2, L: 3 }
                  const sizeNum = sizeMap[selectedSize]
                  let userId: number | string = 1
                  try {
                    const raw = await AsyncStorage.getItem('user')
                    if (raw) {
                      const parsed = JSON.parse(raw)
                      if (parsed?.id) userId = parsed.id
                    }
                  } catch {}
                  await addToCart(product.id, 1, sizeNum, userId)
                  Alert.alert('Added', 'Product added to cart')
                } catch (e: any) {
                  console.warn('addToCart failed', e)
                  Alert.alert('Error', e?.message ?? 'Failed to add to cart')
                } finally {
                  setAdding(false)
                }
              }}
              disabled={adding}
            >
              <Text style={styles.addButtonText}>{adding ? 'Adding...' : 'Add to Cart'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#192438' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  content: { flex: 1, alignItems: 'center', padding: 20, alignSelf: 'center' },
  image: { width: 220, height: 220, resizeMode: 'contain' },
  description: { color: 'white', marginTop: 12, textAlign: 'center' },
  price: { color: '#FFB84D', marginTop: 8, fontWeight: '700', fontSize: 18 },
  pill: { backgroundColor: '#0f2730', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, marginRight: 8 },
  pillSelected: { backgroundColor: '#FFB84D' },
  pillText: { color: 'white', fontWeight: '700' },
  pillTextSelected: { color: '#192438', fontWeight: '700' },
  addButton: { marginTop: 20, backgroundColor: '#854C1F', paddingVertical: 12, paddingHorizontal: 64, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
})