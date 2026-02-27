// Screen 8: Priest Detail + 1:1 Booking
import React, { useState } from 'react';
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
import { getPriestById } from '../../src/data/priests';
import {
  ChevronLeftIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  GlobeIcon,
  CalendarIcon,
} from '../../src/components/Icons';

export default function PriestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const priest = getPriestById(id);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  if (!priest) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Priest not found</Text>
      </View>
    );
  }

  // Generate next 7 dates
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      key: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate().toString(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM',
    '10:00 AM', '11:00 AM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM',
  ];

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
        <Text style={styles.headerTitle}>Priest</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {priest.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>

          <Text style={styles.priestName}>{priest.name}</Text>

          <View style={styles.metaRow}>
            <MapPinIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {priest.city}, {priest.state}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <StarIcon size={14} color={Colors.gold} />
              <Text style={styles.statValue}>{priest.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <ClockIcon size={14} color={Colors.textSecondary} />
              <Text style={styles.statValue}>{priest.experience}</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {'\u20B9'}{priest.premiumRate}
              </Text>
              <Text style={styles.statLabel}>Per session</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.bio}>{priest.bio}</Text>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <GlobeIcon size={16} color={Colors.textSecondary} />
            <Text style={styles.sectionLabel}>Languages</Text>
          </View>
          <View style={styles.badgeRow}>
            {priest.languages.map((lang) => (
              <View key={lang} style={styles.badge}>
                <Text style={styles.badgeText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Specializations</Text>
          <View style={styles.badgeRow}>
            {priest.specializations.map((spec) => (
              <View key={spec} style={[styles.badge, styles.specBadge]}>
                <Text style={[styles.badgeText, styles.specBadgeText]}>
                  {spec}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking section */}
        {priest.available && (
          <>
            <View style={styles.divider} />
            <Text style={styles.bookingTitle}>Book 1:1 Session</Text>

            {/* Date selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CalendarIcon size={16} color={Colors.textSecondary} />
                <Text style={styles.sectionLabel}>Select date</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateRow}
              >
                {dates.map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    style={[
                      styles.dateCard,
                      selectedDate === d.key && styles.dateCardActive,
                    ]}
                    onPress={() => setSelectedDate(d.key)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        selectedDate === d.key && styles.dateTextActive,
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNum,
                        selectedDate === d.key && styles.dateTextActive,
                      ]}
                    >
                      {d.date}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        selectedDate === d.key && styles.dateTextActive,
                      ]}
                    >
                      {d.month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time selection */}
            {selectedDate && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ClockIcon size={16} color={Colors.textSecondary} />
                  <Text style={styles.sectionLabel}>Select time</Text>
                </View>
                <View style={styles.timeGrid}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.timeSlotActive,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          selectedTime === time && styles.timeTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Book button */}
            <Button
              title={`Book Session -- ${'\u20B9'}${priest.premiumRate}`}
              onPress={() =>
                router.push(
                  `/service?priestId=${priest.id}&date=${selectedDate}&time=${selectedTime}`
                )
              }
              disabled={!selectedDate || !selectedTime}
              size="lg"
              style={styles.bookButton}
            />
          </>
        )}

        {!priest.available && (
          <View style={styles.unavailableCard}>
            <Text style={styles.unavailableText}>
              This priest is currently unavailable for bookings.
            </Text>
          </View>
        )}
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
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarLargeText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
  },
  priestName: {
    ...Typography.displayMedium,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.lg,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...Typography.subheading,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  bio: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  specBadge: {
    backgroundColor: Colors.goldLight,
    borderColor: Colors.goldLight,
  },
  specBadgeText: {
    color: Colors.gold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xl,
  },
  bookingTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  dateRow: {
    gap: Spacing.sm,
  },
  dateCard: {
    width: 60,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 2,
  },
  dateCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateDay: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  dateNum: {
    ...Typography.subheading,
    color: Colors.text,
  },
  dateMonth: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  dateTextActive: {
    color: Colors.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  timeSlotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    ...Typography.labelSmall,
    color: Colors.text,
  },
  timeTextActive: {
    color: Colors.white,
  },
  bookButton: {
    marginTop: Spacing.lg,
  },
  unavailableCard: {
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  unavailableText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 100,
  },
});
