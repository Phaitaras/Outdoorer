import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { ACTIVITIES } from '@/constants/activities';

export default function GettingStarted() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Step 0 state (Activities)
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (label: string) =>
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

  // Step 1 state (Preferences)
  const [pref, setPref] = useState<'recommended' | 'detailed' | null>('recommended');

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const next = () => {
    if (step < 2) setStep((s) => (s + 1) as 0 | 1 | 2);
    else router.replace('/home'); 
  };

  return (
    <View className="flex-1 bg-[#FFAE00] overflow-hidden">
      <View className="flex-[0.1]" />

      <View className="flex-1 bg-white rounded-t-[30px] p-10">
        <View className="mb-4">
          <Text className="text-[16px] text-typography-600 mb-1" style={{fontFamily: 'Roboto-Medium'}}>Getting Started</Text>
          <Text className="text-[12px] text-typography-500" style={{fontFamily: 'Roboto-Light'}}>{step + 1} of 3</Text>

          <View className="mt-2">
            <Progress value={progress} size='xs'>
              <ProgressFilledTrack />
            </Progress>
          </View>
        </View>

        {step === 0 && (
          <View className="flex-1 mt-5 gap-2">
            <Text size="2xl" className="mb-2" style={{fontFamily: 'Roboto-Bold'}}>Activities</Text>
            <Text className="mb-4" size="lg" style={{fontFamily: 'Roboto-Regular'}}>
              Begin by selecting your activities get weather forecast tailored to your preferences.
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
                    <ButtonText style={{fontFamily: 'Roboto-Regular'}}>{label}</ButtonText>
                  </Button>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <View className="flex-1 mt-5">
            <Text size="2xl" style={{fontFamily: 'Roboto-Bold'}} className="mb-3">Preferences</Text>
            <Text className="mb-6" size="lg" style={{fontFamily: 'Roboto-Regular'}}>How detailed do you check for weather forecasts?</Text>

            <Pressable
              onPress={() => setPref('recommended')}
              className={`rounded-2xl border p-4 mb-3 ${
                pref === 'recommended' ? 'border-tertiary-400' : 'border-outline-200'
              }`}
            >
              <Text style={{fontFamily: 'Roboto-Medium'}} className="mb-1">Recommended</Text>
              <Text className="text-typography-600" style={{fontFamily: 'Roboto-Regular'}}>
                Show essential parameters and general overview
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setPref('detailed')}
              className={`rounded-2xl border p-4 ${
                pref === 'detailed' ? 'border-tertiary-400' : 'border-outline-200'
              }`}
            >
              <Text style={{fontFamily: 'Roboto-Medium'}} className="mb-1">Detailed</Text>
              <Text className="text-typography-600" style={{fontFamily: 'Roboto-Regular'}}>
                Gives all parameters used by the application
              </Text>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View className="flex-1 mt-5 gap-2">
            <Text size="2xl" style={{fontFamily: 'Roboto-Bold'}} className="mb-2">Allow Location</Text>
            <Text className="mb-4" size='lg' style={{fontFamily: 'Roboto-Regular'}}>
              Allow application to view your current location for accurate reading.
            </Text>
            <View className="rounded-2xl border border-outline-200 h-40" />
          </View>
        )}

        <View className="mt-6">
          <Button
            variant="solid"
            size="md"
            action="primary"
            className="bg-tertiary-400 rounded-lg"
            onPress={next}
          >
            <ButtonText>{step < 2 ? 'Next' : 'Finish'}</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
