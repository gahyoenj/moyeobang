import {useTravelLogContext} from '@/contexts/TravelLog';
import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring';
import {useSwipeable} from 'react-swipeable';
import {css} from '@emotion/react';
import * as MarkerDetailStyle from '@/components/travelLog/PlusSelf/Map/MarkerDetailStyle';
import Btn from '@/components/common/btn/Btn';
import blankStar from '@/assets/icons/blankStar.png';
import blueStar from '@/assets/icons/blueStar.png';
import springLine from '@/assets/icons/springLine.png';
import categoryIcon from '@/assets/icons/categoryIcon.png';
import locationIcon from '@/assets/icons/locationIcon.png';
import reviewIcon from '@/assets/icons/reviewIcon.png';

export default function MarkerDetail({
  setShowMarkerDetail,
}: {
  setShowMarkerDetail: (show: boolean) => void;
}) {
  const {
    selectedMarker,
    setSelectedMarker,
    setScheduleName,
    setSearchLocation,
    handleShowMapSearch,
  } = useTravelLogContext();

  useEffect(() => {
    // console.log('[*]야 임마 selectedMarker', selectedMarker);
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const MarkerDetailHeight = isExpanded ? '80vh' : '20vh';

  // Handle swipe gestures using react-swipeable
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setIsExpanded(true),
    onSwipedDown: () => setIsExpanded(false),
    preventScrollOnSwipe: false,
    trackTouch: true,
    delta: 10,
  });

  const springProps = useSpring({
    height: MarkerDetailHeight,
    config: {tension: 300, friction: 40}, // Adjust animation speed
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= rating ? blueStar : blankStar}
          alt={`${i} star`}
          style={{
            width: '15px',
            height: '15px',
          }}
        />
      );
    }
    return stars;
  };

  const handleDetailClose = () => {
    setSearchLocation(selectedMarker?.title || '');
    setScheduleName(selectedMarker?.title || '');
    handleShowMapSearch();
    setShowMarkerDetail(false);
  };

  return (
    <animated.div style={springProps}>
      {!isExpanded ? (
        // 축소된 상태
        <div css={MarkerDetailStyle.markerDetailStyle} {...swipeHandlers}>
          <div id="springLine">
            <img
              src={springLine}
              alt="springLine"
              style={{marginBottom: '10px'}}
            />
          </div>
          <div css={MarkerDetailStyle.MapDetailContentLayout}>
            <div css={MarkerDetailStyle.MapDetailHeader}>
              <div id="title">{selectedMarker?.title}</div>
              <div id="rating">
                {selectedMarker?.rating && selectedMarker.rating > 0 ? (
                  <>
                    {selectedMarker.rating} {renderStars(selectedMarker.rating)}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div css={MarkerDetailStyle.MapDetailContent}>
              <div id="types">
                <img
                  src={categoryIcon}
                  alt="categoryIcon"
                  style={{width: '15px', height: '15px'}}
                />
                {selectedMarker?.types?.[0]}
              </div>
              <div id="address">
                <img
                  src={locationIcon}
                  alt="locationIcon"
                  style={{width: '15px', height: '15px'}}
                />
                {selectedMarker?.address}
              </div>
            </div>
          </div>
          <div css={MarkerDetailStyle.BtnLayout}>
            <Btn
              buttonStyle={{style: 'blue', size: 'big'}}
              onClick={handleDetailClose}
            >
              장소확정
            </Btn>
          </div>
        </div>
      ) : (
        // 확대된 상태
        <div css={MarkerDetailStyle.markerDetailStyle}>
          <div
            css={MarkerDetailStyle.MapDetailContentLayout}
            {...swipeHandlers}
          >
            <div id="springLine">
              <img
                src={springLine}
                alt="springLine"
                style={{marginBottom: '10px'}}
              />
            </div>
            <div css={MarkerDetailStyle.LongMapDetailHeader}>
              <div id="title">{selectedMarker?.title}</div>
              <div id="rating">
                {selectedMarker?.rating && selectedMarker.rating > 0 ? (
                  <>
                    {selectedMarker.rating} {renderStars(selectedMarker.rating)}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div css={MarkerDetailStyle.LongMapDetailContent}>
              <div id="types">
                <img
                  src={categoryIcon}
                  alt="categoryIcon"
                  style={{width: '20px', height: '20px'}}
                />
                {selectedMarker?.types?.[0]}
              </div>
              <div id="address">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <img
                    src={locationIcon}
                    alt="locationIcon"
                    style={{width: '20px', height: '20px'}}
                  />
                </div>
                <div>{selectedMarker?.address}</div>
              </div>
            </div>
          </div>

          <div css={MarkerDetailStyle.ReviewsLayout}>
            <div id="reviews-header">
              <img
                src={reviewIcon}
                alt="reviewIcon"
                style={{width: '20px', height: '20px'}}
              />
              <div>Reviews</div>
            </div>
            <div id="reviews">
              <div id="reviews-images">
                {selectedMarker?.photos
                  ?.slice(0, 3)
                  .map((photo: string) => (
                    <img
                      key={photo}
                      src={photo}
                      alt="reviewImage"
                      style={{width: '100px', height: '100px'}}
                    />
                  ))}
              </div>
              <div id="reviews-content">
                {selectedMarker?.reviews?.map((review: Review) => (
                  <div key={review.authorName}>
                    <div id="reviews-content-header">
                      <div>{review.authorName}</div>
                      <div>
                        <img
                          src={blueStar}
                          alt="blueStar"
                          style={{width: '13px', height: '13px'}}
                        />
                        {review.rating}
                      </div>
                    </div>
                    <div style={{lineHeight: '1.3'}}>{review.reviewText}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div css={MarkerDetailStyle.BtnLayout}>
            <Btn
              buttonStyle={{style: 'blue', size: 'big'}}
              onClick={handleDetailClose}
            >
              장소확정
            </Btn>
          </div>
        </div>
      )}
    </animated.div>
  );
}
