import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';

export function TimePickerModal({
  visible,
  value,
  onChange,
  onClose,
  embedded = false,
}: {
  visible: boolean;
  value: Date;
  onChange: (event: DateTimePickerEvent, selected?: Date) => void;
  onClose: () => void;
  embedded?: boolean;
}) {
  const embeddedProgress = useRef(new Animated.Value(0)).current;
  const [shouldRenderEmbedded, setShouldRenderEmbedded] = useState(visible);

  useEffect(() => {
    if (!embedded) return;

    if (visible) {
      setShouldRenderEmbedded(true);
      Animated.timing(embeddedProgress, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(embeddedProgress, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setShouldRenderEmbedded(false);
      }
    });
  }, [embedded, visible, embeddedProgress]);

  if (embedded) {
    if (!shouldRenderEmbedded) return null;

    return (
      <Animated.View
        className="mt-3 rounded-xl border border-outline-200 bg-background-50 px-3 py-2"
        style={{
          opacity: embeddedProgress,
          transform: [
            {
              scaleY: embeddedProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
            {
              translateY: embeddedProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
          ],
        }}
      >
        <DateTimePicker
          mode="time"
          value={value}
          onChange={onChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      </Animated.View>
    );
  }

  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end">
      <Pressable
        className="absolute inset-0 bg-[rgba(15,15,15,0.2)]"
        onPress={onClose}
      />
      <View className="bg-white p-4 items-center">
        <DateTimePicker
          mode="time"
          value={value}
          onChange={onChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      </View>
    </View>
  );
}
