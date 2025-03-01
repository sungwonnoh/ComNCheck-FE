"use client";

import styled from "styled-components";
import { theme } from "@/app/styles/theme";
import { FaRegAddressCard, FaClipboardUser } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";
import { TbSquaresFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SeminarAlert from "../../components/modal/seminarAlert";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { postLogout } from "@/apis/member";

type UserRole =
  | "ROLE_ADMIN"
  | "ROLE_MAJOR_PRESIDENT"
  | "ROLE_STUDENT_COUNCIL"
  | "ROLE_STUDENT"
  | "ROLE_GRADUATE_STUDENT";

interface ButtonConfig {
  role: UserRole[];
  icon: React.ElementType;
  text: string;
  route?: string;
  action?: "openModal";
}

interface UserInfo {
  memberId: number;
  name: string;
  major: string;
  studentNumber: number;
  role: UserRole;
  checkStudentCard: boolean;
}

const roleLabels: Record<UserRole, string> = {
  ROLE_ADMIN: "관리자",
  ROLE_MAJOR_PRESIDENT: "과회장",
  ROLE_STUDENT_COUNCIL: "학생회",
  ROLE_STUDENT: "학생",
  ROLE_GRADUATE_STUDENT: "졸업생",
};

export default function My() {
  const [role, setRole] = useState<UserRole>("ROLE_STUDENT"); //나중에 여기 기본 값으로 ROLE_STUDENT 넣기 수정하기
  const [name, setName] = useState<string>("이름");
  const [id, setId] = useState<string>("학번");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 로컬 스토리지에 있는 json 값 중에 role 값 불러오기
  useEffect(() => {
    const memberData = localStorage.getItem("memberData");
    if (memberData) {
      try {
        const parsedData: UserInfo = JSON.parse(memberData);
        setRole(parsedData.role as UserRole);
        setName(parsedData.name);

        // 학번이 있고 123456789가 아닌 경우에만 정상 표시
        if (
          parsedData.studentNumber &&
          parsedData.studentNumber !== 123456789
        ) {
          setId(parsedData.studentNumber.toString());
        } else {
          // 학번이 없거나 123456789인 경우 특별한 값 설정
          setId("학번 없음");
        }
      } catch (error) {
        console.error("로컬 스토리지 값 안보여짐 에러 :", error);
      }
    }
  }, []);

  const logoutClick = async () => {
    //로그아웃 버튼클릭시
    await postLogout();
    router.push("/login");
  };
  const buttonConfig: ButtonConfig[] = [
    {
      role: ["ROLE_ADMIN", "ROLE_STUDENT", "ROLE_GRADUATE_STUDENT"],
      icon: BiSolidQuoteLeft,
      text: "질문하기",
      route: "/my/question",
    },
    {
      role: ["ROLE_ADMIN", "ROLE_MAJOR_PRESIDENT"],
      icon: FaClipboardUser,
      text: "등급수정하기",
      route: "/my/modifyRole",
    },
    {
      role: ["ROLE_ADMIN", "ROLE_MAJOR_PRESIDENT", "ROLE_STUDENT_COUNCIL"],
      icon: BiSolidQuoteRight,
      text: "답변하기",
      route: "/my/answer",
    },
    {
      role: [
        "ROLE_ADMIN",
        "ROLE_MAJOR_PRESIDENT",
        "ROLE_STUDENT_COUNCIL",
        "ROLE_STUDENT",
        "ROLE_GRADUATE_STUDENT",
      ],
      icon: TbSquaresFilled,
      text: "세미나실\n예약 현황",
      action: "openModal",
    },
    {
      role: [
        "ROLE_ADMIN",
        // "ROLE_STUDENT_COUNCIL",
        "ROLE_STUDENT",
        "ROLE_GRADUATE_STUDENT",
      ],
      icon: FaCheckCircle,
      text: "내가 쓴 글",
      route: "/my/writingCheck",
    },
    {
      role: ["ROLE_ADMIN", "ROLE_STUDENT_COUNCIL"],
      icon: FaClipboardUser,
      text: "등급 신청",
      route: "/setting/applyRating",
    },
  ];

  const filteredButtons = buttonConfig.filter((btn) => btn.role.includes(role));
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const renderButtons = () => {
    if (filteredButtons.length <= 4) {
      return (
        <ButtonRow>
          {filteredButtons.map(({ icon: Icon, text, route, action }, index) => (
            <Button
              key={index}
              onClick={
                action === "openModal" ? openModal : () => router.push(route!)
              }
              total={filteredButtons.length}
            >
              <span>
                <Icon />
              </span>
              {text}
            </Button>
          ))}
        </ButtonRow>
      );
    } else {
      const firstRow = filteredButtons.slice(
        0,
        Math.ceil(filteredButtons.length / 2)
      );
      const secondRow = filteredButtons.slice(
        Math.ceil(filteredButtons.length / 2)
      );

      return (
        <>
          <ButtonRow>
            {firstRow.map(({ icon: Icon, text, route, action }, index) => (
              <Button
                key={index}
                onClick={
                  action === "openModal" ? openModal : () => router.push(route!)
                }
                total={firstRow.length}
              >
                <span>
                  <Icon />
                </span>
                {text}
              </Button>
            ))}
          </ButtonRow>
          <ButtonRow>
            {secondRow.map(({ icon: Icon, text, route, action }, index) => (
              <Button
                key={index}
                onClick={
                  action === "openModal" ? openModal : () => router.push(route!)
                }
                total={secondRow.length}
              >
                <span>
                  <Icon />
                </span>
                {text}
              </Button>
            ))}
          </ButtonRow>
        </>
      );
    }
  };

  return (
    <Container>
      <Header>
        <IconContainer>
          <IconButton onClick={() => router.push("/setting")}>
            <IoSettings />
          </IconButton>
          <IconButton onClick={logoutClick}>
            <FaSignOutAlt />
          </IconButton>
        </IconContainer>
      </Header>

      <ProfileIcon>
        <FaRegAddressCard />
      </ProfileIcon>
      <Role>{roleLabels[role]}</Role>
      <Name>{name}</Name>
      {id === "학번 없음" ? (
        <StatusContainer>
          <AnsAccount>학번이 존재하지 않아요!</AnsAccount>
          <AskManager onClick={() => router.push("/login/first")}>
            학번 넣으러 가기&gt;
          </AskManager>
        </StatusContainer>
      ) : (
        <ID>{id}</ID>
      )}
      <ButtonContainer>{renderButtons()}</ButtonContainer>
      {isModalOpen && (
        <SeminarAlert isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: ${theme.colors.background};
  padding-bottom: 15rem;
`;
const ProfileIcon = styled.div`
  font-size: 3rem;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  position: absolute;
  top: 3rem;
  z-index: 100;
  justify-content: flex-end;
  margin-left: 16rem;
`;
const IconContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconButton = styled.button`
  color: ${theme.colors.mutedText};
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    color: ${theme.colors.primary};
  }
`;
const Role = styled.div`
  font-size: 1.2rem;
  color: ${theme.colors.mutedText};
  margin-bottom: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const ID = styled.div`
  font-size: 1.2rem;
  color: ${theme.colors.mutedText};
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  // gap: 1rem;
  margin: 0rem 3rem;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${theme.colors.primary};
  border-radius: 1rem;
`;

interface ButtonProps {
  total: number;
}

const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding: 0.5rem;
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 1rem;
  width: ${(props) => (props.total <= 3 ? "7rem" : "6rem")};
  height: 5rem;
  font-size: 0.7rem;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 70%;
    background-color: white;
  }

  svg {
    margin-bottom: 0.3rem;
    width: 100%;
    height: 100%;
  }
  span {
    height: 1.5rem;
    width: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.44rem;
  margin: 1rem;
`;
const AnsAccount = styled.div`
  color: ${theme.colors.mutedText};
  font-size: 1rem;
  font-weight: 500;
  font-family: Inter;
`;
const AskManager = styled.div`
  color: ${theme.colors.text};
  font-size: 0.875rem;
  font-weight: 700;
  font-family: Inter;
`;
