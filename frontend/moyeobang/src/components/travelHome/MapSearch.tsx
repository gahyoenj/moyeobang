// import {useQuery} from '@tanstack/react-query';
// import axios from 'axios';
// import React, {useState} from 'react';

// // Define the response type for the Google API results
// interface CityResult {
//   formatted_address: string;
// }

// // Google Places API에서 도시 정보를 가져오는 함수
// const fetchCityData = async (cityName: string): Promise<CityResult[]> => {
//   const APIKey = process.env.VITE_GOOGLE_API_KEY;
//   const response = await axios.get(
//     `https://maps.googleapis.com/maps/api/geocode/json`,
//     {
//       params: {
//         address: cityName,
//         key: APIKey,
//       },
//     }
//   );
//   return response.data.results; // 도시 정보 반환
// };

// export default function MapSearch() {
//   const [cityInput, setCityInput] = useState<string>(''); // 입력값 관리
//   const [cityName, setCityName] = useState<string>(''); // 검색된 도시 이름 관리

//   // 도시 검색 쿼리
//   const {data, error, isLoading} = useQuery<CityResult[]>({
//     queryKey: ['cityData', cityName], // 쿼리 키
//     queryFn: () => fetchCityData(cityName), // 쿼리 함수
//     enabled: !!cityName, // cityName이 있을 때만 실행
//   });

//   // 폼 제출 시 입력값을 설정
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cityInput.trim()) {
//       setCityName(cityInput); // 입력된 도시로 검색 실행
//       setCityInput(''); // 입력 필드 초기화
//     }
//   };

//   return (
//     <div>
//       <h1>City Search</h1>
//       {/* 입력 폼 */}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={cityInput}
//           onChange={e => setCityInput(e.target.value)} // 입력값 상태 업데이트
//           placeholder="도시 이름을 입력하세요"
//         />
//         <button type="submit">검색</button>
//       </form>
//       {/* 검색 결과 출력 */}
//       {isLoading && <div>Loading...</div>}
//       {error && <div>Error occurred!</div>}
//       {data && (
//         <ul>
//           {data.map((result: CityResult, index: number) => (
//             <li key={index}>{result.formatted_address}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import React, {useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {css, keyframes} from '@emotion/react';
import bangBang from '@/assets/icons/bangBang.png';

interface AddressComponent {
  long_name: string;
}

interface CityResult {
  address_components: AddressComponent[]; // address_components 배열을 정확히 정의
}

// Google Places API에서 도시 정보를 가져오는 함수
const fetchCityData = async (cityName: string): Promise<CityResult[]> => {
  const APIKey = import.meta.env.VITE_GOOGLE_API_KEY;

  try {
    // console.log('API key확인', process.env.VITE_GOOGLE_API_KEY);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: cityName,
          key: APIKey,
        },
      }
    );

    // console.log('지도 검색 결과:', response); // 응답 결과 로그
    return response.data.results;
  } catch (error) {
    console.error(error); // 에러 메시지 로그
    return [];
  }
};

interface MapSearchProps {
  cityName: string; // 검색할 도시 이름
  onSelectCity: (city: string) => void; // 선택한 도시를 부모에게 전달하는 함수
}

const containerStyle = css`
  position: relative; /* 드롭다운을 인풋 필드 아래에 고정하기 위해 컨테이너를 상대적으로 배치 */
  width: 100%;
`;

const dropdownStyle = css`
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: -5px;
  font-family: 'medium';
  font-size: 16px;

  ul {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  li {
    padding: 12px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

// 애니메이션 정의: 이미지를 회전시키는 애니메이션
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 로딩 상태에서 bangBang 이미지 스타일
const loadingSpinnerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;

  img {
    width: 50px;
    height: 50px;
    animation: ${rotate} 1.5s linear infinite; /* 이미지를 1.5초마다 회전 */
  }
`;

export default function MapSearch({cityName, onSelectCity}: MapSearchProps) {
  useEffect(() => {
    // console.log('*cityName 값:', cityName);
  }, [cityName]);

  // 도시 검색 쿼리
  const {data, error, isLoading} = useQuery<CityResult[]>({
    queryKey: ['cityData', cityName], // 쿼리 키로 cityName을 사용
    queryFn: () => fetchCityData(cityName),
    enabled: !!cityName, // cityName이 있을 때만 실행
  });

  return (
    <div css={containerStyle}>
      {isLoading && (
        <div css={loadingSpinnerStyle}>
          <img src={bangBang} alt="" />
        </div>
      )}
      {error && <div>Error occurred!</div>}
      {data && (
        <div css={dropdownStyle}>
          <ul>
            {data.map((result: CityResult, index: number) => (
              <li
                key={index}
                onClick={() => {
                  if (
                    result.address_components &&
                    result.address_components.length > 0
                  ) {
                    onSelectCity(result.address_components[0].long_name); // 첫 번째 주소 컴포넌트의 long_name 전달
                  }
                }}
              >
                {result.address_components &&
                result.address_components.length > 0
                  ? result.address_components[0].long_name
                  : 'Unknown location'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
