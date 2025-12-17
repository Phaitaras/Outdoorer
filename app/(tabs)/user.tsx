import { ActivityCardsScroll } from '@/components/home/activityCardsScroll';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage
} from '@/components/ui/avatar';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Text } from '@/components/ui/text';
import { SettingsIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function User() {
  return (
    <View className="flex-1 bg-[#F6F6F7] mb-[20%]">
      <ScrollView
        className="flex-1 p-8"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View className="flex-col">

          <View className="bg-white p-6 rounded-2xl shadow-soft-1 mb-6">
            {/* header */}
            <View className="flex-row justify-between items-center mb-6">
              <View className='flex-row gap-6 items-center'>
                <Avatar size='lg'>
                  <AvatarFallbackText>Placeholder Name</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: '',
                    }}
                  />
                </Avatar>
                <View className='flex-col gap-[0.2rem]'>
                  <Text className="text-[20px]" style={{ fontFamily: 'Roboto-Medium' }}>
                    Placeholder Name
                  </Text>
                  <Text className="text-md text-typography-700" style={{ fontFamily: 'Roboto-Medium' }}>
                    New Outdoorer
                  </Text>
                </View>
              </View>
              <Button variant="link" className="px-2 self-start" onPress={() => { }}>
                <ButtonIcon as={SettingsIcon} className='w-6 h-6 text-typography-600' />
              </Button>
            </View>


            {/* tags */}
            {/* <Text className="text-typography-800 text-lg mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
            Tags
          </Text> */}
            <View className="flex-row flex-wrap mb-6 gap-3">
              {['🏃‍♂️  Running', '🚴‍♀️  Cycling', '🥾  Hiking', '🧗  Rock Climbing', '🛶  Kayaking'].map((label) => {
                return (
                  <Button
                    key={label}
                    variant="outline"
                    action="secondary"
                    size="sm"
                    className="rounded-3xl"
                  >
                    <ButtonText className="text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>{label}</ButtonText>
                  </Button>
                );
              })}
            </View>

            {/* stats count */}
            <View className="flex-row gap-6">
              <View className="flex-col gap-1">
                <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
                  3
                </Text>
                <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
                  Friends
                </Text>
              </View>
              <Divider orientation="vertical" />
              <View className="flex-col gap-1">
                <Text className="text-typography-700 text-4xl" style={{ fontFamily: 'Roboto-Medium' }}>
                  3
                </Text>
                <Text className="text-typography-600 text-md" style={{ fontFamily: 'Roboto-Medium' }}>
                  Activities
                </Text>
              </View>
            </View>

            {/* add friend */}
            <View className="mt-6 flex-row">
              <Button variant="solid" className="rounded-full" onPress={() => { }}>
                <ButtonText className="text-white" style={{ fontFamily: 'Roboto-Medium' }}>Add Friend</ButtonText>
              </Button>
            </View>
          </View>

          <Divider className="mb-4" />

          {/* upcoming plans */}
          <Text className="text-typography-800 text-lg mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
            Upcoming Plans
          </Text>
          <ActivityCardsScroll
            cards={[
              { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 17', timeWindow: '9:00 - 11:00' },
              { id: '2', activity: 'Cycling', emoji: '🚴‍♀️', date: 'Dec 18', timeWindow: '10:00 - 12:00' },
              { id: '3', activity: 'Hiking', emoji: '🥾', date: 'Dec 19', timeWindow: '13:00 - 17:00' },
            ]}
            onCardPress={() => {}}
            emptyMessage="No upcoming plans"
          />

          {/* recent activities */}
          <Text className="text-typography-800 text-lg mt-4 mb-2" style={{ fontFamily: 'Roboto-Medium' }}>
            Previous Activities
          </Text>
          <ActivityCardsScroll
            cards={[
              { id: '1', activity: 'Running', emoji: '🏃‍♂️', date: 'Dec 15', timeWindow: '9:00 - 11:00' },
              { id: '2', activity: 'Surfing', emoji: '🏄‍♂️', date: 'Dec 12', timeWindow: '13:00 - 17:00' },
              { id: '3', activity: 'Kayaking', emoji: '🛶', date: 'Dec 11', timeWindow: '10:00 - 12:00' },
            ]}
            onCardPress={() => {}}
            emptyMessage="No recent activities"
          />
          
        </View>
      </ScrollView>
    </View>


  );
}
