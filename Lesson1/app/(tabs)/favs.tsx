import IonIcon from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StatusBar, StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CoffeeCard from '../components/coffee-cart-favs';
import { fetchLikesByUser, createLike, deleteLike, fetchProductById, fetchLikesByCoffee } from '@/services/api';

export default function Favs() {
  const [products, setProducts] = useState<any[]>([]);
  const [likedSet, setLikedSet] = useState<Record<string, number | string>>({});
  const [userId, setUserId] = useState<number | string | null>(null);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLikesAndProducts = async (uid?: number | string | null) => {
    setLoading(true);
    try {
      const raw = uid ? null : await AsyncStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw as string) : null;
      const id = uid ?? parsed?.id ?? parsed?.userId ?? null;
      setUserId(id);
      setProfileImageUri(parsed?.profileImageUrl ?? parsed?.profileImage ?? null);

      if (!id) {
        setProducts([]);
        setLikedSet({});
        return;
      }

      const likes = await fetchLikesByUser(id);
      if (!Array.isArray(likes) || likes.length === 0) {
        setProducts([]);
        setLikedSet({});
        return;
      }

      const coffeeIds = likes.map((l: any) => l.coffeeId ?? l.coffee?.id).filter(Boolean);
      const proms = coffeeIds.map((cid: any) => fetchProductById(cid));
      const prods = await Promise.all(proms);

      const items = prods.map((p: any) => ({
        id: String(p.id),
        title: p.title ?? p.name,
        subtitle: p.description ?? '',
        price: p.price != null ? String(p.price) : undefined,
        rating: p.rating ?? 0,
        image: p.imageUrl ? { uri: p.imageUrl } : require('@/assets/images/coffee-cup.png'),
      }));

      const m: Record<string, number | string> = {};
      for (const l of likes) {
        const key = String(l.coffeeId ?? l.coffee?.id ?? l.coffeeId);
        m[key] = l.id ?? l.likeId ?? l._id ?? l?.id;
      }

      setProducts(items);
      setLikedSet(m);
    } catch (e) {
      console.warn('favs: failed to load likes/products', e);
      setProducts([]);
      setLikedSet({});
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadLikesAndProducts();
    }, [])
  )

  const handleLike = async (coffeeId: string | number) => {
    if (!userId) return;
    try {
      await createLike(Number(coffeeId), userId);
      await loadLikesAndProducts(userId);
    } catch (e) {
      console.warn('like failed', e);
    }
  };

  const handleUnlike = async (coffeeId: string | number) => {
    if (!userId) return;
    try {
      // Optimistic UI: remove locally first
      setProducts(prev => prev.filter(p => String(p.id) !== String(coffeeId)));
      setLikedSet(prev => {
        const c = { ...prev };
        delete c[String(coffeeId)];
        return c;
      });
      // call backend to delete
      await deleteLike(coffeeId, userId);
      // reload to ensure consistency
      await loadLikesAndProducts(userId);
    } catch (e) {
      console.warn('unlike failed', e);
    }
  };

  // modal state for viewing users who liked a coffee
  const [usersModalVisible, setUsersModalVisible] = useState(false);
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState<string>('');

  const handleViewUsers = async (coffeeId: string | number, coffeeTitle?: string) => {
    try {
      setModalTitle(String(coffeeTitle ?? `Coffee ${coffeeId}`));
      setUsersModalVisible(true);
      const likes = await fetchLikesByCoffee(coffeeId);
      // likes may include user objects or just userIds; try to normalize
      const users = (likes || []).map((l: any) => l.user ?? { id: l.userId ?? l.user?.id, profileImageUrl: l.user?.profileImageUrl ?? null });
      setModalUsers(users);
    } catch (e) {
      console.warn('fetch likes by coffee failed', e);
      setModalUsers([]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#192438' }}>
      <StatusBar barStyle="light-content" backgroundColor="#192438" />
      <View style={styles.upperContainer}>
        <IonIcon name="menu-outline" size={24} color="white" />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.text, { color: '#854C1F' }]}>{"Coffee"}</Text>
          <Text style={styles.text}>{"Shop"}</Text>
        </View>
        <Image source={profileImageUri ? { uri: profileImageUri } : require('@/assets/images/profile-image.jpg')} style={{ width: 32, height: 32, borderRadius: 100 }} />
      </View>

      <View>
        <Text style={styles.mainTitle}>Favorites</Text>
      </View>

      <View style={{ marginTop: 12, paddingHorizontal: 16, height: '80%' }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CoffeeCard
              item={item}
              liked={Boolean(likedSet[String(item.id)])}
                onLike={() => handleLike(item.id)}
                onUnlike={() => handleUnlike(item.id)}
                onViewUsers={() => handleViewUsers(item.id, item.title)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </View>

        <Modal visible={usersModalVisible} animationType="slide" transparent>
          <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center', padding: 20 }}>
            <View style={{ backgroundColor: '#122033', borderRadius: 12, padding: 12, maxHeight: '80%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>{modalTitle}</Text>
                <TouchableOpacity onPress={() => setUsersModalVisible(false)}>
                  <Text style={{ color: '#FFB84D' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 12 }}>
                {modalUsers.length === 0 ? (
                  <Text style={{ color: 'white' }}>No users found</Text>
                ) : (
                  modalUsers.map(u => (
                    <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                      <Image source={u.profileImageUrl ? { uri: u.profileImageUrl } : require('@/assets/images/profile-image.jpg')} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
                      <Text style={{ color: 'white' }}>{u.name ?? `User ${u.id}`}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
    marginTop: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});