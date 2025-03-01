"use client";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import SlideHeader from "@/components/Header/SlideHeader";
import styled from "styled-components";
import { theme } from "../styles/theme";
import NoticeCard from "./Component/NoticeCard";
import NoticeCommonCard from "./Component/NoticeCommonCard";
import { FaPenToSquare } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getEmployNotice,
  getMajorEvent,
  getMajorNotice,
  deleteEvent,
} from "@/apis/notice";
import { majorEventList, majorNoticeList } from "@/apis/notice.type";
import axios from "axios";
import { IoChevronForwardCircleOutline } from "react-icons/io5";

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

export default function Notice() {
  const [eventNotices, setEventNotices] = useState<majorEventList | null>(null);
  const [majorNotices, setmajorNotices] = useState<majorNoticeList | null>(
    null
  );
  const [employNotices, setemployNotices] = useState<majorNoticeList | null>(
    null
  );
  const size = 3;
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("ROLE_ADMIN");
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const memberData = localStorage.getItem("memberData");
    if (memberData) {
      try {
        const parsedData: UserInfo = JSON.parse(memberData);
        setRole(parsedData.role as UserRole);

        // 삭제 권한이 있는 역할 확인
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
        const [majorData, employData, eventData] = await Promise.all([
          getMajorNotice(size),
          getEmployNotice(size),
          getMajorEvent(),
        ]);

        console.log("과행사 공지 Data:", eventData);

        setmajorNotices(majorData);
        setemployNotices(employData);
        setEventNotices(eventData);
      } catch (error) {
        console.error("공지사항을 가져오는 데 실패했습니다.", error);
      }
    };

    fetchNotices();
  }, [size]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        console.log(
          "로컬스토리지 memberData:",
          localStorage.getItem("memberData")
        );
        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${baseURL}/api/v1/member`, {
          withCredentials: true,
        });
        console.log("서버에서 받은 memberData:", response.data); //
        const memberData = response.data;
        localStorage.setItem("memberData", JSON.stringify(memberData));
        console.log(memberData);
      } catch (error) {
        console.error("회원정보 불러오기 실패: ", error);
      }
    };
    fetchMemberData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);

      if (eventNotices) {
        setEventNotices(eventNotices.filter((notice) => notice.id !== id));
      }
    } catch (error) {
      console.error("공지 삭제 실패:", error);
      alert("공지 삭제에 실패했습니다.");
    }
  };

  const handleWriteClick = () => {
    router.push("/notice/event/enroll");
  };

  const handleEventClick = () => {
    router.push("/notice/event");
  };

  const handleCollegeClick = () => {
    router.push("/notice/college");
  };

  const handleEmploymentClick = () => {
    router.push("/notice/employment");
  };

  const calculateDDay = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diff = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 ? `D-${diff}` : "종료됨";
  };

  return (
    <ContainerWrapper>
      <SlideHeader />

      <ContentContainer>
        <HeaderContainer>
          <Header>
            <p onClick={handleEventClick}>
              과행사 공지 확인하기
              <IoChevronForwardCircleOutline />
            </p>

            <WritingBtnWrapper>
              {(role === "ROLE_ADMIN" ||
                role === "ROLE_MAJOR_PRESIDENT" ||
                role === "ROLE_STUDENT_COUNCIL") && (
                <WritingBtn onClick={handleWriteClick}>
                  글쓰기
                  <FaPenToSquare />
                </WritingBtn>
              )}
            </WritingBtnWrapper>
          </Header>
        </HeaderContainer>

        <ContentNoticeBox>
          <ScrollContainer>
            {eventNotices &&
              eventNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={{
                    ...notice,
                    dDay: calculateDDay(notice.date),
                  }}
                  onDelete={handleDelete}
                  canDelete={canDelete}
                />
              ))}
          </ScrollContainer>
        </ContentNoticeBox>
        <HeaderContainer>
          <Header onClick={handleCollegeClick}>
            학부 공지 확인하기
            <IoChevronForwardCircleOutline />
          </Header>
        </HeaderContainer>
        <ContentNoticeBox>
          <ScrollContainer>
            {majorNotices?.content.map((notice, index) => (
              <NoticeCommonCard key={index} notice={notice} />
            ))}
          </ScrollContainer>
        </ContentNoticeBox>
        <HeaderContainer>
          <Header onClick={handleEmploymentClick}>
            취업정보 공지 확인하기
            <IoChevronForwardCircleOutline />
          </Header>
        </HeaderContainer>
        <ContentNoticeBox>
          <ScrollContainer>
            {employNotices?.content.map((notice, index) => (
              <NoticeCommonCard key={index} notice={notice} />
            ))}
          </ScrollContainer>
        </ContentNoticeBox>
      </ContentContainer>
    </ContainerWrapper>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.5rem;
  width: 100%;
`;

const Header = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  justify-content: space-start;
  align-items: center;
  width: 100%;
  p {
    width: 16rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const WritingBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 20vh;
`;

const WritingBtn = styled.div`
  gap: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 27rem;
  height: calc(100vh - 60px);
  margin: 0 auto;
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

const ContentNoticeBox = styled.div`
  width: 100%;
  min-height: 10rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0px 10px ${theme.colors.mutedText};
  overflow: hidden;
  flex-shrink: 0;
`;

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
