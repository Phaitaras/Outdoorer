import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SearchIcon } from '@/components/ui/icon';
import { HistoryIcon } from 'lucide-react-native';

const INITIAL_REGION = {
    latitude: 55.863873,
    longitude: -4.292994,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
};

const locations = [
    { id: '1', latitude: '55.869730', longitude: '-4.283822' },
    { id: '2', latitude: '55.867539', longitude: '-4.281505' },
    { id: '4', latitude: '55.852826', longitude: '-4.240569' },
    { id: '5', latitude: '55.874898', longitude: '-4.242221' },
    { id: '6', latitude: '55.866085', longitude: '-4.207760' },
    { id: '7', latitude: '55.872785', longitude: '-4.308439' },
    { id: '8', latitude: '55.859657', longitude: '-4.290839' },
];

export default function Map() {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }
            // Get current position
            const loc = await Location.getCurrentPositionAsync({});
            setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        })();
    }, []);

    return (
        <View className="flex-1 mb-[20%]">
            <MapView
                initialRegion={INITIAL_REGION}
                style={StyleSheet.absoluteFill}
                clusteringEnabled
                clusterColor="#FFAE00"
                clusterTextColor="#FFFFFF"
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        coordinate={{
                            latitude: parseFloat(loc.latitude),
                            longitude: parseFloat(loc.longitude),
                        }}
                    />
                ))}
            </MapView>

            <Input
                variant="rounded"
                className="absolute top-4 left-[18%] right-[18%] bg-white rounded-full px-4 shadow-soft-2 flex-row items-center"
            >
                <InputSlot>
                    <InputIcon as={SearchIcon} />
                </InputSlot>

                <InputField
                    placeholder="Search a location"
                />
            </Input>

            <View className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-soft-2">
                <HistoryIcon color="#444444" />
            </View>

        </View>
    );
}