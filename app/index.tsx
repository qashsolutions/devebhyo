// Screen 1: Welcome - India map hero with state tap to explore
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { IndiaMap, MapPin } from '../src/components/IndiaMap';
import { temples, getTemplesByState } from '../src/data/temples';
import { priests, getPriestsByState } from '../src/data/priests';
import {
  OmIcon,
  TempleIcon,
  PriestIcon,
  ChevronRightIcon,
  StarIcon,
  MapPinIcon,
} from '../src/components/Icons';

const { width: screenWidth } = Dimensions.get('window');
const ONBOARDED_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
];

const STATE_CYCLE_MS = 2200;

export default function WelcomeScreen() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<string>('');
  const [modalState, setModalState] = useState<string | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Auto-cycle through states to show presence
  useEffect(() => {
    let idx = 0;
    cycleRef.current = setInterval(() => {
      setActiveState(ONBOARDED_STATES[idx % ONBOARDED_STATES.length]);
      idx++;
    }, STATE_CYCLE_MS);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  const handleStatePress = (state: string) => {
    // Stop auto-cycle when user taps
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
    setActiveState(state);
    setModalState(state);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalState(null);
    setActiveState('');
  };

  // Build pins (no labels on welcome, just dots)
  const allPins: MapPin[] = [
    ...temples.map((t) => ({
      id: t.id,
      latitude: t.latitude,
      longitude: t.longitude,
      label: t.city,
      type: 'temple' as const,
    })),
    ...priests.map((p) => ({
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      label: p.city,
      type: 'priest' as const,
    })),
  ];

  const modalTemples = modalState ? getTemplesByState(modalState) : [];
  const modalPriests = modalState ? getPriestsByState(modalState) : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <OmIcon size={28} color={Colors.primary} />
        <Text style={styles.title}>Devebhyo</Text>
        <Text style={styles.subtitle}>
          Temples and priests across South India
        </Text>
      </View>

      {/* India Map - hero */}
      <View style={styles.mapContainer}>
        <IndiaMap
          width={screenWidth - 32}
          height={480}
          pins={allPins}
          highlightedStates={ONBOARDED_STATES}
          activeState={activeState}
          onStatePress={handleStatePress}
        />
        {activeState && !modalState ? (
          <Text style={styles.stateLabel}>{activeState}</Text>
        ) : null}
      </View>

      {/* Tap hint */}
      <Text style={styles.hint}>Tap a highlighted state to explore</Text>

      {/* Get Started */}
      <View style={styles.bottom}>
        <Button
          title="Get Started"
          onPress={() => router.push('/login')}
          size="lg"
          style={styles.button}
        />
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service
        </Text>
      </View>

      {/* State modal - nearest temples and priests */}
      <Modal
        visible={!!modalState}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[styles.modal, { opacity: fadeAnim }]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Modal header */}
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{modalState}</Text>
              <Text style={styles.modalSubtitle}>
                {modalTemples.length} temples, {modalPriests.length} priests
              </Text>

              {/* Temples */}
              {modalTemples.length > 0 && (
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <View
                      style={[styles.sectionDot, { backgroundColor: '#1A3A5C' }]}
                    />
                    <Text style={styles.sectionTitle}>Temples</Text>
                  </View>
                  {modalTemples.map((t) => (
                    <View key={t.id} style={styles.modalRow}>
                      <View style={styles.modalRowInfo}>
                        <Text style={styles.modalRowName} numberOfLines={1}>
                          {t.name}
                        </Text>
                        <Text style={styles.modalRowMeta}>
                          {t.deity} -- {t.city}
                        </Text>
                      </View>
                      <ChevronRightIcon size={14} color={Colors.textTertiary} />
                    </View>
                  ))}
                </View>
              )}

              {/* Priests */}
              {modalPriests.length > 0 && (
                <View style={styles.modalSection}>
                  <View style={styles.sectionHeader}>
                    <View
                      style={[styles.sectionDot, { backgroundColor: '#C45B28' }]}
                    />
                    <Text style={styles.sectionTitle}>Priests</Text>
                  </View>
                  {modalPriests.map((p) => (
                    <View key={p.id} style={styles.modalRow}>
                      <View style={styles.modalRowInfo}>
                        <Text style={styles.modalRowName} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={styles.modalRowMeta}>
                          {p.city} -- {p.experience} yrs --{' '}
                          {'\u20B9'}{p.premiumRate}/session
                        </Text>
                      </View>
                      <View style={styles.ratingBadge}>
                        <StarIcon size={9} color={Colors.gold} />
                        <Text style={styles.ratingText}>{p.rating}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* CTA */}
              <Button
                title="Get Started"
                onPress={() => {
                  closeModal();
                  router.push('/login');
                }}
                size="md"
                style={styles.modalButton}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.sm,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
  mapContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  stateLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingBottom: Spacing.sm,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.displayMedium,
    color: Colors.text,
  },
  modalSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  modalSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalRowInfo: {
    flex: 1,
    gap: 2,
  },
  modalRowName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  modalRowMeta: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.goldLight,
    borderRadius: Radius.sm,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.gold,
    fontWeight: '600',
  },
  modalButton: {
    marginTop: Spacing.lg,
    width: '100%',
  },
});
