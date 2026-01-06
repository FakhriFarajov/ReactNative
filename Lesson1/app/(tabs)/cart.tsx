import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useCallback, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import IonIcon from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
import CoffeeCard from '../components/coffee-card-cart';
import { push } from 'expo-router/build/global-state/routing';
import { fetchCartByUser, deleteCartItem, fetchProductById, decrementCartItem, incrementCartItem } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function cart() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    let mounted = true
    try {
      let userId: number | string = 1
      try {
        const raw = await AsyncStorage.getItem('user')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.id) userId = parsed.id
        }
      } catch { }

      const cart = await fetchCartByUser(userId)
      if (!mounted) return
      const items = Array.isArray(cart) ? cart : (cart?.items ?? [])

      const enriched = await Promise.all(items.map(async (ci: any) => {
        try {
          const prodId = ci.coffeeId ?? ci.productId ?? ci.product?.id ?? ci.id
          if (!prodId) return ci
          const prod = await fetchProductById(prodId)
          return { ...ci, title: prod?.title ?? ci.title, price: prod?.price ?? ci.price, image: prod?.imageUrl ?? prod?.image ?? ci.image }
        } catch (e) {
          console.warn('Could not fetch product for cart item', ci, e)
          return ci
        }
      }))

      setProducts(enriched)
      const initialQtys: Record<string, number> = {}
      enriched.forEach((p: any) => { initialQtys[String(p.id)] = p.quantity ?? 1 })
      setQuantities(initialQtys)
    } catch (e) {
      console.warn('fetchCartByUser failed', e)
    }
    return () => { mounted = false }
  }, [setProducts, setQuantities])

  useFocusEffect(
    useCallback(() => {
      loadCart()
    }, [loadCart])
  )

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem('user')
        if (!mounted) return
        if (raw) {
          const parsed = JSON.parse(raw)
          setProfileImageUri(parsed?.profileImageUrl ?? parsed?.profileImage ?? null)
        }
      } catch (e) {
        console.warn('Failed to load profile image uri', e)
      }
    }
    loadProfile()
    return () => { mounted = false }
  }, [])


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#192438' }}>
      <StatusBar barStyle="light-content" backgroundColor="#192438" />
      <View style={styles.upperContainer}>
        <IonIcon name="menu-outline" size={24} color="white" />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={[styles.text, { color: '#854C1F' }]}>{"Coffee"}</Text>
          <Text style={styles.text}>{"Shop"}</Text>
        </View>
        <Image source={profileImageUri ? { uri: profileImageUri } : require('@/assets/images/profile-image.jpg')} style={{ width: 32, height: 32, borderRadius: 100 }} />
      </View>
      <View>
        <Text style={styles.title}>Cart</Text>
      </View>
      <View style={{ marginTop: 12, flex: 1, maxHeight: '75%' }}>
        <FlatList
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingBottom: 12 }}
          data={products}
          renderItem={({ item }) => (
            <CoffeeCard
              item={item}
              quantity={quantities[item.id]}
              onQuantityChange={async (newQty) => {
                const old = quantities[item.id] ?? 1
                // if decreasing, call decrement endpoint with delta
                if (newQty < old) {
                  // optimistic update
                  setQuantities(qs => ({ ...qs, [item.id]: newQty }))
                  try {
                    const diff = old - newQty
                    await decrementCartItem(item.id, diff)
                  } catch (e: any) {
                    // rollback
                    setQuantities(qs => ({ ...qs, [item.id]: old }))
                    Alert.alert('Error', e?.message ?? 'Failed to update quantity')
                  }
                } else {
                  // optimistic update for increment
                  const oldVal = quantities[item.id] ?? 1
                  setQuantities(qs => ({ ...qs, [item.id]: newQty }))
                  try {
                    const diff = newQty - oldVal
                    await incrementCartItem(item.id, diff)
                  } catch (e: any) {
                    // rollback
                    setQuantities(qs => ({ ...qs, [item.id]: oldVal }))
                    Alert.alert('Error', e?.message ?? 'Failed to update quantity')
                  }
                }
              }}
              onRemove={async () => {
                try {
                  await deleteCartItem(item.id)
                  // refresh list locally
                  setProducts(ps => ps.filter(p => String(p.id) !== String(item.id)))
                  const qs = { ...quantities }
                  delete qs[item.id]
                  setQuantities(qs)
                } catch (e: any) {
                  console.warn('deleteCartItem failed', e)
                  Alert.alert('Error', e?.message ?? 'Failed to remove item')
                }
              }}
            />
          )}
          keyExtractor={item => item.id}
        />
        {(() => {
          const total = products.reduce((sum, item) => {
            const qty = quantities[item.id] || 1;
            return sum + parseFloat(item.price) * qty;
          }, 0);
          const totalStr = total.toFixed(2);
          return (
            <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: 'white' }}>{"Total: $" + totalStr}</Text>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => push(`/checkoutMethod?total=${encodeURIComponent(totalStr)}`)}
              >
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          )
        })()}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  upperContainer: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: 'white',
    fontSize: 32,
  },
  payButton: {
    backgroundColor: '#854C1F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})