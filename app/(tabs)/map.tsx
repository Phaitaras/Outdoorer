import { CustomMarker, getActivityEmoji } from '@/components/map/customMarker';
import { LocationModal } from '@/components/map/locationModal';
import { ToggleButton } from '@/components/map/toggleButton';
import LocationSearchBar from '@/components/plan/locationSearchBar';
import { LABEL_TO_ACTIVITY } from '@/constants/activities';
import { useFriends } from '@/features/friends';
import { toMarker, useFriendActivities, useUserActivities, useUserPlans } from '@/features/map/hooks/useMapMarkers';
import { useAppleMapsAutocomplete } from '@/features/plan';
import { LOCATION_PICKER_CONSTANTS } from '@/features/plan/constants';
import { supabase } from '@/lib/supabase';
import { useLocationContext } from '@/providers/location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Keyboard, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';

type FilterType = 'plans' | 'activities' | 'friends';

export default function Map() {
  const { location } = useLocationContext();
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('plans');
  const [showResults, setShowResults] = useState(false);
  const noMarkersAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    results,
    isLoading,
  } = useAppleMapsAutocomplete(location ?? undefined);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    })();
  }, []);

  const { data: friends = [] } = useFriends(userId);
  const friendIds = useMemo(() => friends.map((f) => f.id), [friends]);

  const { data: userPlans = [] } = useUserPlans(userId);
  const { data: userActivities = [] } = useUserActivities(userId);
  const { data: friendActivities = [] } = useFriendActivities(friendIds);

  const markers = useMemo(() => {
    const planMarkers = userPlans.map((a) => toMarker(a, 'plan')).filter(Boolean);
    const activityMarkers = userActivities.map((a) => toMarker(a, 'activity')).filter(Boolean);
    const friendMarkers = friendActivities.map((a) => toMarker(a, 'friend')).filter(Boolean);

    return [
      ...(activeFilter === 'plans' ? planMarkers : []),
      ...(activeFilter === 'activities' ? activityMarkers : []),
      ...(activeFilter === 'friends' ? friendMarkers : []),
    ];
  }, [userPlans, userActivities, friendActivities, activeFilter]);

  const handleMarkerPress = (loc: any) => {
    setSelectedLocation(loc);
  };

  const handleCheckForecast = useCallback(() => {
    if (!selectedLocation?.activity) return;

    const activityType = selectedLocation.activity.activity_type || 'generic_sports';
    const activityLabel = LABEL_TO_ACTIVITY[activityType] || activityType;
    const activityId = selectedLocation.activity.id;

    router.push({
      pathname: '/(tabs)/activity',
      params: {
        activity: activityLabel,
        activityId: activityId.toString(),
      },
    });
  }, [selectedLocation, router]);

  const handleSelectAutocomplete = useCallback(
    (result: (typeof results)[number]) => {
      if (!result.location) return;

      Keyboard.dismiss();
      setShowResults(false);
      setSearchQuery(result.displayLines[0] || '');

      const newRegion = {
        latitude: result.location.latitude,
        longitude: result.location.longitude,
        latitudeDelta: LOCATION_PICKER_CONSTANTS.ZOOM_DELTA,
        longitudeDelta: LOCATION_PICKER_CONSTANTS.ZOOM_DELTA,
      };

      const map = (mapRef.current as any)?.getMapRef?.();
      if (map) {
        map.animateToRegion(newRegion, LOCATION_PICKER_CONSTANTS.ANIMATION_DURATION);
      }
    },
    [results, setSearchQuery]
  );

  useEffect(() => {
    if (markers.length === 0) {
      Animated.spring(noMarkersAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      const timer = setTimeout(() => {
        Animated.timing(noMarkersAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [markers.length, noMarkersAnim]);

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 mb-[20%]">
        <ActivityIndicator size="large" color="#FFAE00" />
        <Text className="mt-4 text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
          Getting location...
        </Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <View className="flex-1 mb-[20%]">
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        style={StyleSheet.absoluteFill}
        clusteringEnabled
        clusterColor="#FFAE00"
        clusterTextColor="#FFFFFF"
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={(e) => {
          if (e.nativeEvent.action === 'press') setSelectedLocation(null);
        }}
        onPanDrag={() => setSelectedLocation(null)}
      >
        {markers.map((loc) => {
          if (!loc) return null;
          const emoji = getActivityEmoji(loc.activity.activity_type || '');

          return (
            <Marker
              key={`${loc.type}-${loc.activity.id}`}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              onPress={() => handleMarkerPress(loc)}
            >
              <CustomMarker emoji={emoji} />
            </Marker>
          );
        })}
      </MapView>

      {markers.length === 0 && (
        <Animated.View
          className="absolute bottom-[6.5rem] left-[1rem] right-[1rem] items-center"
          style={{
            transform: [
              {
                translateY: noMarkersAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            opacity: noMarkersAnim,
          }}
        >
          <View className="bg-white rounded-full p-3 px-5 shadow-soft-1 flex-row gap-2">
            <Text className="text-typography-600" style={{ fontFamily: 'Roboto-Regular' }}>
              No Markers Found
            </Text>
          </View>
        </Animated.View>
      )}

      <LocationSearchBar
        searchQuery={searchQuery}
        onSearchChange={(text) => {
          setSearchQuery(text);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onClear={() => {
          clearSearch();
          setShowResults(false);
        }}
        results={results}
        isLoading={isLoading}
        showResults={showResults}
        onSelectResult={handleSelectAutocomplete}
      />

      <View className="absolute bottom-[2rem] left-[1rem] right-[1rem] items-center">
        <View className="bg-white rounded-full px-2 py-2 shadow-soft-2 flex-row gap-2">
          <ToggleButton
            label="Plans"
            active={activeFilter === 'plans'}
            onPress={() => setActiveFilter('plans')}
          />
          <ToggleButton
            label="History"
            active={activeFilter === 'activities'}
            onPress={() => setActiveFilter('activities')}
          />
          <ToggleButton
            label="Friends"
            active={activeFilter === 'friends'}
            onPress={() => setActiveFilter('friends')}
          />
        </View>
      </View>

      <LocationModal
        location={selectedLocation}
        currentUserId={userId}
        onPlanActivity={handleCheckForecast}
        onClose={() => setSelectedLocation(null)}
      />
    </View>
  );
}