// Screen 2: Phone Login + OTP
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { PhoneIcon, ChevronLeftIcon, MicIcon } from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';

type Stage = 'phone' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const { setLoggedIn, setUser } = useApp();
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleSendOTP = () => {
    if (phone.length < 10) return;
    setLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setLoading(false);
      setStage('otp');
    }, 800);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (index === 5 && text) {
      handleVerify(newOtp);
    }
  };

  const handleVerify = (otpDigits: string[] = otp) => {
    const code = otpDigits.join('');
    if (code.length < 6) return;
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      setLoggedIn(true);
      setUser({ phoneNumber: `+91${phone}`, dateOfBirth: '' });
      router.push('/profile-setup');
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (stage === 'otp' ? setStage('phone') : router.back())}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {stage === 'phone' ? (
          <>
            <View style={styles.iconWrap}>
              <PhoneIcon size={28} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.description}>
              We will send a verification code via SMS
            </Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Mobile number"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                autoFocus
              />
            </View>

            <TouchableOpacity style={styles.voiceHint}>
              <MicIcon size={16} color={Colors.textSecondary} />
              <Text style={styles.voiceHintText}>
                Voice input available in your language
              </Text>
            </TouchableOpacity>

            <Button
              title="Send Verification Code"
              onPress={handleSendOTP}
              loading={loading}
              disabled={phone.length < 10}
              size="lg"
              style={styles.button}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Verification code</Text>
            <Text style={styles.description}>
              Enter the 6-digit code sent to +91 {phone}
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { otpRefs.current[i] = ref; }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, i)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !digit && i > 0) {
                      otpRefs.current[i - 1]?.focus();
                    }
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </View>

            <Button
              title="Verify"
              onPress={() => handleVerify()}
              loading={loading}
              disabled={otp.join('').length < 6}
              size="lg"
              style={styles.button}
            />

            <TouchableOpacity style={styles.resend}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
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
    marginBottom: Spacing.xxl,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  countryCode: {
    height: 52,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
  },
  countryCodeText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    color: Colors.text,
  },
  voiceHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  voiceHintText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  otpInput: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  button: {
    width: '100%',
  },
  resend: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resendText: {
    ...Typography.label,
    color: Colors.primary,
  },
});
