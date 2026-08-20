import { CustomMarker } from '@/components/map/customMarker';
import React, { useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';

interface ActivityMarkerProps {
  coordinate: { latitude: number; longitude: number };
  emoji: string;
  onPress: () => void;
}

// react-native-maps snapshots a custom marker's view once tracksViewChanges
// is false, and never retakes it. If false from the very first render, that
// snapshot can be captured before the native layout pass finishes, leaving
// the default pin stuck permanently. Starting true and flipping false a
// moment later gives the real content time to render before it's snapshotted.
const SNAPSHOT_DELAY_MS = 300;

export function ActivityMarker({ coordinate, emoji, onPress }: ActivityMarkerProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setTracksViewChanges(false), SNAPSHOT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={tracksViewChanges}>
      <CustomMarker emoji={emoji} />
    </Marker>
  );
}
