import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {useTravelLogContext} from '@/contexts/TravelLog';
import MarkerDetail from './MarkerDetail';
import {MapDetailLayout, MapSpaceStyle} from './ScheduleMapSearchStyle';
import typesKo from '@/assets/types_ko.json';



const defaultCenter = {lat: 37.5665, lng: 126.978}; // 기본 중심: 서울

// Translate types from English to Korean
const translateTypes = (types: string[]) => {
  return types.map(type => (typesKo as Record<string, string>)[type] || '기타');
};

// Create a marker from place result
const createMarker = (
  result: google.maps.places.PlaceResult
): CustomMarker | null => {
  const location = result.geometry?.location;
  if (location) {
    return {
      position: {lat: location.lat(), lng: location.lng()},
      title: result.name || '',
      placeId: result.place_id || '',
      address: result.formatted_address || '',
      rating: result.rating,
      openingHours: result.opening_hours?.weekday_text || [],
      types: translateTypes(result.types || []),
      photos: result.photos?.map(photo => photo.getUrl()) || [], // Add photos
    };
  }
  return null;
};

// PlusSelfGoogleMap component
const PlusSelfGoogleMap = forwardRef(
  ({searchLocation}: {searchLocation: string | undefined}, ref) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<CustomMarker[]>([]);
    const [isInteraction, setIsInteraction] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const {
      selectedPlace,
      selectedMarker,
      setSelectedMarker,
      scheduleEdit,
      scheduleDayNum,
      travelSchedules,
    } = useTravelLogContext();
    const [defaultMarker, setDefaultMarker] = useState<google.maps.Icon | null>(
      null
    );
    const [showMarkerDetail, setShowMarkerDetail] = useState<boolean>(false);

    const containerStyle = (showMarkerDetail: boolean) => ({
      width: '100%',
      height: showMarkerDetail ? '90vh' : '100vh',
    });

    // Provide a method for parents to change the map center
    useImperativeHandle(ref, () => ({
      setCenter: (lat: number, lng: number) => {
        if (map) {
          map.setCenter({lat, lng});
        }
      },
    }));

    useEffect(() => {
      if (searchLocation) {
        setHasSearched(false);
      }
    }, [searchLocation]);

    // Handle marker click and zoom to the clicked marker
    const handleMarkerClick = async (marker: CustomMarker) => {
      if (map) {
        setSelectedMarker(marker);
        map.panTo(marker.position);
        map.setZoom(15);
      }
      setShowMarkerDetail(true);
    };

    const setBoundsFromSelectedPlaceAndSearch = async () => {
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        const service = new window.google.maps.places.PlacesService(map);

        if (!selectedPlace && searchLocation && searchLocation.trim() !== '') {
          const request = {
            query: searchLocation,
            location: defaultCenter,
            language: 'ko',
            radius: 5000,
            fields: [
              'geometry',
              'name',
              'formatted_address',
              'rating',
              'types',
              'photos',
            ],
          };

          service.textSearch(request, (results, status) => {
            if (status === 'OK' && results) {
              const nearbyMarkers = results.map(result => {
                const marker = createMarker(result);
                if (marker) {
                  bounds.extend(marker.position);

                  // Fetch detailed information about the place
                  if (result.place_id) {
                    service.getDetails(
                      {
                        placeId: result.place_id,
                        language: 'ko',
                        fields: ['reviews', 'opening_hours', 'photos'], // Fields for detailed info
                      },
                      (placeDetails, detailsStatus) => {
                        if (detailsStatus === 'OK' && placeDetails) {
                          marker.reviews =
                            placeDetails.reviews?.map(review => ({
                              authorName: review.author_name,
                              authorProfilePhoto: review.profile_photo_url,
                              reviewText: review.text,
                              rating: review.rating,
                            })) || [];
                          marker.detailedOpeningHours =
                            placeDetails.opening_hours?.weekday_text || [];
                          marker.photos =
                            placeDetails.photos?.map(photo => photo.getUrl()) ||
                            [];

                          // Update the markers with detailed info
                          setMarkers(prevMarkers =>
                            prevMarkers.map(m =>
                              m.placeId === marker.placeId
                                ? {...m, ...marker}
                                : m
                            )
                          );
                        } else {
                          console.error(
                            'Error fetching place details:',
                            detailsStatus
                          );
                        }
                      }
                    );
                  }
                }
                return marker;
              });

              // Set the markers and adjust the map bounds
              setMarkers(
                nearbyMarkers.filter(
                  marker => marker !== null
                ) as CustomMarker[]
              );
              map.fitBounds(bounds);
              setHasSearched(true);
            } else {
              console.error('Text search failed:', status);
            }
          });
        } else if (selectedPlace) {
          const address =
            typeof selectedPlace === 'string' ? selectedPlace : '';
          const geocoder = new window.google.maps.Geocoder();
          const searchQuery = searchLocation
            ? `${selectedPlace} ${searchLocation}`
            : selectedPlace;

          geocoder.geocode({address}, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const viewport = results[0].geometry.viewport;
              const location = results[0].geometry.location;

              if (viewport) {
                bounds.union(viewport);
              } else {
                bounds.extend(location);
              }

              if (searchLocation && searchLocation.trim() !== '') {
                const request: google.maps.places.TextSearchRequest = {
                  query: typeof searchQuery === 'string' ? searchQuery : '',
                  bounds: bounds,
                  language: 'ko',
                };

                service.textSearch(request, (results, status) => {
                  if (status === 'OK' && results) {
                    const searchMarkers = results.map(result => {
                      const marker = createMarker(result);
                      if (marker) {
                        bounds.extend(marker.position);

                        if (result.place_id) {
                          service.getDetails(
                            {
                              placeId: result.place_id,
                              language: 'ko',
                              fields: ['reviews', 'opening_hours', 'photos'],
                            },
                            (placeDetails, detailsStatus) => {
                              if (detailsStatus === 'OK' && placeDetails) {
                                marker.reviews =
                                  placeDetails.reviews?.map(review => ({
                                    authorName: review.author_name,
                                    authorProfilePhoto:
                                      review.profile_photo_url,
                                    reviewText: review.text,
                                    rating: review.rating,
                                  })) || [];
                                marker.detailedOpeningHours =
                                  placeDetails.opening_hours?.weekday_text ||
                                  [];
                                marker.photos =
                                  placeDetails.photos?.map(photo =>
                                    photo.getUrl()
                                  ) || [];

                                setMarkers(prevMarkers =>
                                  prevMarkers.map(m =>
                                    m.placeId === marker.placeId
                                      ? {...m, ...marker}
                                      : m
                                  )
                                );
                              } else {
                                console.error(
                                  'Error fetching place details:',
                                  detailsStatus
                                );
                              }
                            }
                          );
                        }
                      }
                      return marker;
                    });

                    setMarkers(
                      searchMarkers.filter(
                        marker => marker !== null
                      ) as CustomMarker[]
                    );
                    map.fitBounds(bounds);
                    setHasSearched(true);
                  } else {
                    console.error('Text search failed:', status);
                  }
                });
              } else {
                map.fitBounds(bounds);
              }
            } else {
              console.error('Geocoding failed:', status);
            }
          });
        }
      }
    };

    // Add event listeners for user interactions on the map
    useEffect(() => {
      if (map) {
        map.addListener('zoom_changed', () => setIsInteraction(true));
        map.addListener('dragend', () => setIsInteraction(true));
        map.addListener('idle', () => setIsInteraction(false));
      }
    }, [map]);

    useEffect(() => {
      if (map && !isInteraction && !hasSearched) {
        setBoundsFromSelectedPlaceAndSearch();
      }
    }, [map, searchLocation, selectedPlace, isInteraction, hasSearched]);

    return (
      <>
        <div css={MapSpaceStyle}>
          <GoogleMap
            mapContainerStyle={containerStyle(showMarkerDetail)}
            center={defaultCenter}
            zoom={12}
            onLoad={setMap}
            options={{
              mapTypeControl: false, // 지도/위성 전환 숨기기
              zoomControl: false, // 확대/축소 버튼 숨기기
              fullscreenControl: false, // 전체 화면 버튼 숨기기
              streetViewControl: false, // 스트리트뷰 버튼 숨기기
            }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)}
                icon={
                  selectedMarker === marker
                    ? undefined
                    : (defaultMarker ?? undefined)
                }
              />
            ))}
          </GoogleMap>
          {showMarkerDetail && (
            <div css={MapDetailLayout}>
              <MarkerDetail setShowMarkerDetail={setShowMarkerDetail} />
            </div>
          )}
        </div>
      </>
    );
  }
);

PlusSelfGoogleMap.displayName = 'PlusSelfGoogleMap';

export default PlusSelfGoogleMap;
