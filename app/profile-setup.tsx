// Screen 3: Profile Setup (DOB, conditional fields)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { CalendarIcon, UserIcon } from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gotra, setGotra] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | ''>('');
  const [children, setChildren] = useState('');

  // Calculate age from DOB string (DD/MM/YYYY)
  const getAge = (): number => {
    if (dob.length < 10) return 0;
    const parts = dob.split('/');
    if (parts.length !== 3) return 0;
    const birthDate = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    );
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge();
  const showMarriage = age >= 18;
  const showChildren = maritalStatus === 'married';

  const formatDob = (text: string) => {
    // Auto-format as DD/MM/YYYY
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
    setDob(formatted);
  };

  const handleContinue = () => {
    if (!dob || dob.length < 10) return;
    setUser({
      ...user!,
      name: name || undefined,
      dateOfBirth: dob,
      gotra: gotra || undefined,
      nakshatra: nakshatra || undefined,
      maritalStatus: maritalStatus as 'single' | 'married' | undefined,
      numberOfChildren: children ? parseInt(children) : undefined,
    });
    router.push('/home');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <UserIcon size={28} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Your details</Text>
        <Text style={styles.description}>
          Helps us personalize services for you
        </Text>
      </View>

      {/* Name (optional) */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          Name <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* DOB (required) */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          Date of birth <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWithIcon}>
          <CalendarIcon size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.inputInner}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="number-pad"
            maxLength={10}
            value={dob}
            onChangeText={formatDob}
          />
        </View>
        {age > 0 && (
          <Text style={styles.ageHint}>{age} years</Text>
        )}
      </View>

      {/* Gotra (optional) */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          Gotra <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Bharadwaja, Kashyapa"
          placeholderTextColor={Colors.textTertiary}
          value={gotra}
          onChangeText={setGotra}
        />
      </View>

      {/* Nakshatra (optional) */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          Nakshatra <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Ashwini, Rohini"
          placeholderTextColor={Colors.textTertiary}
          value={nakshatra}
          onChangeText={setNakshatra}
        />
      </View>

      {/* Marriage - shown if age >= 18 */}
      {showMarriage && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Marital status <Text style={styles.optional}>(optional)</Text>
          </Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggle,
                maritalStatus === 'single' && styles.toggleActive,
              ]}
              onPress={() => setMaritalStatus('single')}
            >
              <Text
                style={[
                  styles.toggleText,
                  maritalStatus === 'single' && styles.toggleTextActive,
                ]}
              >
                Single
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggle,
                maritalStatus === 'married' && styles.toggleActive,
              ]}
              onPress={() => setMaritalStatus('married')}
            >
              <Text
                style={[
                  styles.toggleText,
                  maritalStatus === 'married' && styles.toggleTextActive,
                ]}
              >
                Married
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Children - shown if married */}
      {showChildren && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Number of children <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={[styles.input, { width: 80 }]}
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="number-pad"
            maxLength={2}
            value={children}
            onChangeText={setChildren}
          />
        </View>
      )}

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={dob.length < 10}
        size="lg"
        style={styles.button}
      />

      <TouchableOpacity onPress={() => router.push('/home')}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.displayMedium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  field: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  optional: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontWeight: '400',
  },
  input: {
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    color: Colors.text,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  inputInner: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    height: 48,
  },
  ageHint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  toggle: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    ...Typography.label,
    color: Colors.text,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  button: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  skipText: {
    ...Typography.label,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
