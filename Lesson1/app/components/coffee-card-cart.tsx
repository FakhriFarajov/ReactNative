import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Coffee_Config } from '@/services/api'


type Item = {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  image?: any;
};

type Props = {
  item: Item;
  quantity?: number; // controlled quantity (optional)
  onQuantityChange?: (newQty: number) => void;
  onRemove?: () => void;
};

export default function CoffeeCard({ item, quantity: quantityProp, onQuantityChange, onRemove }: Props) {
  const [inCart, setInCart] = useState(false);
  const [localQty, setLocalQty] = useState(1);

  const quantity = typeof quantityProp === 'number' ? quantityProp : localQty;

  const increase = () => {
    const next = quantity + 1;
    if (onQuantityChange) onQuantityChange(next);
    else setLocalQty(q => q + 1);
  };

  const decrease = () => {
    const next = Math.max(1, quantity - 1);
    if (onQuantityChange) onQuantityChange(next);
    else setLocalQty(q => Math.max(1, q - 1));
  };

  const priceNum = parseFloat(String(item.price || '0')) || 0;
  const total = (priceNum * quantity).toFixed(2);

  // normalize image source
  const raw = item.image ?? null
  let imageSource: any
  if (typeof raw === 'string') {
    const uri = raw.startsWith('/') ? `${Coffee_Config.baseURL}${raw}` : raw
    imageSource = { uri }
  } else if (raw) {
    imageSource = raw
  } else {
    imageSource = require('@/assets/images/coffee-cup.png')
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
        {item.price ? <Text style={styles.price}>$ {item.price}</Text> : null}
      </View>

      <View style={styles.iconsRow}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={decrease} style={styles.qtyButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.qtySign}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{quantity}</Text>

          <TouchableOpacity onPress={increase} style={styles.qtyButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.qtySign}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>$ {total}</Text>
        </View>

        <View style={{ marginLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setInCart(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginRight: 8 }}>
            <IonIcon name={inCart ? 'cart' : 'cart-outline'} size={24} color={inCart ? '#FFB84D' : 'white'} />
          </TouchableOpacity>
          {typeof onRemove === 'function' ? (
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IonIcon name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          ) : null}
        </View>
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
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f2730',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#122b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySign: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  qtyText: {
    color: 'white',
    marginHorizontal: 8,
    minWidth: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  totalBox: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#B0B8C2',
    fontSize: 12,
  },
  totalValue: {
    color: '#FFB84D',
    fontWeight: '700',
  }
});
