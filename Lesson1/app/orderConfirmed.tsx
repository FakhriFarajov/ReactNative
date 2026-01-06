import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import IonIcon from '@expo/vector-icons/Ionicons'

export default function OrderConfirmed() {
  const params = useLocalSearchParams()
  const totalParam = Array.isArray(params.total) ? params.total[0] : params.total
  const total = totalParam ?? '0.00'
  const router = useRouter()

  const orderId = Math.random().toString(36).slice(2, 10).toUpperCase()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <IonIcon name="checkmark-circle" size={72} color="#8C4D21" />
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>Thanks for your purchase!</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{orderId}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Total</Text>
        <Text style={styles.value}>${total}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/home') }>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#192438', padding: 20 },
  top: { alignItems: 'center', marginTop: 24 },
  title: { color: 'white', fontSize: 24, fontWeight: '700', marginTop: 12 },
  subtitle: { color: '#B0B8C2', marginTop: 6 },
  body: { marginTop: 36, backgroundColor: '#122033', padding: 16, borderRadius: 12 },
  label: { color: '#B0B8C2' },
  value: { color: 'white', fontSize: 18, fontWeight: '700', marginTop: 4 },
  footer: { marginTop: 24, alignItems: 'center' },
  button: { backgroundColor: '#854C1F', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '700' }
})
