"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import TitleContainer from "@/components/setting/TitleContainer";
import { getFAQ } from "@/apis/question";
import { AllFAQQuestionResponse } from "@/apis/question.type";
import FAQQuestionList from "../my/myComponents/FAQQuestionList";

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

export default function FAQ() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AllFAQQuestionResponse[]>([]);
  const [role, setRole] = useState<UserRole | undefined>(undefined); // 초기값을 undefined로
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const memberData = localStorage.getItem("memberData");
    if (memberData) {
      try {
        const parsedData: UserInfo = JSON.parse(memberData);
        setRole(parsedData.role as UserRole);
        const allowedRoles: UserRole[] = [
          "ROLE_ADMIN",
          "ROLE_MAJOR_PRESIDENT",
          "ROLE_STUDENT_COUNCIL",
        ];
        setCanDelete(allowedRoles.includes(parsedData.role));
      } catch (error) {
        console.error("로컬 스토리지 값 안보여짐 에러 :", error);
      }
    } else {
      setRole("ROLE_STUDENT"); // 기본값 설정
    }
  }, []);

  useEffect(() => {
    if (role) {
      fetchFAQ();
    }
  }, [role]); // role 값이 설정된 후에 fetchFAQ 실행

  const fetchFAQ = async () => {
    try {
      const faqData = await getFAQ();
      console.log("API 데이터:", faqData);
      setQuestions(faqData);
    } catch (error) {
      console.error("FAQ 데이터 가져오기 실패:", error);
    }
  };

  const handleCardClick = (id: number, isAnswered: boolean) => {
    if (isAnswered) {
      router.push(`/faq/check?id=${id}`);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("삭제하시겠습니까?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  if (!role) return <p>Loading...</p>; // role이 undefined면 로딩 표시

  return (
    <ContainerWrapper>
      <TitleContainer
        title="컴퓨터공학부 FAQ"
        description={
          <>
            답변 완료된 질문들이에요
            <br />
            질문을 눌러 답변을 확인해보세요!
          </>
        }
      />
      <FAQQuestionList
        questions={questions.map((q) => ({
          id: q.id,
          title: q.title,
          date: new Date(q.createdAt).toLocaleDateString("ko-KR"),
          answer: q.answer?.content || "",
          isAnswered: !!q.answer?.content,
        }))}
        onDelete={handleDelete}
        onCardClick={handleCardClick}
        canDelete={canDelete}
      />
    </ContainerWrapper>
  );
}
