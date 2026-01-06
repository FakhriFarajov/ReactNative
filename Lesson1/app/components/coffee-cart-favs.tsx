import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';

type Props = {
  item: {
    id: string;
    title: string;
    subtitle?: string;
    price?: string;
    image?: any;
  };
  liked?: boolean;
  onLike?: () => Promise<void> | void;
  onUnlike?: () => Promise<void> | void;
  onViewUsers?: () => Promise<void> | void;
};

export default function CoffeeCard({ item, liked: likedProp, onLike, onUnlike, onViewUsers }: Props) {
  const [localLiked, setLocalLiked] = useState(false);
  const liked = typeof likedProp === 'boolean' ? likedProp : localLiked;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={item.image || require('@/assets/images/coffee-cup.png')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
        {item.price ? <Text style={styles.price}>{item.price}</Text> : null}
      </View>

      <View style={styles.iconsRow}>
        <TouchableOpacity onPress={async () => {
          if (typeof onLike === 'function' || typeof onUnlike === 'function') {
            try {
              if (liked) {
                await onUnlike?.()
              } else {
                await onLike?.()
              }
            } catch (e) { console.warn('like toggle failed', e) }
          } else {
            setLocalLiked(v => !v)
          }
        }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <IonIcon name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#FF4C4C' : 'white'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#122033',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#B0B8C2',
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    color: '#FFB84D',
    marginTop: 6,
    fontWeight: '600',
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
