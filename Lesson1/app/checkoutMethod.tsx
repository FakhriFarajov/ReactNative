import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import IonIcon from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
import { push } from 'expo-router/build/global-state/routing';




export function MethodItem({ method, total }: { method: { id: string; name: string; image: any }, total?: string }) {
  return (
    <View style={{ paddingHorizontal: 64, paddingVertical: 24, backgroundColor: "#122033", borderRadius: 12, marginBottom: 12 }}>
      <TouchableOpacity onPress={() => push(`/cardInfo?method=${method.id}&total=${encodeURIComponent(String(total || '0.00'))}`)}>
        <Image source={method.image} style={{ width: '100%', height: 200, resizeMode: 'contain' }} />
      </TouchableOpacity>
    </View>
  )
}


export default function checkoutMethod() {

  const params = useLocalSearchParams();
  const totalParam = Array.isArray(params.total) ? params.total[0] : params.total;
  const total = totalParam ?? '0.00';

  const methods = [
    { id: '1', name: 'Credit Card', image: require('@/assets/images/Visa.png') },
    { id: '2', name: 'PayPal', image: require('@/assets/images/MasterCard.png') },
    { id: '3', name: 'Apple Pay', image: require('@/assets/images/ApplePay.png') },
    { id: '4', name: 'Google Pay', image: require('@/assets/images/GooglePay.png') },

  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#192438' }}>
      <StatusBar barStyle="light-content" backgroundColor="#192438" />
      <View style={styles.upperContainer}>
        <IonIcon name="menu-outline" size={24} color="white" />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={[styles.text, { color: '#854C1F' }]}>{"Coffee"}</Text>
          <Text style={styles.text}>{"Shop"}</Text>
        </View>
        <Image source={require('@/assets/images/profile-image.jpg')} style={{ width: 32, height: 32, borderRadius: 100 }} />
      </View>
      <View>
        <Text style={styles.title}>Payment Method</Text>
        {total ? <Text style={{ color: 'white', textAlign: 'center', marginTop: 6 }}>Total: ${total}</Text> : null}
      </View>
      <View style={{ marginTop: 12, flex: 1 }}>
        <FlatList
          style={{ marginTop: 12, maxHeight: '85%' }}
          data={methods}
          renderItem={({ item }) => <MethodItem method={item} total={total} />}
          keyExtractor={item => item.id}
        />
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