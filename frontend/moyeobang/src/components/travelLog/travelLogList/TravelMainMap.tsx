import React, {useEffect, useState, useRef} from 'react';
import {GoogleMap, Marker, InfoWindow} from '@react-google-maps/api';
import {useTravelLogContext} from '@/contexts/TravelLog';
import useTravelDetailStore from '@/store/useTravelDetailStore';
import heartIcon from '@/assets/icons/heartIcon.webp';
import currentLocationIcon from '@/assets/icons/blueDot.png';

interface markerInfo {
  lat: number;
  lng: number;
  googlePlaceId?: string;
  category?: string;
  name?: string;
}

const containerStyle = {
  width: '100%',
  height: '48vh', // 원하는 높이로 설정
};

const defaultCenter = {lat: 37.5665, lng: 126.978}; // 서울 기본 중심 좌표

export default function TravelMainMap() {
  const {travelSchedules, scheduleDayNum} = useTravelLogContext();
  const {travelPlaceList} = useTravelDetailStore();
  const [markers, setMarkers] = useState<markerInfo[]>([]);
  const [currentLocation, setCurrentLocation] = useState<markerInfo | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placeCoords, setPlaceCoords] = useState<placeListViewPort[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<markerInfo | null>(null);
  const [selectedMarkerInfo, setSelectedMarkerInfo] =
    useState<Pick<markerInfo, 'name' | 'category'>>();

  // 현재 위치 가져오기
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         console.log('[*] position', position);
  //         setCurrentLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       error => {
  //         console.error('Error getting current position:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }, []);

  // 마커 생성 및 스케줄 변경 시 마커 업데이트
  useEffect(() => {
    if (scheduleDayNum) {
      const schedules = travelSchedules[scheduleDayNum - 1]?.daySchedules ?? [];
      const newMarker = schedules
        .map(schedule => {
          return {
            lat: schedule.scheduleLocation?.latitude ?? 0,
            lng: schedule.scheduleLocation?.longitude ?? 0,
            googlePlaceId: schedule.scheduleLocation?.googlePlaceId ?? '',
            category: schedule.scheduleLocation?.category ?? '',
            name: schedule.scheduleLocation?.title ?? '',
          };
        })
        .filter(marker => marker !== null);
      setMarkers(newMarker);
    }
  }, [scheduleDayNum, travelSchedules]);

  // Geocoding API를 사용하여 주소를 위도와 경도로 변환
  // useEffect(() => {
  //   if (travelPlaceList.length > 0) {
  //     const geocoder = new window.google.maps.Geocoder();
  //     const promises = travelPlaceList.map(place => {
  //       return new Promise<markerInfo>((resolve, reject) => {
  //         geocoder.geocode({address: place}, (results, status) => {
  //           if (status === 'OK' && results?.[0]) {
  //             const location = results[0].geometry.location;
  //             resolve({
  //               lat: location.lat(),
  //               lng: location.lng(),
  //             });
  //           } else {
  //             reject(
  //               'Geocode was not successful for the following reason: ' + status
  //             );
  //           }
  //         });
  //       });
  //     });

  //     Promise.all(promises)
  //       .then(results => {
  //         setPlaceCoords(results);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }
  // }, [travelPlaceList]);
  interface placeListViewPort {
    viewport: {
      south: number;
      west: number;
      east: number;
      north: number;
    } | null;
  }
  useEffect(() => {
    if (travelPlaceList.length > 0) {
      const geocoder = new window.google.maps.Geocoder();
      const promises = travelPlaceList.map(place => {
        return new Promise<placeListViewPort>((resolve, reject) => {
          geocoder.geocode({address: place}, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              // const location = results[0].geometry.location;
              const viewport = results[0].geometry.viewport; // viewport 가져오기

              resolve({
                // lat: location.lat(),
                // lng: location.lng(),
                viewport: viewport
                  ? {
                      north: viewport.getNorthEast().lat(),
                      east: viewport.getNorthEast().lng(),
                      south: viewport.getSouthWest().lat(),
                      west: viewport.getSouthWest().lng(),
                    }
                  : null,
              });
            } else {
              reject(
                'Geocode was not successful for the following reason: ' + status
              );
            }
          });
        });
      });

      Promise.all(promises)
        .then(results => {
          setPlaceCoords(results);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [travelPlaceList]);

  // 마커 클릭 시 설명 가져오기
  const handleMarkerClick = (marker: markerInfo) => {
    if (marker.googlePlaceId) {
      const newSelectedMarkerInfo = {
        name: marker.name,
        category: marker.category,
      };
      setSelectedMarker(marker);
      setSelectedMarkerInfo(newSelectedMarkerInfo);
    } else {
      const newSelectedMarkerInfo = {
        name: marker.name,
      };
      setSelectedMarker(marker);
      setSelectedMarkerInfo(newSelectedMarkerInfo);
    }
  };

  useEffect(() => {
    if (map) {
      if (markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => {
          bounds.extend({lat: marker.lat, lng: marker.lng});
        });
        if (currentLocation) {
          bounds.extend({lat: currentLocation.lat, lng: currentLocation.lng});
        }
        map.fitBounds(bounds); // 모든 마커를 포함하는 경계로 설정
      } else if (placeCoords.length > 0) {
        // console.log('[*]', placeCoords);

        const bounds = new window.google.maps.LatLngBounds();
        placeCoords.forEach(coord => {
          if (coord.viewport) {
            // viewport의 북동쪽과 남서쪽 경계를 정확히 가져옴

            if (coord.viewport) {
              // viewport의 경계 값을 사용해 bounds 확장
              const northeast = {
                lat: Number(coord.viewport.north),
                lng: Number(coord.viewport.east),
              };
              const southwest = {
                lat: Number(coord.viewport.south),
                lng: Number(coord.viewport.west),
              };

              // 북동쪽과 남서쪽 좌표를 bounds에 추가
              bounds.extend(northeast);
              bounds.extend(southwest);
            }
          }
        });
        // placeCoords.forEach(coord => {
        //   if (coord.viewport) {
        //     // viewport의 북동쪽과 남서쪽 경계를 확장
        //     bounds.extend(coord.viewport.north);
        //     bounds.extend(coord.viewport.southwest);
        //   } else {
        //     // viewport가 없을 경우 lat/lng로 확장
        //     bounds.extend({lat: coord.lat, lng: coord.lng});
        //   }
        // });

        // const bounds = new window.google.maps.LatLngBounds();
        // placeCoords.forEach(coord => {
        //   bounds.extend({lat: coord.lat, lng: coord.lng});
        // });
        map.fitBounds(bounds, {top: 50, bottom: 100, left: 50, right: 50}); // 모든 장소를 포함하는 경계로 설정
      } else {
        // 마커가 없고 placeCoords도 없을 때 기본 중심을 서울로 설정
        map.setCenter(defaultCenter);
        map.setZoom(12); // 서울을 중심으로 기본 줌 레벨 설정
      }
    }
  }, [map, markers, placeCoords, currentLocation]);

  return (
    <div>
      <style>
        {`
          .gm-style-iw-c {
            padding: 0 !important; /* InfoWindow 내부 패딩 조정 */
          }
          .gm-ui-hover-effect {
           display: none !important;
          }
        `}
      </style>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter} // 초기 렌더링 시 기본 중심을 서울로 설정
        zoom={12} // 기본 줌 레벨 설정
        onLoad={mapInstance => {
          setMap(mapInstance);
        }} // map 인스턴스 저장
        onUnmount={() => {
          // console.log('Map unmounted');
          setMap(null);
        }} // 페이지가 이동되거나 언마운트 시 map 상태 초기화
        onClick={() => {
          setSelectedMarker(null);
          setSelectedMarkerInfo(undefined);
        }} // 지도 클릭 시 InfoWindow 닫기
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
            position={{lat: marker.lat, lng: marker.lng}}
            title={`Marker ${index + 1}`}
            icon={{
              url: heartIcon, // import한 이미지 사용
              scaledSize: new window.google.maps.Size(30, 30), // 이미지 크기 조정
            }}
            label={{
              text: `${index + 1}`, // 인덱스를 레이블로 표시
              color: 'white', // 레이블 색상
              fontSize: '12px', // 레이블 폰트 크기
              fontFamily: 'semibold',
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.lat,
              lng: selectedMarker.lng,
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
              setSelectedMarkerInfo(undefined);
            }} // InfoWindow 닫기
            options={{
              pixelOffset: new window.google.maps.Size(0, -30), // InfoWindow를 마커 위로 30픽셀 이동
            }}
          >
            <div
              style={{
                margin: '0 5px 10px 5px',
                padding: '0 10px',
                maxWidth: '200px',
                fontFamily: 'semibold',
                fontSize: '16px',
              }}
            >
              <p style={{padding: '0 0 5px 0'}}>
                {' '}
                장소 이름 : {selectedMarkerInfo?.name || ''}
              </p>{' '}
              {selectedMarkerInfo?.category && (
                <p style={{margin: '0'}}>
                  카테고리 : {selectedMarkerInfo?.category || ''}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
        {currentLocation && (
          <Marker
            position={{lat: currentLocation.lat, lng: currentLocation.lng}}
            title="Current Location"
            icon={{
              url: currentLocationIcon, // import한 이미지 사용
              scaledSize: new window.google.maps.Size(30, 30), // 이미지 크기 조정
            }}
            label={{
              text: '현재 위치', // 현재 위치 레이블
              color: 'white', // 레이블 색상
              fontSize: '8px', // 레이블 폰트 크기
              fontFamily: 'semibold',
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
