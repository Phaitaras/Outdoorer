import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { ACTIVITIES } from '@/constants/activities';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function ProfileSettingsScreen() {
    const router = useRouter();
    const [name, setName] = useState('Placeholder Name');
    const [bio, setBio] = useState('');
    const [selected, setSelected] = useState<string[]>([
        '🏃‍♂️  Running',
        '🚴‍♀️  Cycling',
        '🥾  Hiking',
        '🧗  Rock Climbing',
        '🛶  Kayaking'
    ]);

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
                                Name
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
                                Bio
                            </Text>
                            <Textarea size="md" className="min-h-[100px]">
                                <TextareaInput
                                    value={bio}
                                    onChangeText={setBio}
                                    placeholder="Tell us about yourself..."
                                    style={{ fontFamily: 'Roboto-Regular' }}
                                />
                            </Textarea>
                        </View>

                        <View>
                            <Text className="text-sm text-typography-700 mb-3" style={{ fontFamily: 'Roboto-Medium' }}>
                                Activity Types
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {ACTIVITIES.map((label) => {
                                    const isActive = selected.includes(label);
                                    return (
                                        <Button
                                            key={label}
                                            variant={isActive ? 'solid' : 'outline'}
                                            size="sm"
                                            className={`${isActive ? 'bg-tertiary-400 ' : ''} rounded-3xl`}
                                            onPress={() => toggle(label)}
                                        >
                                            <ButtonText style={{ fontFamily: 'Roboto-Regular' }}>{label}</ButtonText>
                                        </Button>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    <Button
                        variant="solid"
                        size="lg"
                        className="rounded-full"
                        onPress={() => {
                            // TODO: Save settings
                            router.back();
                        }}
                    >
                        <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>
                            Save Changes
                        </ButtonText>
                    </Button>
                    
                </View>
            </ScrollView>
        </View>
    );
}
