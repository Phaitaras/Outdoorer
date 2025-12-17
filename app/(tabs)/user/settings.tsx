import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();

    const settingsItems = [
        { label: 'Profile Settings', route: '/user/settings/profile' },
        { label: 'Preferences', route: '/user/settings/preferences' },
        { label: 'Notifications', route: '/user/settings/notifications' },
    ];

    return (
        <View className="flex-1 bg-[#F6F6F7]">
            <View className="bg-white px-6 py-4 border-b border-outline-100">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
                    </Pressable>
                    <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
                        Settings
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

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
                </View>
            </ScrollView>
        </View>
    );
}