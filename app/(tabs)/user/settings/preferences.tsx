import { Button, ButtonText } from '@/components/ui/button';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, CircleIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function PreferencesSettingsScreen() {
    const router = useRouter();
    const [unitSystem, setUnitSystem] = useState('metric');

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
