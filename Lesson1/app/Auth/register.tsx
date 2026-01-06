import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { register } from '@/services/api';
import { Controller, useForm } from 'react-hook-form';
import { SignUpInput, signUpSchema } from "../types/auth_schema";
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            password: '',
            address: '',
            phone: '',
            city: '',
        },
    });

    async function onSubmit(data: SignUpInput) {
        setErrorMsg(null);
        setLoading(true);
        try {
            console.log('Register submit payload', data);
            var result = await register({
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: data.password,
                address: data.address ?? '',
                phone: data.phone ?? '',
                city: data.city ?? '',
            });
            AsyncStorage.setItem('user', JSON.stringify(result));
            router.replace('/(tabs)/home');
        } catch (err: any) {
            setErrorMsg(err?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Create account</Text>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.name && <Text style={{ color: 'red' }}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="surname"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Surname"
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.surname && <Text style={{ color: 'red' }}>{errors.surname.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
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
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

                <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Address"
                            placeholderTextColor="#9aa4b2"
                            style={[styles.input]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value ?? ''}
                            multiline
                        />
                    )}
                />
                {errors.address && <Text style={{ color: 'red' }}>{errors.address.message}</Text>}

                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Phone"
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            keyboardType="phone-pad"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value ?? ''}
                        />
                    )}
                />
                {errors.phone && <Text style={{ color: 'red' }}>{errors.phone.message}</Text>}

                <Controller
                    control={control}
                    name="city"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="City"
                            placeholderTextColor="#9aa4b2"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value ?? ''}
                        />
                    )}
                />
                {errors.city && <Text style={{ color: 'red' }}>{errors.city.message}</Text>}

                {errorMsg ? <Text style={{ color: '#ff7b7b', textAlign: 'center', marginTop: 8 }}>{errorMsg}</Text> : null}

                <TouchableOpacity style={[styles.button, loading ? { opacity: 0.8 } : null]} onPress={handleSubmit(onSubmit)} activeOpacity={0.9} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 12 }}>
                    <TouchableOpacity onPress={() => router.replace('/auth/auth')}>
                        <Text style={{ color: 'white' }}>Already have an account? Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#192438",

    },
    inner: {
        padding: 24,
        marginTop: 40,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
    },
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
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    linkText: {
        color: '#9aa4b2',
        textAlign: 'center',
    },
});
