// Screen 6: Map - temples (dark blue) + priests (saffron), tap to select
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { IndiaMap, MapPin } from '../src/components/IndiaMap';
import { temples } from '../src/data/temples';
import { priests } from '../src/data/priests';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '../src/components/Icons';

const { width: screenWidth } = Dimensions.get('window');

type FilterMode = 'all' | 'temples' | 'priests';

export default function MapScreen() {
  const router = useRouter();
  const { highlight } = useLocalSearchParams<{ highlight?: string }>();
  const [selectedId, setSelectedId] = useState<string>(highlight || '');
  const [filter, setFilter] = useState<FilterMode>('all');

  // Build pins from both data sets
  const templePins: MapPin[] = temples.map((t) => ({
    id: t.id,
    latitude: t.latitude,
    longitude: t.longitude,
    label: t.city,
    type: 'temple' as const,
  }));

  const priestPins: MapPin[] = priests.map((p) => ({
    id: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    label: p.city,
    type: 'priest' as const,
  }));

  const allPins =
    filter === 'temples'
      ? templePins
      : filter === 'priests'
      ? priestPins
      : [...templePins, ...priestPins];

  // Find selected item
  const selectedTemple = temples.find((t) => t.id === selectedId);
  const selectedPriest = priests.find((p) => p.id === selectedId);
  const selectedItem = selectedTemple || selectedPriest;

  const handlePinPress = (id: string) => {
    setSelectedId(id === selectedId ? '' : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter row */}
      <View style={styles.filterRow}>
        {(['all', 'temples', 'priests'] as FilterMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.filterChip, filter === mode && styles.filterChipActive]}
            onPress={() => {
              setFilter(mode);
              setSelectedId('');
            }}
          >
            {mode !== 'all' && (
              <View
                style={[
                  styles.filterDot,
                  {
                    backgroundColor:
                      mode === 'temples' ? '#1A3A5C' : '#C45B28',
                  },
                ]}
              />
            )}
            <Text
              style={[
                styles.filterText,
                filter === mode && styles.filterTextActive,
              ]}
            >
              {mode === 'all'
                ? 'All'
                : mode === 'temples'
                ? 'Temples'
                : 'Priests'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map */}
        <View style={styles.mapContainer}>
          <IndiaMap
            width={screenWidth - 48}
            height={440}
            pins={allPins}
            selectedPinId={selectedId}
            onPinPress={handlePinPress}
            highlightedStates={[
              'Telangana',
              'Andhra Pradesh',
              'Tamil Nadu',
              'Karnataka',
              'Maharashtra',
            ]}
          />
        </View>

        {/* Selected card */}
        {selectedTemple && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/temple/${selectedTemple.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.cardDot, { backgroundColor: '#1A3A5C' }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>
                {selectedTemple.name}
              </Text>
              <Text style={styles.cardDeity}>{selectedTemple.deity}</Text>
              <View style={styles.cardMeta}>
                <MapPinIcon size={11} color={Colors.textTertiary} />
                <Text style={styles.cardMetaText}>
                  {selectedTemple.city}, {selectedTemple.state}
                </Text>
              </View>
              <View style={styles.cardMeta}>
                <ClockIcon size={11} color={Colors.textTertiary} />
                <Text style={styles.cardMetaText}>
                  {selectedTemple.timings}
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}

        {selectedPriest && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/priest/${selectedPriest.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.cardDot, { backgroundColor: '#C45B28' }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={1}>
                {selectedPriest.name}
              </Text>
              <View style={styles.cardMeta}>
                <MapPinIcon size={11} color={Colors.textTertiary} />
                <Text style={styles.cardMetaText}>
                  {selectedPriest.city}, {selectedPriest.state}
                </Text>
              </View>
              <View style={styles.cardMeta}>
                <StarIcon size={11} color={Colors.gold} />
                <Text style={styles.cardMetaText}>
                  {selectedPriest.rating} -- {selectedPriest.experience} yrs
                </Text>
                <Text style={styles.cardPrice}>
                  {'\u20B9'}{selectedPriest.premiumRate}/session
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}

        {!selectedItem && (
          <Text style={styles.hint}>Tap a pin to see details</Text>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1A3A5C' }]} />
            <Text style={styles.legendText}>
              Temples ({temples.length})
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#C45B28' }]} />
            <Text style={styles.legendText}>
              Priests ({priests.length})
            </Text>
          </View>
        </View>
      </ScrollView>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    borderColor: Colors.text,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  filterTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  mapContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    ...Typography.subheading,
    color: Colors.text,
    fontSize: 15,
  },
  cardDeity: {
    ...Typography.caption,
    color: Colors.primary,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardMetaText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  cardPrice: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
