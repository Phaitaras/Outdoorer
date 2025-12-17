import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function NotificationsSettingsScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#F6F6F7]">

            <View className="bg-white px-6 py-4 border-b border-outline-100">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
                    </Pressable>
                    <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
                        Notifications
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-white rounded-2xl p-6 shadow-soft-1">
                        <Text className="text-typography-500 text-center" style={{ fontFamily: 'Roboto-Regular' }}>
                            Notification settings coming soon
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
