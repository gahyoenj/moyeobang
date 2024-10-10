/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import navBar from '@/assets/icons/navBar.png';
import travelLog from '@/assets/icons/travelLog.webp';
import wallet from '@/assets/icons/wallet.png';
import coin from '@/assets/icons/coin.png';
import CalculatePopup from '../calculate/CalculatePopup';
import { Link, useLocation } from '@tanstack/react-router';

const footer = css`
  position: fixed;
  max-width: 390px;
  bottom: 0;
  left:0;
  width: 100%;
  z-index: 10;
`;

const nav = css`
  width: 100%;
  height: 76.522px;
  position: relative;
  background-image: url(${navBar});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 163px;
`;

const travel = (isSelected: boolean) => css`
  align-items: center;
  p {
    font-family: 'semibold';
    font-size: 12px;
    margin-left: 5px;
    color: ${isSelected ? '#03A6FF' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const account = (isSelected: boolean) => css`
  align-items: center;
  p {
    font-family: 'semibold';
    font-size: 12px;
    margin-left: 3px;
    color: ${isSelected ? '#03A6FF' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

// const cal = css`
//   width: 65px;
//   height: 65px;
//   background-color: rgba(135, 224, 255, 0.3);
//   border-radius: 50%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin: -41px auto;
//   box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.4);

//   p {
//     font-family: 'semibold';
//     font-size: 12px;
//     margin-top: 3px;
//     display: flex;
//     margin-right: 1px;
//     color: rgba(0, 0, 0, 0.6);
//   }
// `;

const linkStyle=css`
  text-decoration: none;
`;

const cal = css`
  position: absolute; /* 부모 요소(nav) 안에서 위치를 고정 */
  top: -25px; /* nav 위쪽에 위치하도록 설정 */
  left: 50%; /* 가로 중앙에 위치 */
  transform: translateX(-50%); /* 중앙 정렬을 보장하기 위해 X축으로 50% 이동 */
  width: 65px;
  height: 65px;
  background-color: rgb(196, 239, 248); /* 투명도 없는 비슷한 색상 */
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.4);
  z-index: 30;

  p {
    font-family: 'semibold';
    font-size: 12px;
    margin-top: 3px;
    color: rgba(0, 0, 0, 0.6);
  }
`;

// {onCalClick}: {onCalClick: () => void}
export default function Navbar() {
  const [showModal, setShowModal] = useState<string | boolean>(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>(location.pathname)


  const onCalClick = () => {
    setShowModal(!showModal);
  };

  useEffect(()=> {
    if (location.pathname.includes('/travelLog')) {
      setActiveItem('travelLog')
    } else if (location.pathname.includes('/account')) {
      setActiveItem('account')
    }
  }, [location.pathname])
  return (
    <>
      <div css={footer}>
        <div css={cal} onClick={onCalClick}>
          <img src={coin} width={35} height={35} />
          <p>정산</p>
        </div>
        <div css={nav}>
          <div 
          css={travel(activeItem=== 'travelLog')}
          >
            <Link to={'/travelLog'} css={linkStyle} >
            <img src={travelLog} width={50} height={50} alt="여행 기록" />
            </Link>
            <p>여행기록</p>
          </div>
          <div 
          css={account(activeItem === 'account')}
          >
            <Link to={'/account'} css={linkStyle} >
            <img src={wallet} width={50} height={50} />
            </Link>
            <p>모임통장</p>
          </div>
        </div>
      </div>

      {showModal && <CalculatePopup onCalClick={onCalClick}></CalculatePopup>}
    </>
  );
}
