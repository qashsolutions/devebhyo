// Screen 5: Temple Detail
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { getTempleById } from '../../src/data/temples';
import {
  ChevronLeftIcon,
  MapPinIcon,
  ClockIcon,
  ChevronRightIcon,
} from '../../src/components/Icons';
import { Seva } from '../../src/types';

export default function TempleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const temple = getTempleById(id);

  if (!temple) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Temple not found</Text>
      </View>
    );
  }

  const sevasByCategory = temple.sevas.reduce(
    (acc, seva) => {
      if (!acc[seva.category]) acc[seva.category] = [];
      acc[seva.category].push(seva);
      return acc;
    },
    {} as Record<string, Seva[]>
  );

  const categoryLabels: Record<string, string> = {
    archana: 'Archana',
    abhishekam: 'Abhishekam',
    homam: 'Homam',
    puja: 'Puja',
    darshan: 'Darshan',
    donation: 'Donation',
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          Temple
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Temple name and deity */}
        <Text style={styles.templeName}>{temple.name}</Text>
        <Text style={styles.deity}>{temple.deity}</Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <MapPinIcon size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{temple.address}</Text>
        </View>

        {/* Timings */}
        <View style={styles.infoRow}>
          <ClockIcon size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{temple.timings}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{temple.description}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Services / Sevas */}
        <Text style={styles.sectionTitle}>Services</Text>
        <Text style={styles.sectionSubtitle}>
          Temple donations go 100% to the temple
        </Text>

        {Object.entries(sevasByCategory).map(([category, sevas]) => (
          <View key={category} style={styles.categoryGroup}>
            <Text style={styles.categoryLabel}>
              {categoryLabels[category] || category}
            </Text>
            {sevas.map((seva) => (
              <TouchableOpacity
                key={seva.id}
                style={styles.sevaRow}
                onPress={() =>
                  router.push(
                    `/service?templeId=${temple.id}&sevaId=${seva.id}`
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.sevaInfo}>
                  <Text style={styles.sevaName}>{seva.name}</Text>
                  <Text style={styles.sevaDesc}>{seva.description}</Text>
                </View>
                <View style={styles.sevaRight}>
                  {seva.price > 0 ? (
                    <Text style={styles.sevaPrice}>
                      {'\u20B9'}{seva.price}
                    </Text>
                  ) : (
                    <Text style={styles.sevaDonation}>Any amount</Text>
                  )}
                  <ChevronRightIcon size={16} color={Colors.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* View on map */}
        <Button
          title="View on Map"
          variant="outline"
          onPress={() => router.push(`/map?highlight=${temple.id}`)}
          style={styles.mapButton}
        />
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
  templeName: {
    ...Typography.displayMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  deity: {
    ...Typography.body,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  descriptionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.accent,
    marginBottom: Spacing.lg,
  },
  categoryGroup: {
    marginBottom: Spacing.lg,
  },
  categoryLabel: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  sevaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sevaInfo: {
    flex: 1,
    gap: 2,
  },
  sevaName: {
    ...Typography.label,
    color: Colors.text,
  },
  sevaDesc: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  sevaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sevaPrice: {
    ...Typography.label,
    color: Colors.text,
  },
  sevaDonation: {
    ...Typography.caption,
    color: Colors.accent,
    fontStyle: 'italic',
  },
  mapButton: {
    marginTop: Spacing.lg,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 100,
  },
});
