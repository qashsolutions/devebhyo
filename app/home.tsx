// Screen 4: Home - Temple List (minimal, show only what's asked)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/theme';
import { temples, states } from '../src/data/temples';
import {
  SearchIcon,
  TempleIcon,
  PriestIcon,
  MapPinIcon,
  SettingsIcon,
  ChevronRightIcon,
  MicIcon,
} from '../src/components/Icons';
import { Temple } from '../src/types';

type Tab = 'temples' | 'priests' | 'map';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('temples');
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');

  const filteredTemples = temples.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()) ||
      t.deity.toLowerCase().includes(search.toLowerCase());
    const matchState = !selectedState || t.state === selectedState;
    return matchSearch && matchState;
  });

  const renderTemple = ({ item }: { item: Temple }) => (
    <TouchableOpacity
      style={styles.templeCard}
      onPress={() => router.push(`/temple/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.templeInfo}>
        <Text style={styles.templeName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.templeDeity}>{item.deity}</Text>
        <View style={styles.locationRow}>
          <MapPinIcon size={13} color={Colors.textTertiary} />
          <Text style={styles.locationText}>
            {item.city}, {item.state}
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={20} color={Colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Devebhyo Namaḥ</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <SettingsIcon size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search temples, deities, cities..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.micButton}>
          <MicIcon size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {([
          { key: 'temples' as Tab, label: 'Temples', icon: TempleIcon },
          { key: 'priests' as Tab, label: 'Priests', icon: PriestIcon },
          { key: 'map' as Tab, label: 'Map', icon: MapPinIcon },
        ]).map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => {
              if (key === 'priests') router.push('/priests');
              else if (key === 'map') router.push('/map');
              else setActiveTab(key);
            }}
          >
            <Icon
              size={16}
              color={activeTab === key ? Colors.primary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* State filter chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['', ...states]}
        keyExtractor={(item) => item || 'all'}
        contentContainerStyle={styles.chipList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              (item === '' ? !selectedState : selectedState === item) &&
                styles.chipActive,
            ]}
            onPress={() => setSelectedState(item)}
          >
            <Text
              style={[
                styles.chipText,
                (item === '' ? !selectedState : selectedState === item) &&
                  styles.chipTextActive,
              ]}
            >
              {item || 'All'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Temple list */}
      <FlatList
        data={filteredTemples}
        keyExtractor={(item) => item.id}
        renderItem={renderTemple}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No temples found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  greeting: {
    ...Typography.heading,
    color: Colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    height: 44,
  },
  micButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  tabText: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  chipList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  templeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  templeInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  templeName: {
    ...Typography.subheading,
    color: Colors.text,
  },
  templeDeity: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  empty: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textTertiary,
  },
});
