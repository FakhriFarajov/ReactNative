import IonIcon from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoffeeCard from '../components/coffee-card-home';
import { fetchProducts, createLike, deleteLike } from '@/services/api';


export default function home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        const parsed = raw ? JSON.parse(raw) : null;
        const id = parsed?.id ?? parsed?.userId ?? null;
        setUserId(id);
        const remote = await fetchProducts(undefined, id ?? undefined);
        if (Array.isArray(remote) && remote.length) {
          setProducts(remote.map((p: any) => ({
            id: String(p.id),
            title: p.title ?? p.name,
            description: p.description || '',
            price: p.price ? String(p.price) : '0.00',
            rating: p.rating ?? 0,
            category: p.category,
            imageUrl: p.imageUrl,
            image: require('@/assets/images/coffee-cup.png'),
            liked: Boolean(p.liked),
          })));
          return;
        }
      } catch (e) {
        console.warn('fetchProducts failed, falling back to mock', e);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        if (u && u.profileImageUrl) setProfileImageUri(u.profileImageUrl);
      } catch (e) {
        console.warn('failed to load user from storage', e);
      }
    };
    loadUser();
  }, []);

  const fetchAndSet = async (category?: string) => {
    setLoadingProducts(true);
    try {
      console.log('Fetching products for category', category);
      const categoryQuery = category ? String(category).toLowerCase() : undefined;
      const remote = categoryQuery ? await fetchProducts(categoryQuery, userId ?? undefined) : await fetchProducts(undefined, userId ?? undefined);
      if (Array.isArray(remote)) {
        setProducts(remote.map((p: any) => ({
          id: String(p.id),
          title: p.title ?? p.name,
          description: p.description || '',
          price: p.price ? String(p.price) : '0.00',
          rating: p.rating ?? 0,
          category: p.category,
          imageUrl: p.imageUrl,
          image: require('@/assets/images/coffee-cup.png'),
          liked: Boolean(p.liked),
        })));
      }
    } catch (e) {
      console.warn('fetchProducts by category failed', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!query) return;
    const normalizedSelected = selectedCategory ? selectedCategory.toLowerCase() : null;
    const normalizedQuery = query.toLowerCase();
    if (normalizedSelected === normalizedQuery) return;
    const t = setTimeout(() => fetchAndSet(query), 300);
    return () => clearTimeout(t);
  }, [query, selectedCategory]);

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
        <TextInput
          placeholder="Search for coffee"
          placeholderTextColor="#A0A0A0"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>
      <View style={{ marginTop: 16 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ key: 'Iced Cappucino' }, { key: 'Latte' }, { key: 'Espresso' }, { key: 'Mocha' }, { key: 'Americano' }]}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.key;
            return (
              <TouchableOpacity
                style={[styles.pillButton, isSelected ? { backgroundColor: '#854C1F' } : null]}
                onPress={() => {
                  setSelectedCategory(item.key);
                  setQuery(item.key);
                  fetchAndSet(item.key);
                }}
              >
                <Text style={styles.pillText}>{item.key}</Text>
                {isSelected && loadingProducts ? <ActivityIndicator color="white" style={{ marginLeft: 6 }} /> : null}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.key}
        />
      </View>

      <View style={{ marginTop: 12, paddingHorizontal: 16, maxHeight: '75%' }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CoffeeCard
              coffee={item}
              liked={Boolean(item.liked)}
              onLike={async () => { try { await createLike(Number(item.id), userId ?? undefined); /* optimistic update */ setProducts(ps => ps.map(p => p.id === item.id ? { ...p, liked: true } : p)); } catch (e) { console.warn('like failed', e) } }}
              onUnlike={async () => { try { /* need likeId - backend may require like id; here we call deleteLike by coffee id and userId if server supports it */ await deleteLike(Number(item.id), userId ?? undefined); setProducts(ps => ps.map(p => p.id === item.id ? { ...p, liked: false } : p)); } catch (e) { console.warn('unlike failed', e) } }}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  itemButton: {
    backgroundColor: '#110c2aff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  pillButton: {
    backgroundColor: '#110c2aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  pillText: {
    color: 'white',
    fontSize: 16,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#110c2aff',
    color: 'white',
    fontSize: 16,
    borderRadius: 24,
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: 'white',
    fontSize: 32,
  },
  upperContainer: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
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