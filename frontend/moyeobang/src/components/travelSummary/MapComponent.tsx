// import React, {useEffect, useState, useRef} from 'react';
// import {GoogleMap, useJsApiLoader} from '@react-google-maps/api';
// import axios from 'axios';
// // import hearIcon from '@/assets/icons/hearIcon.png';
// import hearIcon from '@/assets/icons/heartIcon.webp';

// interface MapProps {
//   locationList: {latitude: number; longitude: number}[];
//   travelPlaceList: string[];
// }

// interface Coordinates {
//   lat: number;
//   lng: number;
// }

// export default function MapComponent({
//   locationList,
//   travelPlaceList,
// }: MapProps) {
//   const {isLoaded} = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
//   });

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const [center, setCenter] = useState<Coordinates | null>(null);

//   // Geocoding API를 이용해 장소 이름에서 위도, 경도를 가져오는 함수
//   const getCoordinatesFromPlace = async (
//     placeName: string
//   ): Promise<Coordinates | null> => {
//     const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json`;

//     try {
//       const response = await axios.get(url, {
//         params: {
//           address: placeName,
//           key: apiKey,
//         },
//       });

//       const {results} = response.data;
//       if (results && results.length > 0) {
//         const location = results[0].geometry.location;
//         return {lat: location.lat, lng: location.lng};
//       } else {
//         console.error('No results found for this place:', placeName);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error fetching coordinates:', error);
//       return null;
//     }
//   };

//   // 모든 장소의 위도와 경도를 가져와 평균 좌표를 계산하는 함수
//   useEffect(() => {
//     const fetchCoordinates = async () => {
//       const coordinatesList = await Promise.all(
//         travelPlaceList.map(place => getCoordinatesFromPlace(place))
//       );

//       const validCoordinates = coordinatesList.filter(Boolean) as Coordinates[];

//       if (validCoordinates.length > 0) {
//         const averageLat =
//           validCoordinates.reduce((sum, coord) => sum + coord.lat, 0) /
//           validCoordinates.length;
//         const averageLng =
//           validCoordinates.reduce((sum, coord) => sum + coord.lng, 0) /
//           validCoordinates.length;
//         setCenter({lat: averageLat, lng: averageLng});
//       }
//     };

//     fetchCoordinates();
//   }, [travelPlaceList]);

//   // 마커를 생성하는 함수
//   const createMarkers = (map: google.maps.Map) => {
//     console.log(locationList);
//     locationList.forEach(location => {
//       new google.maps.Marker({
//         map,
//         position: {lat: location.latitude, lng: location.longitude},
//         // icon: {
//         //   path: google.maps.SymbolPath.CIRCLE, // 기본 마커 대신 원형 심볼
//         //   fillColor: '#FF0000', // 마커 색상 (빨간색)
//         //   fillOpacity: 1, // 색상 불투명도
//         //   strokeWeight: 2, // 테두리 두께
//         //   strokeColor: '#FFFFFF', // 테두리 색상 (흰색)
//         //   scale: 8, // 크기 (값을 키워서 확대)
//         // },
//         icon: {
//           url: hearIcon, // hearIcon 이미지를 마커로 사용
//           size: new google.maps.Size(18, 18), // 원본 이미지 크기 설정
//           scaledSize: new google.maps.Size(18, 18), // 이미지 크기 조정
//         },
//       });
//     });
//   };

//   const handleMapLoad = (map: google.maps.Map) => {
//     mapRef.current = map;
//     createMarkers(map);
//   };

//   if (!isLoaded || !center) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={{width: '350px', height: '150px'}}
//       center={center}
//       zoom={9}
//       onLoad={handleMapLoad}
//     />
//   );
// }

import React, {useEffect, useState, useRef} from 'react';
import {GoogleMap, useJsApiLoader} from '@react-google-maps/api';
import axios from 'axios';
// import hearIcon from '@/assets/icons/hearIcon.png';
import hearIcon from '@/assets/icons/heartIcon.webp';
import Spinner from '@/components/Sipnner/Spinner';

interface MapProps {
  locationList: {lat: number; lng: number}[];
  travelPlaceList: string[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function MapComponent({
  locationList,
  travelPlaceList,
}: MapProps) {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  // const [center, setCenter] = useState<Coordinates | null>(null);

  // Geocoding API를 이용해 장소 이름에서 위도, 경도를 가져오는 함수
  const getCoordinatesFromPlace = async (
    placeName: string
  ): Promise<Coordinates | null> => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;

    try {
      const response = await axios.get(url, {
        params: {
          address: placeName,
          key: apiKey,
        },
      });

      const {results} = response.data;
      if (results && results.length > 0) {
        const location = results[0].geometry.location;
        return {lat: location.lat, lng: location.lng};
      } else {
        console.error('No results found for this place:', placeName);
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  // travelPlaceList에 있는 모든 장소의 좌표를 가져와 LatLngBounds 설정
  const fetchAndSetBounds = async (map: google.maps.Map) => {
    const coordinatesList = await Promise.all(
      travelPlaceList.map(place => getCoordinatesFromPlace(place))
    );

    const validCoordinates = coordinatesList.filter(Boolean) as Coordinates[];

    if (validCoordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      // 각 장소의 좌표를 LatLngBounds에 추가
      validCoordinates.forEach(coord => {
        bounds.extend(coord);
      });

      // 모든 장소가 포함되도록 지도에 fitBounds 적용
      map.fitBounds(bounds);

      // 너무 많이 줌아웃되는 경우 최대 줌 레벨을 설정
      const listener = map.addListener('bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 12) {
          // 최대 줌 레벨 설정
          map.setZoom(9); // 원하는 줌 레벨로 설정
        }
        google.maps.event.removeListener(listener); // 리스너 제거
      });
    }
  };

  // 마커를 생성하는 함수
  const createMarkers = (map: google.maps.Map) => {
    // console.log(locationList);
    locationList.forEach(location => {
      new google.maps.Marker({
        map,
        position: {lat: location.lat, lng: location.lng},
        // icon: {
        //   path: google.maps.SymbolPath.CIRCLE, // 기본 마커 대신 원형 심볼
        //   fillColor: '#FF0000', // 마커 색상 (빨간색)
        //   fillOpacity: 1, // 색상 불투명도
        //   strokeWeight: 2, // 테두리 두께
        //   strokeColor: '#FFFFFF', // 테두리 색상 (흰색)
        //   scale: 8, // 크기 (값을 키워서 확대)
        // },
        icon: {
          url: hearIcon, // hearIcon 이미지를 마커로 사용
          size: new google.maps.Size(18, 18), // 원본 이미지 크기 설정
          scaledSize: new google.maps.Size(18, 18), // 이미지 크기 조정
        },
      });
    });
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    fetchAndSetBounds(map); // 지도 로드 시 travelPlaceList를 기준으로 fitBounds 적용
    createMarkers(map);
  };

  if (!isLoaded) {
    return <Spinner />;
  }

  return (
    <GoogleMap
      mapContainerStyle={{width: '350px', height: '150px'}}
      // center={center} // center가 없을 경우 서울 좌표로 기본값 설정
      zoom={9} // fitBounds가 적용되면 이 값은 자동 조정됨
      onLoad={handleMapLoad}
    />
  );
}
