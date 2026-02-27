// Screen 4: Home - Minimal, voice-first, location-aware
// Think screenless: the engine is powerful, the surface is quiet.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { temples } from '../src/data/temples';
import { priests } from '../src/data/priests';
import { sortByDistance, formatDistance } from '../src/utils/geo';
import {
  MicIcon,
  MapPinIcon,
  ChevronRightIcon,
  SettingsIcon,
} from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';

const { width: screenWidth } = Dimensions.get('window');

// Default: Hyderabad (demo fallback)
const DEFAULT_LAT = 17.385;
const DEFAULT_LNG = 78.4867;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useApp();
  const [userLat] = useState(user?.location?.latitude ?? DEFAULT_LAT);
  const [userLng] = useState(user?.location?.longitude ?? DEFAULT_LNG);

  // Nearest 3 temples, sorted by distance
  const nearestTemples = sortByDistance(temples, userLat, userLng).slice(0, 3);

  // Nearest available priest
  const nearestPriest = sortByDistance(
    priests.filter((p) => p.available),
    userLat,
    userLng
  )[0];

  return (
    <View style={styles.container}>
      {/* Top bar -- just branding + settings */}
      <View style={styles.topBar}>
        <Text style={styles.brand}>Devebhyo</Text>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <SettingsIcon size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Center: voice-first mic -- the primary interaction */}
      <View style={styles.center}>
        <TouchableOpacity style={styles.micCircle} activeOpacity={0.8}>
          <MicIcon size={32} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.micHint}>Tap to speak in your language</Text>
      </View>

      {/* Bottom: near you -- only what's relevant */}
      <View style={styles.bottom}>
        {/* Nearest temple */}
        <Text style={styles.sectionLabel}>NEAR YOU</Text>

        {nearestTemples.map((temple, i) => (
          <TouchableOpacity
            key={temple.id}
            style={[styles.nearRow, i === 0 && styles.nearRowFirst]}
            onPress={() => router.push(`/temple/${temple.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: '#1A3A5C' }]} />
            <View style={styles.nearInfo}>
              <Text style={styles.nearName} numberOfLines={1}>
                {temple.name.replace(/Temple|Mandir|Sri /g, '').trim()}
              </Text>
              <Text style={styles.nearMeta}>
                {temple.city} -- {formatDistance(temple.distance)}
              </Text>
            </View>
            <ChevronRightIcon size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}

        {/* Nearest priest */}
        {nearestPriest && (
          <TouchableOpacity
            style={styles.nearRow}
            onPress={() => router.push(`/priest/${nearestPriest.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: '#C45B28' }]} />
            <View style={styles.nearInfo}>
              <Text style={styles.nearName} numberOfLines={1}>
                {nearestPriest.name}
              </Text>
              <Text style={styles.nearMeta}>
                {nearestPriest.city} -- {formatDistance(nearestPriest.distance)}
              </Text>
            </View>
            <ChevronRightIcon size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Explore map -- the discovery surface */}
        <TouchableOpacity
          style={styles.mapEntry}
          onPress={() => router.push('/map')}
          activeOpacity={0.7}
        >
          <MapPinIcon size={16} color={Colors.textSecondary} />
          <Text style={styles.mapEntryText}>Explore map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
  },
  brand: {
    ...Typography.label,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },

  // Center: mic
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  micHint: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: Spacing.lg,
  },

  // Bottom: near you
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  nearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.md,
  },
  nearRowFirst: {
    borderTopWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nearInfo: {
    flex: 1,
    gap: 1,
  },
  nearName: {
    ...Typography.label,
    color: Colors.text,
    fontSize: 14,
  },
  nearMeta: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  mapEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
  mapEntryText: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
  },
});
