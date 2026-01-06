import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import IonIcon from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updateUser } from '@/services/api'
import { uploadProfileImage } from '@/services/api'
import { fetchUserById } from '@/services/api'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function profile() {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'John', surname: 'Doe', email: '', address: '', city: '', phone: '' }
  })

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('user')
        if (!raw) return
        const parsed = JSON.parse(raw)
        const id = parsed?.id ?? parsed?.userId ?? null
        setUserId(id)
        if (id) {
          try {
            const serverUser = await fetchUserById(id)
            const server = typeof serverUser === 'object' ? serverUser : parsed
            reset({
              name: server?.name ?? server?.fullName ?? server?.displayName ?? 'John',
              surname: server?.surname ?? server?.lastName ?? 'Doe',
              email: server?.email ?? '',
              address: server?.address ?? null,
              city: server?.city ?? null,
              phone: server?.phone ?? null,
            })
            setImageUri(server?.profileImageUrl ?? server?.profileImage ?? null)
            // persist server user to AsyncStorage
            try { await AsyncStorage.setItem('user', JSON.stringify(server)) } catch (e) { console.warn('failed to persist server user', e) }
          } catch (e) {
            // fallback to local parsed object
            reset({
              name: parsed?.name ?? parsed?.fullName ?? parsed?.displayName ?? 'John',
              surname: parsed?.surname ?? parsed?.lastName ?? 'Doe',
              email: parsed?.email ?? '',
              address: parsed?.address ?? null,
              city: parsed?.city ?? null,
              phone: parsed?.phone ?? null,
            })
            setImageUri(parsed?.profileImageUrl ?? parsed?.profileImage ?? null)
          }
        } else {
          // no id, use local
          reset({
            name: parsed?.name ?? parsed?.fullName ?? parsed?.displayName ?? 'John',
            surname: parsed?.surname ?? parsed?.lastName ?? 'Doe',
            email: parsed?.email ?? '',
            address: parsed?.address ?? null,
            city: parsed?.city ?? null,
            phone: parsed?.phone ?? null,
          })
          setImageUri(parsed?.profileImageUrl ?? parsed?.profileImage ?? null)
        }
      } catch (e) {
        console.warn('failed to load stored user for profile settings', e)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permissions', 'Permission to access photos is required to change profile image.')
      }
    })()
  }, [])

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri)
      }
    } catch (e) {
      console.warn('ImagePicker error', e)
      Alert.alert('Error', 'Unable to pick image')
    }
  }

  const onSubmit = async (formData: ProfileForm) => {
    setSubmitting(true)
    try {
      let profileImageUrl = imageUri
      // upload image if local
      if (userId && imageUri && !imageUri.startsWith('http')) {
        try {
          const uploadRes = await uploadProfileImage(userId, imageUri)
          profileImageUrl = typeof uploadRes === 'string' ? uploadRes : uploadRes?.url ?? uploadRes?.imageUrl ?? profileImageUrl
        } catch (ue) {
          console.warn('image upload failed', ue)
          Alert.alert('Upload Failed', 'Unable to upload profile image. Please try again.')
          setSubmitting(false)
          return
        }
      }

      if (!userId) {
        console.warn('no userId present, skipping server update', formData)
        Alert.alert('Saved', 'Your address information was saved locally.')
        router.back()
        setSubmitting(false)
        return
      }

      const payload = {
        name: formData.name ?? '',
        surname: formData.surname ?? '',
        email: formData.email ?? '',
        password: null,
        phone: formData.phone ?? null,
        address: formData.address ?? null,
  city: formData.city ?? null,
      }

      const updated = await updateUser(userId, payload)
      try {
        const base = typeof updated === 'object' ? updated : { id: userId, ...payload }
        const toStore = { ...base, profileImageUrl }
        await AsyncStorage.setItem('user', JSON.stringify(toStore))
      } catch (e) { console.warn('failed to persist updated user', e) }

      Alert.alert('Saved', 'Your profile was updated.')
      router.back()
    } catch (e: any) {
      console.warn('update failed', e)
      Alert.alert('Error', e?.message ?? 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IonIcon name="arrow-back-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Address & Contact</Text>
          </View>

          <View style={styles.avatarWrap}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <Image
                source={imageUri ? { uri: imageUri } : require('@/assets/images/profile-image.jpg')}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Name"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                />
              )}
            />
            {errors.name ? <Text style={{ color: '#ff6b6b' }}>{String(errors.name.message)}</Text> : null}

            <Text style={styles.label}>Surname</Text>
            <Controller
              control={control}
              name="surname"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Surname"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                />
              )}
            />
            {errors.surname ? <Text style={{ color: '#ff6b6b' }}>{String(errors.surname.message)}</Text> : null}

            <Text style={styles.label}>Address/City</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ''}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Address/City"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                />
              )}
            />

            <Text style={styles.label}>City</Text>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ''}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="City"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                />
              )}
            />

            <Text style={styles.label}>Phone</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ''}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Phone"
                  placeholderTextColor="#9aa4b2"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              )}
            />

            <TouchableOpacity style={[styles.button, submitting ? { opacity: 0.7 } : null]} onPress={handleSubmit(onSubmit)} activeOpacity={0.9} disabled={submitting}>
              {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#192438' },
  scroll: { padding: 20 },
  header: { height: 56, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  backButton: { position: 'absolute', left: 0, top: 12, padding: 8 },
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#854C1F', marginBottom: 8 },
  changeButton: { backgroundColor: '#854C1F', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 16 },
  changeText: { color: 'white', fontWeight: '500' },
  form: { marginTop: 8 },
  label: { color: '#9aa4b2', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#110c2aff', color: 'white', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 6 },
  button: { backgroundColor: '#854C1F', color:'white', borderRadius: 8, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: '700' },
})
