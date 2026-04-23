import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .or(`username.ilike.%${text}%,full_name.ilike.%${text}%`)
      .limit(20);

    setResults(
      (data ?? []).map((p) => ({
        id: p.id,
        username: p.username,
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
      })),
    );
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, backgroundColor: colors.card }]}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search users..."
          placeholderTextColor={colors.subtext}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search users"
        />
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.tint} />
        </View>
      )}

      {!loading && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={results.length === 0 ? styles.emptyList : undefined}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push({ pathname: '/profile/[id]', params: { id: item.id } })}
              accessibilityLabel={`View ${item.fullName || item.username}'s profile`}
            >
              <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                <Text style={styles.avatarInitial}>
                  {(item.fullName || item.username).charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultName, { color: colors.text }]}>
                  {item.fullName || item.username}
                </Text>
                <Text style={[styles.resultHandle, { color: colors.subtext }]}>
                  @{item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searched ? (
              <View style={styles.centered}>
                <Ionicons name="people-outline" size={48} color={colors.subtext} />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No users found
                </Text>
              </View>
            ) : (
              <View style={styles.centered}>
                <Ionicons name="search-outline" size={48} color={colors.subtext} />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  Search for people to follow
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  searchIcon: { position: 'absolute', left: 28, zIndex: 1 },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 16,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyList: { flexGrow: 1 },
  emptyText: { fontSize: 16, marginTop: 12 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: { color: '#fff', fontSize: 18, fontWeight: '700' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: '600' },
  resultHandle: { fontSize: 14, marginTop: 2 },
});
