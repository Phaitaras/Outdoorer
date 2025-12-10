import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import MapView from 'react-native-map-clustering';
import { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { SearchIcon } from '@/components/ui/icon';
import { HistoryIcon, UsersIcon } from 'lucide-react-native';

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
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMarkerPress = (loc: any) => {
        setSelectedLocation(loc);
    };

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
                
                onPress={(e) => {
                    if (e.nativeEvent.action === "press") {setSelectedLocation(null);}}}
                onPanDrag={() => setSelectedLocation(null)}
                >
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        coordinate={{
                            latitude: parseFloat(loc.latitude),
                            longitude: parseFloat(loc.longitude),
                        }}
                        onPress={() => handleMarkerPress(loc)}
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

            <View className="absolute bottom-[1rem] right-[1rem] bg-white rounded-full p-2 shadow-soft-2">
                <HistoryIcon color="#444444" />
            </View>

            <View className="absolute bottom-[4.5rem] right-[1rem] bg-white rounded-full p-2 shadow-soft-2">
                <UsersIcon color="#444444" />
            </View>

            {
        selectedLocation && (
            <View className="flex-column absolute bottom-0 left-0 right-0 bg-white p-8 shadow-lg rounded-t-3xl">
                <Text size="xl" style={{ fontFamily: 'Roboto-Medium' }} className="color-typography-800">Placeholder Location {selectedLocation.id}</Text>
                <Text size="lg" style={{ fontFamily: 'Roboto-Medium' }} className="color-typography-800">Rating</Text>
                <Text size="sm" style={{ fontFamily: 'Roboto-Regular' }} className="color-typography-800 mt-1">Place Description</Text>
                <View className="flex-row justify-between mt-6">
                    <Button variant="solid" size="sm" className="px-4 rounded-full">
                        <Text style={{ fontFamily: 'Roboto-Medium', color: '#FFFFFF' }}>Plan Activity</Text>
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 rounded-full">
                        <Text style={{ fontFamily: 'Roboto-Medium' }}>See Review</Text>
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 rounded-full">
                        <Text style={{ fontFamily: 'Roboto-Medium' }}>Leave Review</Text>
                    </Button>
                </View>
            </View>
        )
    }

        </View >
    );
}