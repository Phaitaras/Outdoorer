import { Button, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ProfileCard } from '@/components/user/profileCard';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function AddFriendScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResult, setShowResult] = useState(false);

    const mockAccount = {
        name: 'John123',
        title: 'Novice Outdoorer',
        activities: ['🏃‍♂️  Running', '🚴‍♀️  Cycling', '🥾  Hiking'],
        friendsCount: 15,
        activitiesCount: 42,
        reviewsCount: 5,
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowResult(true);
        }
    };

    return (
        <View className="flex-1 bg-[#F6F6F7]">

            <View className="bg-white px-6 py-4 border-b border-outline-100">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeftIcon className="w-6 h-6 text-typography-700" />
                    </Pressable>
                    <Text className="text-xl" style={{ fontFamily: 'Roboto-Medium' }}>
                        Add Friend
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 gap-6">

                    <View>
                        <Text className="text-sm text-typography-700 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
                            Search by username
                        </Text>
                        <Input className="rounded-xl" size="md">
                            <InputField
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Enter username"
                                className="pl-3"
                                style={{ fontFamily: 'Roboto-Regular' }}
                                onSubmitEditing={handleSearch}
                            />
                            <Button variant="link" size="sm" className="mr-2" onPress={handleSearch}>
                                <ButtonIcon as={Search} />
                            </Button>
                        </Input>
                    </View>

                    {showResult && (
                        <View>
                            <Text className="text-sm text-typography-600 mb-3" style={{ fontFamily: 'Roboto-Regular' }}>
                                Search Result
                            </Text>
                            <ProfileCard
                                name={mockAccount.name}
                                title={mockAccount.title}
                                activities={mockAccount.activities}
                                friendsCount={mockAccount.friendsCount}
                                activitiesCount={mockAccount.activitiesCount}
                                reviewsCount={mockAccount.reviewsCount}
                                showSettings={false}
                                showButtons={true}
                                onAddFriendPress={() => {
                                    // TODO: Implement add friend logic
                                    console.log('Add friend pressed');
                                }}
                                onViewBookmarksPress={undefined}
                            />
                        </View>
                    )}

                    {!showResult && (
                        <View className="items-center justify-center py-12">
                            <Text className="text-typography-400" style={{ fontFamily: 'Roboto-Regular' }}>
                                Search for a username to find friends
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
