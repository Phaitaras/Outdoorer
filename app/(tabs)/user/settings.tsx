import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { UserHeader } from '@/components/user/userHeader';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const settingsItems = [
        { label: 'Profile Settings', route: '/user/settings/profile' },
        { label: 'Preferences', route: '/user/settings/preferences' },
        { label: 'Notifications', route: '/user/settings/notifications' },
    ];

    return (
        <View className="flex-1 bg-[#F6F6F7]">
            <UserHeader title="Settings" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-white flex-col rounded-2xl shadow-soft-1">
                        {settingsItems.map((item, index) => (
                            <React.Fragment key={item.route}>
                                <Pressable
                                    onPress={() => router.push(item.route as any)}
                                    className="flex-row items-center justify-between p-5 active:bg-background-50"
                                >
                                    <Text className="text-base text-typography-900" style={{ fontFamily: 'Roboto-Regular' }}>
                                        {item.label}
                                    </Text>
                                    <ChevronRightIcon className="w-5 h-5 text-typography-400" />
                                </Pressable>
                                {index < settingsItems.length - 1 && (
                                    <Divider />
                                )}
                            </React.Fragment>
                        ))}
                    </View>

                    <Pressable
                        onPress={async () => {
                            setLoading(true);
                            try {
                                await supabase.auth.signOut();
                                router.replace('/(start)');
                            } catch (error) {
                                console.error('Error signing out:', error);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="bg-white rounded-2xl shadow-soft-1 p-5 mt-6 active:bg-background-50"
                    >
                        <Text
                            className="text-base text-center"
                            style={{
                                fontFamily: 'Roboto-Medium',
                                color: '#DC2626'
                            }}
                        >
                            {loading ? 'Logging out...' : 'Log Out'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}