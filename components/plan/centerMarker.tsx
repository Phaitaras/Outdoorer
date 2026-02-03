import { MapPin } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function CenterMarker() {
  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center"
    >
      <View className="items-center shadow-sm" style={{ marginBottom: 40 }}>
        <MapPin size={40} color="#FFAE00" fill="#FFAE00" />
      </View>
    </View>
  );
}
