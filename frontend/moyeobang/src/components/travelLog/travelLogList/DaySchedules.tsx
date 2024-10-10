import React, {useEffect, useState} from 'react';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import SingleTravelLog from './travelSingleCard/SingleTravelLog';
import {useTravelLogContext} from '@/contexts/TravelLog';
import PlusSelf from '@/components/travelLog/PlusSelf/PlusSelf';
import ScheduleMapSearch from '@/components/travelLog/PlusSelf/Map/ScheduleMapSearch';
import sadBangBang from '@/assets/icons/sadBangbang.png';

const travelDayTitleSytle = css`
  margin: 15px;
  padding-left: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const dayIdStyle = css`
  font-family: 'englishbold';
  font-size: 24px;
  color: ${colors.fifth};
  line-height: 1;
`;

const dayDateStyle = css`
  font-size: 18px;
  color: ${colors.lightBlack};
  line-height: 1;
`;

const scheduleScrollStyle = css`
  overflow-y: auto;
  height: 345px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const noScheduleStyle = css`
  font-size: 20px;
  color: ${colors.black};
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    margin-top: 30px;
    width: 150px;
    height: 150px;
  }
`;

export default function DaySchedules({
  date,
  dayNum,
}: {
  dayNum: number;
  date: string;
}) {
  interface ChangeSequence {
    scheduleId: number;
    sequence: number;
  }
  const {travelSchedules, setTravelSchedules} = useTravelLogContext();
  const [changeSequence, setChangeSequence] = useState<ChangeSequence[]>([]);

  const daySchedules = travelSchedules[dayNum - 1]?.daySchedules || [];
  // console.log('[*] daySchedules', daySchedules);
  // console.log('[*] 이거 travelSchedules', travelSchedules);

  const updateSequence = (
    dayNum: number,
    scheduleId: number,
    newSequence: number
  ) => {
    const changeSequences: {scheduleId: number; sequence: number}[] = [];
    setTravelSchedules(prevSchedules => {
      const updatedSchedules = prevSchedules?.map(daySchedule => {
        if (daySchedule.dayNum === dayNum) {
          const updatedDaySchedules = daySchedule.daySchedules
            .map(schedule => {
              if (schedule.scheduleId === scheduleId) {
                changeSequences.push({
                  scheduleId: schedule.scheduleId,
                  sequence: newSequence,
                }); // 배열에 추가
                return {...schedule, sequence: newSequence};
              }
              return schedule;
            })
            .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)); // sequence 값으로 정렬
          return {...daySchedule, daySchedules: updatedDaySchedules};
        }
        return daySchedule;
      });
      return updatedSchedules;
    });
  };

  useEffect(() => {
    // console.log('[*] changeSequence', changeSequence);
  }, [changeSequence]);

  // onDragEnd 함수 추가
  const handleOnDragEnd = (result: any) => {
    const {source, destination} = result;

    // 드래그가 성공적으로 완료되지 않으면 아무 것도 하지 않음
    if (!destination) return;

    const dayId = dayNum - 1; // dayNum을 기준으로 배열 index로 사용 (0부터 시작하도록)

    // travelSchedules의 깊은 복사본을 생성하여 불변성 유지
    const updatedTravelSchedules = [...travelSchedules];

    // 현재 dayId의 스케줄을 가져옴
    const currentDaySchedules = Array.from(
      updatedTravelSchedules[dayId].daySchedules
    );

    // 드래그된 항목을 source에서 제거하고 destination으로 삽입
    const [movedItem] = currentDaySchedules.splice(source.index, 1);
    currentDaySchedules.splice(destination.index, 0, movedItem);

    // 변경된 스케줄을 updatedTravelSchedules에 다시 할당
    updatedTravelSchedules[dayId].daySchedules = currentDaySchedules;

    // 상태 업데이트
    setTravelSchedules(updatedTravelSchedules);

    // sequence 값을 업데이트
    currentDaySchedules.forEach((schedule, index) => {
      updateSequence(dayNum, schedule.scheduleId ?? 0, index + 1);
    });

    // console.log('드래그 시작 위치:', source.index);
    // console.log('드래그 종료 위치:', destination.index);
  };
  return (
    <div style={{width: '390px', height: '100%', position: 'relative'}}>
      {/* {daySchedules.length > 0 && <span css={verticalLineStyle}></span>} */}
      <div css={travelDayTitleSytle}>
        <span css={dayIdStyle}> DAY {dayNum} </span>
        <span css={dayDateStyle}>{date}</span>
      </div>
      <div css={scheduleScrollStyle}>
        {daySchedules && daySchedules.length > 0 ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {' '}
            {/* onDragEnd 추가 */}
            <Droppable droppableId="daySchedules">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {daySchedules.map((schedule, index: number) => {
                    // console.log('[*] schedule', schedule);

                    return (
                      <Draggable
                        key={`schedule-${schedule.scheduleId}`}
                        draggableId={`schedule-${schedule.scheduleId}`}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              transform:
                                provided.draggableProps.style?.transform,
                              top: 0,
                              left: 0,
                              position: 'relative',
                            }}
                          >
                            <SingleTravelLog
                              schedule={schedule}
                              scheduleNum={index + 1}
                              dayNum={dayNum}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div css={noScheduleStyle}>
            <img src={sadBangBang} alt="sadBangBang" />
            <span>아직 일정이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}
