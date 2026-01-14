import { ActivitySelector } from '@/components/onboarding';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ACTIVITY_TO_LABEL, LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useProfile } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function ProfileSettingsScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const { data: profile } = useProfile(userId);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        })();
    }, []);

    useEffect(() => {
        if (profile) {
            setName(profile.username || '');
            setTitle(profile.title || '');
            const activityLabels = profile.activity_types.map(type => LABEL_TO_ACTIVITY[type]).filter(Boolean);
            setSelected(activityLabels);
        }
    }, [profile]);

    const toggle = (label: string) =>
        setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

    return (
        <View className="flex-1 bg-[#F6F6F7]">

            <View className="bg-white px-6 py-4 border-b border-outline-100">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
                    </Pressable>
                    <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
                        Profile Settings
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 gap-6">
                    <View className="bg-white rounded-2xl p-6 shadow-soft-1">

                        <View className="mb-4">
                            <Text className="text-sm text-typography-700 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
                                Username
                            </Text>
                            <Input variant="outline" size="md">
                                <InputField
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    style={{ fontFamily: 'Roboto-Regular' }}
                                />
                            </Input>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm text-typography-700 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
                                Title
                            </Text>
                            <Input variant="outline" size="md">
                                <InputField
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="e.g. Outdoor Enthusiast"
                                    style={{ fontFamily: 'Roboto-Regular' }}
                                />
                            </Input>
                        </View>

                        <View>
                            <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
                                Activity Types
                            </Text>
                            <ActivitySelector selected={selected} onToggle={toggle} />
                        </View>
                    </View>

                    <Button
                        variant="solid"
                        className="rounded-lg bg-tertiary-400"
                        disabled={loading}
                        onPress={async () => {
                            if (!userId) return;
                            setLoading(true);
                            try {
                                const activityTypes = selected
                                    .map(label => ACTIVITY_TO_LABEL[label])
                                    .filter(Boolean);
                                
                                const { error } = await supabase
                                    .from('profile')
                                    .update({
                                        username: name,
                                        title: title,
                                        activity_types: activityTypes,
                                    })
                                    .eq('id', userId);

                                if (error) throw error;
                                await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
                                router.back();
                            } catch (error) {
                                console.error('Error updating profile:', error);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </ButtonText>
                    </Button>
                    
                </View>
            </ScrollView>
        </View>
    );
}
