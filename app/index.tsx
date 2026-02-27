// Screen 1: Welcome / Splash
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { OmIcon, TempleIcon } from '../src/components/Icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <OmIcon size={64} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Devebhyo</Text>
        <Text style={styles.subtitle}>Namaḥ</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>
          Connect with temples and priests{'\n'}across South India
        </Text>
      </View>

      <View style={styles.statesRow}>
        {['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Maharashtra'].map(
          (state) => (
            <View key={state} style={styles.stateBadge}>
              <Text style={styles.stateText}>{state}</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.featureRow}>
          <TempleIcon size={18} color={Colors.textSecondary} />
          <Text style={styles.featureText}>20 sacred temples</Text>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.dot} />
          <Text style={styles.featureText}>Voice-first in your language</Text>
        </View>
        <View style={styles.featureRow}>
          <View style={styles.dot} />
          <Text style={styles.featureText}>100% donations reach the temple</Text>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.primary,
    marginVertical: Spacing.xl,
    opacity: 0.4,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  stateBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomSection: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  button: {
    marginTop: Spacing.lg,
    width: '100%',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
