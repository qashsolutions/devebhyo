// Screen 7: Priest Listing - sorted by distance from user
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { priests } from '../src/data/priests';
import { sortByDistance, formatDistance } from '../src/utils/geo';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  MapPinIcon,
} from '../src/components/Icons';
import { Priest } from '../src/types';
import { useApp } from '../src/context/AppContext';

const DEFAULT_LAT = 17.385;
const DEFAULT_LNG = 78.4867;

type PriestWithDistance = Priest & { distance: number };

export default function PriestsScreen() {
  const router = useRouter();
  const { user } = useApp();
  const userLat = user?.location?.latitude ?? DEFAULT_LAT;
  const userLng = user?.location?.longitude ?? DEFAULT_LNG;

  const sortedPriests = sortByDistance(priests, userLat, userLng);

  const renderPriest = ({ item }: { item: PriestWithDistance }) => (
    <TouchableOpacity
      style={styles.priestCard}
      onPress={() => router.push(`/priest/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </Text>
      </View>

      <View style={styles.priestInfo}>
        <Text style={styles.priestName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <MapPinIcon size={12} color={Colors.textTertiary} />
          <Text style={styles.metaText}>
            {item.city} -- {formatDistance(item.distance)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <StarIcon size={12} color={Colors.gold} />
          <Text style={styles.metaText}>{item.rating}</Text>
          <Text style={styles.metaDot}> -- </Text>
          <Text style={styles.metaText}>{item.experience} yrs</Text>
        </View>
        <View style={styles.specRow}>
          {item.specializations.slice(0, 2).map((s) => (
            <View key={s} style={styles.specBadge}>
              <Text style={styles.specText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.priceAmount}>
          {'\u20B9'}{item.premiumRate}
        </Text>
        <Text style={styles.priceUnit}>/session</Text>
        {!item.available && (
          <View style={styles.unavailable}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
        <ChevronRightIcon size={16} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Priests</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Nearest to you first</Text>

      <FlatList
        data={sortedPriests}
        keyExtractor={(item) => item.id}
        renderItem={renderPriest}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    letterSpacing: 0.3,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  priestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.label,
    color: Colors.primary,
  },
  priestInfo: {
    flex: 1,
    gap: 3,
  },
  priestName: {
    ...Typography.subheading,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  metaDot: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  specRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 2,
  },
  specBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.sm,
  },
  specText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  priceCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceAmount: {
    ...Typography.label,
    color: Colors.text,
  },
  priceUnit: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  unavailable: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
  unavailableText: {
    ...Typography.caption,
    color: Colors.error,
    fontSize: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
});
