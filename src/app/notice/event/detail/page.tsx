"use client";

import styled from "styled-components";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import { FaPenToSquare } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import FormWrapper from "@/components/container/FormWrapper";
import Image from "next/image";
import EventBtn from "../../Component/EventBtn";
import { useEffect, useState } from "react";
import { makeEventDetail } from "@/apis/notice.type";
import { inquireEvent } from "@/apis/notice";

const ScrollableContent = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 0 1rem;
  box-sizing: border-box;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CustomFormWrapper = styled(FormWrapper)`
  width: 100%;
  max-width: 100%; /* 최대 너비 제한 해제 */
  padding: 1rem 0; /* 상하 패딩만 유지 */
  box-sizing: border-box;
`;

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 1rem 0; /* 좌우 마진 제거, 상하만 유지 */
`;

const SubHeader = styled.div`
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  width: 100%;
`;

const EventWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const DDayDiv = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  padding-right: 0; /* 패딩 제거 */
`;

const WritingBtn = styled.div`
  gap: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 1rem;
  font-weight: 600;
  width: 100%; /* 꽉 찬 너비로 수정 */
  margin-bottom: 1rem;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  border-radius: 0.5rem;
  object-fit: cover;
  max-width: 100%; /* 이미지가 컨테이너를 넘어가지 않도록 */
  height: auto; /* 비율 유지 */
`;

const EventText = styled.div`
  font-size: 1.2rem;
  line-height: 1.8;
  padding: 1rem 0; /* 좌우 패딩 제거 */
  white-space: pre-wrap;
  width: 100%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export default function EventDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [event, setEvent] = useState<makeEventDetail>({
    id: 0,
    eventName: "",
    date: "",
    time: { hour: 0, minute: 0, second: 0, nano: 0 },
    location: "",
    notice: "",
    googleFormLink: "",
  });

  const [dday, setDday] = useState<number | string>("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      inquireEvent(parseInt(id))
        .then((data) => {
          console.log("이벤트 데이터:", data);
          setEvent(data);
        })
        .catch((error) => {
          console.log("조회 실패: ", error);
        });
    }
  }, [id]);

  useEffect(() => {
    const storedMemberData = localStorage.getItem("memberData");
    if (storedMemberData) {
      const memberData = JSON.parse(storedMemberData);
      setRole(memberData.role);
    }

    if (event?.date) {
      const today = new Date();
      const eventDate = new Date(event.date);

      if (isNaN(eventDate.getTime())) {
        console.log("잘못된 날짜 형식입니다:", event.date);
        setDday("날짜 오류");
      } else {
        const timeDiff = eventDate.getTime() - today.getTime();
        const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (daysRemaining < 0) {
          setDday("종료");
        } else if (daysRemaining === 0) {
          setDday("D-Day");
        } else {
          setDday(`D-${daysRemaining}`);
        }
      }
    }
  }, [event.date]);

  const handleWriteClick = () => {
    router.push(`/notice/event/modify?id=${event.id}`);
  };

  const handleNextClick = () => {
    if (event.googleFormLink) {
      window.open(event.googleFormLink, "_blank");
    } else {
      alert("구글폼 링크가 존재하지 않습니다.");
    }
  };

  return (
    <ContainerWrapper>
      <ScrollableContent>
        <Header>{event.eventName}</Header>
        <EventWrapper>
          <div>
            <SubHeader>📍일시 - {event.date} </SubHeader>
            <SubHeader>📍시간 - {`${event.time}`}</SubHeader>
            <SubHeader>📍장소 - {event.location} </SubHeader>
          </div>
          <DDayDiv>{dday}</DDayDiv>
        </EventWrapper>
        <WritingBtn
          onClick={handleWriteClick}
          style={{
            visibility:
              role === "ROLE_MAJOR_PRESIDENT" ||
              role === "ROLE_GRADUATE_STUDENT"
                ? "visible"
                : "hidden",
          }}
        >
          수정하기
          <FaPenToSquare />
        </WritingBtn>
        <CustomFormWrapper>
          {event?.cardNewsImageUrls && event.cardNewsImageUrls.length > 0 && (
            <ImageContainer>
              <StyledImage
                src={event.cardNewsImageUrls[0]}
                alt="이벤트 이미지"
                width={600}
                height={400}
              />
            </ImageContainer>
          )}
          <EventText>{event.notice}</EventText>
        </CustomFormWrapper>
        <ButtonContainer>
          <EventBtn onClick={handleNextClick} text="구글폼 신청링크 바로가기" />
        </ButtonContainer>
      </ScrollableContent>
    </ContainerWrapper>
  );
}
