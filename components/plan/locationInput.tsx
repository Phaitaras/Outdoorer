import { Text } from '@/components/ui/text';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export function LocationInput({
  value,
  onChange,
  onPress,
  coordinates,
  mapRegion,
}: {
  value: string;
  onChange: (value: string) => void;
  onPress?: () => void;
  coordinates?: { latitude: number; longitude: number } | null;
  mapRegion: Region | null;
}) {
  if (!mapRegion) {
    return (
      <View className="mb-2">
        <Text
          className="mb-1 text-[14px] text-typography-700"
          style={{ fontFamily: 'Roboto-Medium' }}
        >
          Location <Text className="text-error-500">*</Text>
        </Text>
        <View className="h-24 rounded-lg bg-outline-100 items-center justify-center">
          <Text className="text-typography-500" style={{ fontFamily: 'Roboto-Regular' }}>
            Loading location...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-2">
      <Text
        className="mb-1 text-[14px] text-typography-700"
        style={{ fontFamily: 'Roboto-Medium' }}
      >
        Location <Text className="text-error-500">*</Text>
      </Text>

      <Pressable 
        onPress={onPress}
        className="rounded-lg overflow-hidden border border-outline-200"
      >
        <MapView
          style={styles.map}
          region={mapRegion}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {coordinates && (
            <Marker
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              }}
            >
              <View className="bg-primary-500 w-6 h-6 rounded-full items-center justify-center">
                <MapPin size={16} color="white" />
              </View>
            </Marker>
          )}
        </MapView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 96,
    width: '100%',
  },
});
