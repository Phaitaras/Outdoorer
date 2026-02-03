import CenterMarker from '@/components/plan/centerMarker';
import LocationTopBar from '@/components/plan/locationTopBar';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppleMapsAutocomplete } from '@/features/plan';
import { useLocationPickerState } from '@/features/plan/hooks/useLocationPickerState';
import { useLocationContext } from '@/providers/location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default function LocationPicker() {
  const router = useRouter();
  const params = useLocalSearchParams<{ initialLat?: string; initialLng?: string }>();
  const { location: userLocation } = useLocationContext();
  const {
    mapRef,
    initialRegion,
    markerPosition,
    showResults,
    setShowResults,
    setIsDragging,
    handleRegionChange,
    handleRegionChangeComplete,
    handleSelectResult,
  } = useLocationPickerState(params, userLocation ?? null);

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    results,
    isLoading,
  } = useAppleMapsAutocomplete(userLocation ?? undefined);

  const handleSelectAutocomplete = useCallback(
    (result: (typeof results)[number]) => {
      Keyboard.dismiss();
      setShowResults(false);
      handleSelectResult(result, setSearchQuery);
    },
    [handleSelectResult, setSearchQuery, setShowResults]
  );

  const handleConfirmLocation = useCallback(() => {
    if (markerPosition) {
      // Navigate back to plan with selected location params
      router.replace({
        pathname: '/(tabs)/plan',
        params: {
          selectedLat: markerPosition.latitude.toString(),
          selectedLng: markerPosition.longitude.toString(),
          selectedAddress: searchQuery || `${markerPosition.latitude.toFixed(6)}, ${markerPosition.longitude.toFixed(6)}`,
        },
      });
    }
  }, [markerPosition, router, searchQuery]);

  if (!initialRegion) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FFAE00" />
        <Text className="mt-4 text-typography-600">Waiting for location...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowResults(false);
    }}>
      <View className="flex-1 mb-[20%]">
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          onRegionChange={handleRegionChange}
          onRegionChangeComplete={handleRegionChangeComplete}
          onPanDrag={() => setIsDragging(true)}
          showsUserLocation
          showsMyLocationButton
        />

        <CenterMarker />

        <LocationTopBar
          onBackPress={() => router.back()}
          searchQuery={searchQuery}
          onSearchChange={(text) => {
            setSearchQuery(text);
            setShowResults(true);
          }}
          onSearchFocus={() => setShowResults(true)}
          onClearSearch={() => {
            clearSearch();
            setShowResults(false);
          }}
          results={results}
          isLoading={isLoading}
          showResults={showResults}
          onSelectResult={handleSelectAutocomplete}
        />

        {markerPosition && (
          <Button
            variant="solid"
            size="lg"
            className="absolute bottom-[2rem] left-[1rem] right-[1rem] rounded-xl mx-2 shadow-soft-2"
            onPress={handleConfirmLocation}
          >
            <ButtonText className="font-sm" style={{ fontFamily: 'Roboto-Medium' }}>
              Select Location
            </ButtonText>
          </Button>

        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
