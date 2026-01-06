import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import IonIcon from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native';
import { createOrder } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function formatCardNumber(input: string) {
    const digits = input.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  function handleCardNumberChange(text: string) {
    setCardNumber(formatCardNumber(text));
  }

  function handleExpiryChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0,4);
    if (digits.length >= 3) {
      setExpiry(digits.slice(0,2) + '/' + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  }

  async function handlePayPress() {
    if (!cardName || cardNumber.replace(/\s/g,'').length < 13 || expiry.length < 4 || cvc.length < 3) {
      Alert.alert('Invalid card', 'Please complete all card fields correctly.');
      return;
    }
    const masked = '**** **** **** ' + cardNumber.replace(/\s/g,'').slice(-4);
    setLoading(true);
    try {
      // Replace this with your real payment API endpoint (mocked here)
      const resp = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName, cardNumber: cardNumber.replace(/\s/g,''), expiry, cvc, amount: total }),
      });
      if (!resp.ok) throw new Error('Payment failed');
      const data = await resp.json();
      // In a real flow you'd inspect data for success
      // create order on backend (move to api module)
      try {
        const raw = await AsyncStorage.getItem('user')
        const parsed = raw ? JSON.parse(raw as string) : null
        const id = parsed?.id ?? parsed?.userId ?? null
        if (id) {
          await createOrder(Number(id))
        } else {
          console.warn('no user id found in AsyncStorage, skipping order create')
        }
      } catch (e) {
        console.warn('failed to create order', e)
      }

      router.push(`/orderConfirmed?total=${encodeURIComponent(String(total || '0.00'))}`);
    } catch (err: any) {
      Alert.alert('Payment error', err?.message || 'Unknown error')
    } finally {
      setLoading(false);
    }
  }

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ marginTop: 12, flex: 1 }}>
        {/* Card info form */}
        <View style={{ padding: 16, backgroundColor: '#122033', margin: 12, borderRadius: 12 }}>
          <Text style={{ color: '#B0B8C2', marginBottom: 6 }}>Cardholder name</Text>
          <TextInput
            placeholder="John Doe"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={cardName}
            onChangeText={setCardName}
          />

          <Text style={{ color: '#B0B8C2', marginTop: 12, marginBottom: 6 }}>Card number</Text>
          <TextInput
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            style={styles.input}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            maxLength={19}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: '#B0B8C2', marginBottom: 6 }}>Expiry</Text>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.input}
                value={expiry}
                onChangeText={handleExpiryChange}
                maxLength={5}
              />
            </View>

            <View style={{ width: 100 }}>
              <Text style={{ color: '#B0B8C2', marginBottom: 6 }}>CVC</Text>
              <TextInput
                placeholder="123"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                style={styles.input}
                value={cvc}
                onChangeText={text => setCvc(text.replace(/\D/g,'').slice(0,4))}
                maxLength={4}
                secureTextEntry={true}//Like a password
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payButton, { marginTop: 16 }]}
            onPress={handlePayPress}
          >
            <Text style={styles.payButtonText}>Pay ${total || '0.00'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  input: {
    backgroundColor: '#0f2730',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
})