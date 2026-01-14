import { Button, ButtonText } from '@/components/ui/button';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { useProfile } from '@/features/profile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, CircleIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function PreferencesSettingsScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [unitSystem, setUnitSystem] = useState('metric');
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
            setUnitSystem(profile.metric || 'metric');
        }
    }, [profile]);

    return (
        <View className="flex-1 bg-[#F6F6F7]">

            <View className="bg-white px-6 py-4 border-b border-outline-100">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
                    </Pressable>
                    <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
                        Preferences
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 gap-6">
                    <View className="bg-white rounded-2xl p-6 shadow-soft-1">

                        <View>
                            <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
                                Weather Units
                            </Text>
                            <RadioGroup value={unitSystem} onChange={setUnitSystem}>
                                <View className="gap-3">
                                    <Radio value="metric">
                                        <RadioIndicator>
                                            <RadioIcon as={CircleIcon} />
                                        </RadioIndicator>
                                        <RadioLabel style={{ fontFamily: 'Roboto-Regular' }}>
                                            Metric (°C, km/h, mm)
                                        </RadioLabel>
                                    </Radio>
                                    <Radio value="imperial">
                                        <RadioIndicator>
                                            <RadioIcon as={CircleIcon} />
                                        </RadioIndicator>
                                        <RadioLabel style={{ fontFamily: 'Roboto-Regular' }}>
                                            Imperial (°F, mph, in)
                                        </RadioLabel>
                                    </Radio>
                                </View>
                            </RadioGroup>
                        </View>
                    </View>

                    <Button
                        variant="solid"
                        className="mb-4 rounded-lg bg-tertiary-400"
                        disabled={loading}
                        onPress={async () => {
                            if (!userId) return;
                            setLoading(true);
                            try {
                                const { error } = await supabase
                                    .from('profile')
                                    .update({ metric: unitSystem as 'metric' | 'imperial' })
                                    .eq('id', userId);

                                if (error) throw error;
                                await queryClient.invalidateQueries({ queryKey: ['profile', userId] });
                                router.back();
                            } catch (error) {
                                console.error('Error updating preferences:', error);
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
