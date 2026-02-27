// Screen 10: Settings (profile, language, delete account)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { useApp } from '../src/context/AppContext';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  GlobeIcon,
  TrashIcon,
  MicIcon,
} from '../src/components/Icons';

const LANGUAGES = [
  'English',
  'Telugu',
  'Tamil',
  'Kannada',
  'Hindi',
  'Marathi',
  'Malayalam',
  'Sanskrit',
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, selectedLanguage, setSelectedLanguage, logout } = useApp();
  const [showLanguages, setShowLanguages] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      setShowDeleteConfirm(true);
    } else {
      Alert.alert(
        'Delete Account',
        'This will permanently delete your account and all associated data. This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              logout();
              router.replace('/');
            },
          },
        ]
      );
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    logout();
    router.replace('/');
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile section */}
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <UserIcon size={18} color={Colors.textSecondary} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Phone</Text>
              <Text style={styles.rowValue}>
                {user?.phoneNumber || 'Not set'}
              </Text>
            </View>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Date of birth</Text>
              <Text style={styles.rowValue}>
                {user?.dateOfBirth || 'Not set'}
              </Text>
            </View>
          </View>
          {user?.name && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowLabel}>Name</Text>
                  <Text style={styles.rowValue}>{user.name}</Text>
                </View>
              </View>
            </>
          )}
          {user?.gotra && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowLabel}>Gotra</Text>
                  <Text style={styles.rowValue}>{user.gotra}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Language */}
        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setShowLanguages(!showLanguages)}
          >
            <GlobeIcon size={18} color={Colors.textSecondary} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>App language</Text>
              <Text style={styles.rowValue}>{selectedLanguage}</Text>
            </View>
            <ChevronRightIcon
              size={16}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>

          {showLanguages && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.languageGrid}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.langOption,
                      selectedLanguage === lang && styles.langOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedLanguage(lang);
                      setShowLanguages(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langText,
                        selectedLanguage === lang && styles.langTextActive,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Voice */}
        <Text style={styles.sectionLabel}>VOICE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <MicIcon size={18} color={Colors.textSecondary} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Voice input</Text>
              <Text style={styles.rowDesc}>
                Powered by Sarvam AI for Indian languages
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowValue}>1.0.0</Text>
            </View>
          </View>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Privacy Policy</Text>
            </View>
            <ChevronRightIcon size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Terms of Service</Text>
            </View>
            <ChevronRightIcon size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <Text style={styles.dangerLabel}>DANGER ZONE</Text>
        <View style={styles.dangerCard}>
          <TouchableOpacity
            style={styles.deleteRow}
            onPress={handleDeleteAccount}
          >
            <TrashIcon size={18} color={Colors.error} />
            <View style={styles.deleteInfo}>
              <Text style={styles.deleteTitle}>Delete Account</Text>
              <Text style={styles.deleteDesc}>
                Permanently delete your account and all associated data.
                This action cannot be undone.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Web delete confirmation modal */}
        {showDeleteConfirm && (
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmModal}>
              <Text style={styles.confirmTitle}>Delete Account</Text>
              <Text style={styles.confirmDesc}>
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingBottom: 60,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...Typography.label,
    color: Colors.text,
  },
  rowValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  rowDesc: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.lg,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  langOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  langOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langText: {
    ...Typography.labelSmall,
    color: Colors.text,
  },
  langTextActive: {
    color: Colors.white,
  },
  logoutButton: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    ...Typography.label,
    color: Colors.text,
  },
  dangerLabel: {
    ...Typography.caption,
    color: Colors.error,
    letterSpacing: 1,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  dangerCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.errorLight,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  deleteInfo: {
    flex: 1,
    gap: 4,
  },
  deleteTitle: {
    ...Typography.label,
    color: Colors.error,
  },
  deleteDesc: {
    ...Typography.caption,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
  // Web confirmation overlay
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  confirmModal: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  confirmTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  confirmDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    ...Typography.label,
    color: Colors.text,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.error,
  },
  deleteButtonText: {
    ...Typography.label,
    color: Colors.white,
  },
});
