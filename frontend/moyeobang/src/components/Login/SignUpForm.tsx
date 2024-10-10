import React, {ReactNode, useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import skyBackground from '@/assets/images/skyBackground.jpg';
import bangBang from '@/assets/icons/bangBang.png';
import LabeledInput from '../common/Inputs/LabeledInput';
import Btn from '@/components/common/btn/Btn';
import XButton from '@/assets/icons/closeButton.png';

const SignUpFormStyle = css`
  width: 390px;
  height: 100vh;
  background-image: url(${skyBackground});
  background-size: cover;
  background-position: center;

  #sky-blur {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  #sky-blur-title {
    margin-top: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: 'surround';
    font-size: 24px;
    gap: 10px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  #submit-btn {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
  }
`;

const SignUpFormLayoutStyle = css`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 60px;
`;

const BirthdayInputStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  font-size: 20px;
  font-family: 'regular';
  input {
    width: 330px;
    height: 50px;
    border: 1px solid ${colors.third};
    box-sizing: border-box;
    border-radius: 45px;
    padding: 0 10px;
    font-family: 'semibold';
    font-size: 16px;
    ::placeholder {
      color: ${colors.gray};
      font-size: 16px;
    }
  }
`;

const GenderInputStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  font-size: 20px;
  font-family: 'regular';
  input[type='radio'] {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${colors.third};
    appearance: none;
    outline: none;
    cursor: pointer;
    &:checked {
      background-color: ${colors.second};
    }
  }
  #gender-input-container {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  label {
    margin-right: 10px;
  }
`;

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 검은색 반투명으로 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100; /* 다른 요소 위에 표시되도록 설정 */
`;

const modalContentStyle = css`
  color: ${colors.fifth};
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px 20px 40px 20px;
  border-radius: 10px;
  width: 240px;
  text-align: center;
  font-family: 'semibold';
  font-size: 24px;
  gap: 10px;

  #modal-close-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    img {
      width: 15px;
      height: 15px;
    }
  }
  #modal-error-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 20px;
  }
`;

export default function SignUpForm({isEditMode}: {isEditMode?: boolean}) {
  const [memberName, setMemberName] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [error, setError] = useState<string | ReactNode>('');

  const navigate = useNavigate();
  const handleSubmit = () => {
    const birthdayRegex = /^(?:|\d{4}-\d{2}-\d{2})$/;
    if (!birthdayRegex.test(birthday)) {
      setError(
        <div id="modal-error-message">
          <div>생년월일 형식이 </div>
          <div>올바르지 않습니다.</div>
          <div>
            <span style={{color: colors.customRed}}>YYYY-MM-DD</span>
          </div>
          <div>형식으로 입력해주세요.</div>
        </div>
      );
      return;
    }
    setError('');
    if (isEditMode) {
      // 마이페이지에서 프로필 수정할 때
      navigate({to: `/profile/${memberName}`});
    } else {
      // 처음 회원가입할 때
      // console.log('submit');
      navigate({to: '/accountConnect'});
    }
  };

  return (
    <div css={SignUpFormStyle}>
      <div id="sky-blur">
        <div id="sky-blur-title">
          <img src={bangBang} alt="bangBang" />
          <div>
            모여방과 <span style={{color: colors.third}}>함께해방</span>
          </div>
          <img src={bangBang} alt="bangBang" />
        </div>

        <div css={SignUpFormLayoutStyle}>
          <LabeledInput
            label={
              <div>
                <span style={{color: colors.customRed, marginRight: '10px'}}>
                  *
                </span>
                <span>닉네임</span>
              </div>
            }
            placeholder="닉네임을 입력해주세요"
            value={memberName}
            onChange={e => setMemberName(e.target.value)}
          />
          <div css={BirthdayInputStyle}>
            <div>생년월일</div>
            <div>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
              />
            </div>
          </div>
          <div css={GenderInputStyle}>
            <div>성별</div>
            <div id="gender-input-container">
              <div>
                <label htmlFor="male">남성</label>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={e => setGender(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="female">여성</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={e => setGender(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="other">기타</label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={e => setGender(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div id="submit-btn">
          <Btn
            buttonStyle={{style: memberName ? 'blue' : 'gray', size: 'big'}}
            onClick={handleSubmit}
            disabled={!memberName}
          >
            완료
          </Btn>
        </div>
        {error && (
          <div css={modalOverlayStyle}>
            <div css={modalContentStyle}>
              <div id="modal-close-btn" onClick={() => setError('')}>
                <img src={XButton} alt="XButton" />
              </div>
              <div>{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
