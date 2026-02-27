// Screen 6: Map View - India map with temple pins
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
import { IndiaMap } from '../src/components/IndiaMap';
import { temples } from '../src/data/temples';
import {
  ChevronLeftIcon,
  MapPinIcon,
  ChevronRightIcon,
  ClockIcon,
} from '../src/components/Icons';

const { width: screenWidth } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { highlight } = useLocalSearchParams<{ highlight?: string }>();
  const [selectedId, setSelectedId] = useState<string>(highlight || '');

  const pins = temples.map((t) => ({
    id: t.id,
    latitude: t.latitude,
    longitude: t.longitude,
    label: t.city,
  }));

  const selectedTemple = temples.find((t) => t.id === selectedId);

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
        <Text style={styles.headerTitle}>Temple Map</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* State count summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>20</Text>
            <Text style={styles.summaryLabel}>Temples</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>5</Text>
            <Text style={styles.summaryLabel}>States</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>12</Text>
            <Text style={styles.summaryLabel}>Cities</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <IndiaMap
            width={screenWidth - 48}
            height={400}
            pins={pins}
            selectedPinId={selectedId}
            onPinPress={(id) => setSelectedId(id === selectedId ? '' : id)}
          />
        </View>

        {/* Selected temple info card */}
        {selectedTemple && (
          <TouchableOpacity
            style={styles.selectedCard}
            onPress={() => router.push(`/temple/${selectedTemple.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedName} numberOfLines={1}>
                {selectedTemple.name}
              </Text>
              <Text style={styles.selectedDeity}>
                {selectedTemple.deity}
              </Text>
              <View style={styles.selectedMeta}>
                <MapPinIcon size={12} color={Colors.textTertiary} />
                <Text style={styles.selectedLocation}>
                  {selectedTemple.city}, {selectedTemple.state}
                </Text>
              </View>
              <View style={styles.selectedMeta}>
                <ClockIcon size={12} color={Colors.textTertiary} />
                <Text style={styles.selectedLocation}>
                  {selectedTemple.timings}
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}

        {!selectedTemple && (
          <View style={styles.hint}>
            <MapPinIcon size={16} color={Colors.textTertiary} />
            <Text style={styles.hintText}>
              Tap a pin on the map to see temple details
            </Text>
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.primary }]}
            />
            <Text style={styles.legendText}>Temple location</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: Colors.primaryLight,
                  opacity: 0.3,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                },
              ]}
            />
            <Text style={styles.legendText}>South India coverage</Text>
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
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    ...Typography.displayMedium,
    color: Colors.primary,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  mapContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  selectedInfo: {
    flex: 1,
    gap: 4,
  },
  selectedName: {
    ...Typography.subheading,
    color: Colors.text,
  },
  selectedDeity: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedLocation: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  hintText: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
  legend: {
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
