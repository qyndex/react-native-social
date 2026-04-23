import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const MAX_LENGTH = 500;

export default function ComposeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || !user) return;

    setSubmitting(true);
    const { error } = await supabase.from('posts').insert({
      author_id: user.id,
      content: content.trim(),
    });
    setSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Cancel"
          >
            <Text style={[styles.cancelText, { color: colors.tint }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.postButton,
              {
                backgroundColor: content.trim() ? colors.tint : colors.border,
              },
            ]}
            onPress={handlePost}
            disabled={!content.trim() || submitting}
            accessibilityLabel="Publish post"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={content}
          onChangeText={(text) => setContent(text.slice(0, MAX_LENGTH))}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.subtext}
          multiline
          autoFocus
          textAlignVertical="top"
          accessibilityLabel="Post content"
        />

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text
            style={[
              styles.charCount,
              {
                color:
                  content.length > MAX_LENGTH * 0.9 ? '#ef4444' : colors.subtext,
              },
            ]}
          >
            {content.length}/{MAX_LENGTH}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancelText: { fontSize: 16 },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  charCount: { fontSize: 13 },
});
