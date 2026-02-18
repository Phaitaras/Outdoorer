import { TimePickerModal } from '@/components/plan/timePickerModal';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useModalTransitionAnimation } from '@/features/home/hooks/useModalTransitionAnimation';
import { formatTime } from '@/utils/activity';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, Pressable, View } from 'react-native';

interface PlanTimeModalProps {
  visible: boolean;
  recommendedLabel: string;
  initialStart: Date;
  initialEnd: Date;
  onConfirm: (start: Date, end: Date) => void;
  onClose: () => void;
}

export function PlanTimeModal({
  visible,
  recommendedLabel,
  initialStart,
  initialEnd,
  onConfirm,
  onClose,
}: PlanTimeModalProps) {
  const [startTime, setStartTime] = useState<Date>(initialStart);
  const [endTime, setEndTime] = useState<Date>(initialEnd);
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
  const [showPicker, setShowPicker] = useState(false);
  const fullSlideDistance = Dimensions.get('window').height;
  const { shouldRender, backdropOpacity, contentOpacity, translateY } = useModalTransitionAnimation({
    visible,
    enableSlide: true,
    slideDistance: fullSlideDistance,
  });

  useEffect(() => {
    setStartTime(initialStart);
    setEndTime(initialEnd);
  }, [initialStart, initialEnd]);

  const startLabel = useMemo(() => formatTime(startTime), [startTime]);
  const endLabel = useMemo(() => formatTime(endTime), [endTime]);

  const handleTimeChange = (_: any, selected?: Date) => {
    if (!selected) return;
    if (pickerTarget === 'start') {
      setStartTime(selected);
      if (selected >= endTime) {
        setEndTime(new Date(selected.getTime() + 30 * 60 * 1000));
      }
    } else {
      if (selected <= startTime) {
        setEndTime(new Date(startTime.getTime() + 30 * 60 * 1000));
      } else {
        setEndTime(selected);
      }
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <Animated.View className="absolute inset-0" style={{ opacity: backdropOpacity }} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        className="absolute bottom-0 left-0 right-0"
        style={{
          opacity: contentOpacity,
          transform: [{ translateY }],
        }}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <View className="relative bg-white rounded-t-3xl p-8 gap-3 mb-10">
          {showPicker && (
            <Pressable
              className="absolute inset-0 z-10"
              onPress={() => setShowPicker(false)}
            />
          )}

        <Text className="text-lg text-typography-900" style={{ fontFamily: 'Roboto-Medium' }}>
          Plan Activity
        </Text>
          <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
            Recommended window: {recommendedLabel}
          </Text>

          <View className="relative z-20 flex-row justify-between mt-2 gap-3">
            <Pressable
              className="flex-1 border border-outline-200 rounded-xl px-4 py-3 bg-background-50"
              onPress={() => {
                setPickerTarget('start');
                setShowPicker(true);
              }}
            >
              <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                Start Time
              </Text>
              <Text className="text-base text-typography-900" style={{ fontFamily: 'Roboto-Medium' }}>
                {startLabel}
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 border border-outline-200 rounded-xl px-4 py-3 bg-background-50"
              onPress={() => {
                setPickerTarget('end');
                setShowPicker(true);
              }}
            >
              <Text className="text-sm text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
                End Time
              </Text>
              <Text className="text-base text-typography-900" style={{ fontFamily: 'Roboto-Medium' }}>
                {endLabel}
              </Text>
            </Pressable>
          </View>

          <View className="relative z-20">
            <TimePickerModal
              visible={showPicker}
              embedded
              value={pickerTarget === 'start' ? startTime : endTime}
              onChange={handleTimeChange}
              onClose={() => setShowPicker(false)}
            />
          </View>

          <Button
            variant="solid"
            className="relative z-20 rounded-full bg-tertiary-400 mt-2"
            onPress={() => {
              setShowPicker(false);
              onConfirm(startTime, endTime);
            }}
          >
            <ButtonText style={{ fontFamily: 'Roboto-Medium' }}>Save</ButtonText>
          </Button>
        </View>
      </Animated.View>
      </>
  );
}