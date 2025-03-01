"use client";

import { theme } from "@/app/styles/theme";
import styled from "styled-components";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import NoticeCard from "../Component/NoticeCard";
import { useEffect, useState } from "react";
import { getMajorEvent, deleteEvent } from "@/apis/notice";
import { majorEventList } from "@/apis/notice.type";
import ToggleBtn from "@/components/button/toggleBtn";

type UserRole =
  | "ROLE_ADMIN"
  | "ROLE_MAJOR_PRESIDENT"
  | "ROLE_STUDENT_COUNCIL"
  | "ROLE_STUDENT"
  | "ROLE_GRADUATE_STUDENT";

interface UserInfo {
  memberId: number;
  name: string;
  major: string;
  studentNumber: number;
  role: UserRole;
  checkStudentCard: boolean;
}

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ContentNoticeBox = styled.div`
  width: 100%;
  height: 30rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0px 10px ${theme.colors.mutedText};
  overflow: hidden;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 27rem;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 0.5rem;
  gap: 0.5rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export default function Event() {
  const [notices, setNotices] = useState<majorEventList>([]);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const memberData = localStorage.getItem("memberData");
    if (memberData) {
      try {
        const parsedData: UserInfo = JSON.parse(memberData);

        const allowedRoles: UserRole[] = [
          "ROLE_ADMIN",
          "ROLE_MAJOR_PRESIDENT",
          "ROLE_STUDENT_COUNCIL",
        ];
        setCanDelete(allowedRoles.includes(parsedData.role));
      } catch (error) {
        console.error("로컬 스토리지 값 안보여짐 에러 :", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getMajorEvent();
        setNotices(data);
      } catch (error) {
        console.log("과행사 공지 에러: ", error);
      }
    };
    fetchNotices();
  }, []);

  const calculateDDay = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diff = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 ? `D-${diff}` : "종료됨";
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);

      setNotices((prev) => prev.filter((notice) => notice.id !== id));
    } catch (error) {
      console.error("공지 삭제 실패:", error);
      alert("공지 삭제에 실패했습니다.");
    }
  };

  return (
    <ContainerWrapper>
      <ContentContainer>
        <Header>
          과행사 공지 확인하기{" "}
          <ToggleBtn keyName="alarmMajorEvent" initialState={false} />
        </Header>

        <ContentNoticeBox>
          <ScrollContainer>
            {notices.map((notice, index) => {
              const dDay = calculateDDay(notice.date);
              return (
                <NoticeCard
                  key={index}
                  notice={{
                    ...notice,
                    dDay,
                  }}
                  onDelete={handleDelete}
                  canDelete={canDelete}
                />
              );
            })}
          </ScrollContainer>
        </ContentNoticeBox>
      </ContentContainer>
    </ContainerWrapper>
  );
}
