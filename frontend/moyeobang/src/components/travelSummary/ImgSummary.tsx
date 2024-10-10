// import {css} from '@emotion/react';
// import informationIcon from '@/assets/icons/information.png';
// import cloudIcon from '@/assets/icons/cloud.webp';
// import roadImg from '@/assets/icons/roadImg.png';
// import airplaneIcon from '@/assets/icons/airplane.webp';
// import MessagePopup from '../common/messagePopup/MessagePopup';
// import React, {useState, useEffect, useRef} from 'react';

// interface ImgSummaryProps {
//   scheduleImg: {imgUrl: string; locationName: string}[];
// }

// export default function ImgSummary({scheduleImg}: ImgSummaryProps) {
//   const [message, setMessage] = useState<boolean>(false);
//   const popupRef = useRef<HTMLDivElement>(null);

//   // 화면에서 다른 곳을 클릭했을 때 팝업을 닫는 기능 추가
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node)
//       ) {
//         setMessage(false); // popupRef 외부를 클릭하면 팝업 닫기
//       }
//     };

//     console.log(scheduleImg);

//     // 전역 클릭 이벤트 등록
//     document.addEventListener('mousedown', handleClickOutside);

//     // 컴포넌트가 언마운트될 때 이벤트 제거
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleInformation = () => {
//     setMessage(!message);
//   };

//   return (
//     <div css={containerStyle}>
//       <div css={boxStyle}>
//         {/* 팝업을 감싸는 div에 ref 추가 */}
//         <div css={popUpStyle} ref={popupRef}>
//           {message && (
//             <MessagePopup>
//               <>
//                 {/* <p css={firstLineStyle}>업로드한 사진 8개를</p>
//                 <p>랜덤으로 보여줍니다.</p> */}
//                 <p>
//                   업로드한 사진 8개를 <br />
//                   랜덤으로 보여줍니다.
//                 </p>
//               </>
//             </MessagePopup>
//           )}
//         </div>
//         <img
//           src={informationIcon}
//           css={informationImgStyle}
//           onClick={handleInformation}
//         />
//         <img src={cloudIcon} css={cloudIconStyle} />
//         <img src={airplaneIcon} css={airplaneIconStyle} />
//         <div css={gridContainerStyle}>
//           {scheduleImg.map((item, index) => (
//             <div css={gridItemStyle} key={index}>
//               <img src={item.imgUrl} alt={item.locationName} css={imgStyle} />
//               <p css={placeNameStyle}>{item.locationName}</p>
//             </div>
//           ))}
//         </div>
//         <img src={roadImg} css={roadImgStyle} />
//       </div>
//     </div>
//   );
// }

import React, {useState, useEffect, useRef} from 'react';
import {css} from '@emotion/react';
import informationIcon from '@/assets/icons/information.png';
import cloudIcon from '@/assets/icons/cloud.webp';
import roadImg from '@/assets/icons/roadImg.png';
import airplaneIcon from '@/assets/icons/airplane.webp';
import MessagePopup from '../common/messagePopup/MessagePopup';

interface ImgSummaryProps {
  scheduleImg: {imgUrl: string; locationName: string}[];
}

const containerStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const boxStyle = css`
  width: 98%;
  height: 582px;
  background-color: rgba(135, 224, 255, 0.3);
  margin: 40px 0;
  border-radius: 15px;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const popUpStyle = css`
  position: absolute;
  right: -15px;
  top: -55px;
  font-family: 'semibold';
`;

const informationImgStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
`;

const cloudIconStyle = css`
  width: 60px;
  position: absolute;
  top: 60px;
  left: 20px;
`;

const roadImgStyle = css`
  margin-top: 75px;
  width: 250px;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const airplaneIconStyle = css`
  position: absolute;
  bottom: 30px;
  right: 20px;
  width: 90px;
`;

const gridContainerStyle = css`
  position: absolute;
  top: 40px; /* roadImg 위로 이미지 위치 조정 */
  left: 38%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 개의 열로 구성 */
  gap: 20px;
  width: 75px;
  z-index: 2;
`;

const gridItemStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const imgStyle = css`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 5px;
`;

const placeNameStyle = css`
  font-family: 'semibold';
  font-size: 13px;
  color: #333;
`;

export default function ImgSummary({scheduleImg}: ImgSummaryProps) {
  const [message, setMessage] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // 랜덤으로 이미지를 최대 8개 선택
  const getRandomImages = (
    images: {imgUrl: string; locationName: string}[]
  ) => {
    return images
      .sort(() => Math.random() - 0.5) // 배열을 무작위로 섞기
      .slice(0, 8); // 최대 8개의 항목 선택
  };

  // 선택된 이미지를 상태로 관리
  const [randomImages, setRandomImages] = useState(
    getRandomImages(scheduleImg)
  );

  // 화면에서 다른 곳을 클릭했을 때 팝업을 닫는 기능 추가
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setMessage(false); // popupRef 외부를 클릭하면 팝업 닫기
      }
    };

    // 전역 클릭 이벤트 등록
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInformation = () => {
    setMessage(!message);
  };

  return (
    <div css={containerStyle}>
      <div css={boxStyle}>
        <div css={popUpStyle} ref={popupRef}>
          {message && (
            <MessagePopup>
              <p>
                업로드한 사진 8개를 <br />
                랜덤으로 보여줍니다.
              </p>
            </MessagePopup>
          )}
        </div>
        <img
          src={informationIcon}
          css={informationImgStyle}
          onClick={handleInformation}
        />
        <img src={cloudIcon} css={cloudIconStyle} />
        <img src={airplaneIcon} css={airplaneIconStyle} />
        <div css={gridContainerStyle}>
          {randomImages.map((item, index) => (
            <div css={gridItemStyle} key={index}>
              <img src={item.imgUrl} alt={item.locationName} css={imgStyle} />
              <p css={placeNameStyle}>{item.locationName}</p>
            </div>
          ))}
        </div>
        <img src={roadImg} css={roadImgStyle} />
      </div>
    </div>
  );
}
