"use client";
import React, { useState, useEffect, useRef, TouchEvent } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "@/app/styles/theme";
import bannerBackground from "../../../public/bannerBackground.png";
import { majorEventList } from "@/apis/notice.type";
import { getMajorEvent } from "@/apis/notice";

export default function SlideHeader() {
  const [eventNotices, setEventNotices] = useState<majorEventList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"right" | "left">(
    "right"
  );
  const touchStart = useRef<number>(0);
  const touchEnd = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 50;
    const swipeDistance = touchStart.current - touchEnd.current;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // 왼쪽으로 스와이프
        setSlideDirection("left");
        setCurrentIndex((prev) =>
          prev === (eventNotices?.length || 0) - 1 ? 0 : prev + 1
        );
      } else {
        // 오른쪽으로 스와이프
        setSlideDirection("right");
        setCurrentIndex((prev) =>
          prev === 0 ? (eventNotices?.length || 0) - 1 : prev - 1
        );
      }
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getMajorEvent();
        setEventNotices(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("이벤트 데이터를 가져오는데 실패했습니다.", error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    if (eventNotices && eventNotices.length > 1) {
      const timer = setInterval(() => {
        setSlideDirection("left");
        setCurrentIndex((prev) =>
          prev === eventNotices.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [eventNotices]);

  if (!eventNotices || eventNotices.length === 0) {
    return null;
  }

  const currentEvent = eventNotices[currentIndex];

  return (
    <Container>
      <SlideHeaderWapper
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        direction={slideDirection}
      >
        <Overlay />
        <Content>
          <Title>{currentEvent.eventName}</Title>
          <Date>{`${currentEvent.date} ${currentEvent.time}`}</Date>
          <ApplyButton
            onClick={() => window.open(currentEvent.googleFormLink, "_blank")}
          >
            신청하기
          </ApplyButton>
        </Content>
        <ImageContainer>
          {currentEvent.firstImageUrl && (
            <img
              src={currentEvent.firstImageUrl}
              alt={currentEvent.eventName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0.5rem",
              }}
            />
          )}
        </ImageContainer>
      </SlideHeaderWapper>
      <Indicators>
        {eventNotices.map((_, index) => (
          <Indicator
            key={index}
            $active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Indicators>
    </Container>
  );
}

const slideRight = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideLeft = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const SlideHeaderWapper = styled.div<{ direction: "right" | "left" }>`
  position: relative;
  width: 23rem;
  height: 10rem;
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 1rem;
  color: white;
  background: url(${bannerBackground.src}) #0077ff 10%;
  background-color: ${theme.colors.primary};
  overflow: hidden;
  animation: ${(props) =>
      props.direction === "right" ? slideRight : slideLeft}
    0.5s ease-in-out;
`;

const Indicators = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: -0.5rem;
`;

const Indicator = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? theme.colors.primary : theme.colors.mutedText};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.primary};
  mix-blend-mode: screen;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

const Title = styled.h1`
  color: ${theme.colors.contrast};
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

const Date = styled.p`
  font-size: 1rem;
`;

const ApplyButton = styled.button`
  display: inline-flex;
  width: 87px;
  height: 30px;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-radius: 40px;
  background: ${theme.colors.text};
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
  position: relative;
  width: 8rem;
  height: 8rem;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
`;
