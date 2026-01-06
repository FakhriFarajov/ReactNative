import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import IonIcon from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { push } from 'expo-router/build/global-state/routing';


export default function Profile() {
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const raw = await AsyncStorage.getItem('user')
                if (!mounted) return
                if (raw) {
                    const parsed = JSON.parse(raw)
                    setProfileImageUri(parsed?.profileImageUrl ?? parsed?.profileImage ?? null)
                    setUserName(parsed?.name ?? parsed?.fullName ?? parsed?.displayName ?? null)
                }
            } catch (e) { console.warn('failed to load profile image', e) }
        })()
        return () => { mounted = false }
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#192438' }}>
            <View style={styles.upperContainer}>
                <Text style={styles.title}>Profile</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Image source={profileImageUri ? { uri: profileImageUri } : require('@/assets/images/profile-image.jpg')} style={{ width: 150, height: 150, borderRadius: 75 }} />
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', marginTop: 12 }}>{userName ?? 'John Doe'}</Text>
            </View>
            <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => { }} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="bag-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Order</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <IonIcon name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => { }} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="receipt-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Purchase Details</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <IonIcon name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => { }} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="wallet-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Payment</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <IonIcon name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => router.push('/profile-settings')} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="settings-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Profile Settings</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <IonIcon name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => { }} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="information-circle-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Info</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <IonIcon name="arrow-forward-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity style={styles.optionsContainer} onPress={() => { push('/auth/auth') }} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IonIcon name="log-out-outline" size={20} color="#8C4D21" />
                        <Text style={styles.optionText}>Logout</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    upperContainer: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        borderRadius: 8,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 16,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    }
})