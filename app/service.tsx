// Screen 9: Service/Seva Selection + Payment Summary
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { getTempleById } from '../src/data/temples';
import { getPriestById } from '../src/data/priests';
import {
  ChevronLeftIcon,
  CheckIcon,
  TempleIcon,
  PriestIcon,
} from '../src/components/Icons';

export default function ServiceScreen() {
  const router = useRouter();
  const { templeId, sevaId, priestId, date, time } =
    useLocalSearchParams<{
      templeId?: string;
      sevaId?: string;
      priestId?: string;
      date?: string;
      time?: string;
    }>();

  const temple = templeId ? getTempleById(templeId) : null;
  const priest = priestId ? getPriestById(priestId) : null;
  const seva = temple?.sevas.find((s) => s.id === sevaId);
  const isDonation = seva?.category === 'donation';
  const [donationAmount, setDonationAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const amount = priest
    ? priest.premiumRate
    : isDonation
    ? parseInt(donationAmount) || 0
    : seva?.price || 0;

  const serviceFee = isDonation ? 0 : Math.round(amount * 0.05);
  const total = amount + serviceFee;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 1000);
  };

  if (confirmed) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmIcon}>
          <CheckIcon size={48} color={Colors.accent} />
        </View>
        <Text style={styles.confirmTitle}>Booking Confirmed</Text>
        <Text style={styles.confirmDesc}>
          {priest
            ? `Your 1:1 session with ${priest.name} has been booked.`
            : isDonation
            ? `Your donation of ${'\u20B9'}${donationAmount} has been received. 100% goes to the temple.`
            : `Your ${seva?.name} seva has been booked.`}
        </Text>
        {date && (
          <Text style={styles.confirmMeta}>
            {date} at {time}
          </Text>
        )}
        <Button
          title="Back to Home"
          onPress={() => router.push('/home')}
          style={styles.confirmButton}
        />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>
          {isDonation ? 'Donation' : 'Booking'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Service summary */}
        <View style={styles.summaryCard}>
          {temple && (
            <View style={styles.summaryRow}>
              <TempleIcon size={18} color={Colors.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Temple</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {temple.name}
                </Text>
              </View>
            </View>
          )}

          {seva && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>{seva.name}</Text>
                <Text style={styles.summaryDesc}>{seva.description}</Text>
              </View>
            </View>
          )}

          {priest && (
            <View style={styles.summaryRow}>
              <PriestIcon size={18} color={Colors.primary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Priest</Text>
                <Text style={styles.summaryValue}>{priest.name}</Text>
                <Text style={styles.summaryDesc}>
                  1:1 Premium Session
                </Text>
              </View>
            </View>
          )}

          {date && time && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>When</Text>
                <Text style={styles.summaryValue}>
                  {date} at {time}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Donation amount input */}
        {isDonation && (
          <View style={styles.donationSection}>
            <Text style={styles.donationNote}>
              100% of your donation goes directly to the temple.
              We do not charge any fee on donations.
            </Text>
            <Text style={styles.fieldLabel}>Donation amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>{'\u20B9'}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                value={donationAmount}
                onChangeText={setDonationAmount}
                autoFocus
              />
            </View>
            {/* Quick amounts */}
            <View style={styles.quickAmounts}>
              {['101', '251', '501', '1001'].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.quickAmount,
                    donationAmount === amt && styles.quickAmountActive,
                  ]}
                  onPress={() => setDonationAmount(amt)}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      donationAmount === amt && styles.quickAmountTextActive,
                    ]}
                  >
                    {'\u20B9'}{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Price breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceCardTitle}>Payment Summary</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {isDonation ? 'Donation' : priest ? 'Session fee' : 'Seva fee'}
            </Text>
            <Text style={styles.priceValue}>
              {'\u20B9'}{amount}
            </Text>
          </View>

          {serviceFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Platform fee (5%)</Text>
              <Text style={styles.priceValue}>
                {'\u20B9'}{serviceFee}
              </Text>
            </View>
          )}

          {isDonation && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: Colors.accent }]}>
                Platform fee
              </Text>
              <Text style={[styles.priceValue, { color: Colors.accent }]}>
                {'\u20B9'}0
              </Text>
            </View>
          )}

          <View style={styles.totalDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {'\u20B9'}{total}
            </Text>
          </View>
        </View>

        {!isDonation && (
          <Text style={styles.feeNote}>
            We only charge for additional services/sevas.
            Temple donations always go 100% to the temple.
          </Text>
        )}

        <Button
          title={isDonation ? `Donate ${'\u20B9'}${amount}` : `Pay ${'\u20B9'}${total}`}
          onPress={handleConfirm}
          loading={loading}
          disabled={amount <= 0}
          size="lg"
          style={styles.payButton}
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
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryInfo: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    ...Typography.subheading,
    color: Colors.text,
  },
  summaryDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  donationSection: {
    marginBottom: Spacing.xl,
  },
  donationNote: {
    ...Typography.bodySmall,
    color: Colors.accent,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  currencySymbol: {
    ...Typography.displayMedium,
    color: Colors.textTertiary,
  },
  amountInput: {
    flex: 1,
    height: 56,
    ...Typography.displayMedium,
    color: Colors.text,
    paddingLeft: Spacing.sm,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAmount: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  quickAmountActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickAmountText: {
    ...Typography.label,
    color: Colors.text,
  },
  quickAmountTextActive: {
    color: Colors.white,
  },
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  priceCardTitle: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  priceValue: {
    ...Typography.body,
    color: Colors.text,
  },
  totalDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    ...Typography.subheading,
    color: Colors.text,
  },
  totalValue: {
    ...Typography.displayMedium,
    color: Colors.text,
  },
  feeNote: {
    ...Typography.caption,
    color: Colors.textTertiary,
    lineHeight: 16,
    marginBottom: Spacing.xl,
  },
  payButton: {
    marginTop: Spacing.lg,
  },
  // Confirmation
  confirmContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  confirmIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  confirmTitle: {
    ...Typography.displayMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  confirmDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  confirmMeta: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginBottom: Spacing.xxl,
  },
  confirmButton: {
    width: '100%',
  },
});
