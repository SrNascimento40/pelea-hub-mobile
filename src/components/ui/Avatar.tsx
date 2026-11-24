import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/constants/theme';
import { initials } from '@/utils/format';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: number;
}

export function Avatar({ name, photoUrl, size = 44 }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.image, dimension]} />;
  }
  return (
    <View style={[styles.fallback, dimension]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceAlt,
  },
  fallback: {
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  initials: {
    color: colors.primary,
    fontWeight: '700',
  },
});
