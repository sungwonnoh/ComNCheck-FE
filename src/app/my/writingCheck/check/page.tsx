"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/app/styles/theme";
import { BiSolidToggleRight, BiToggleLeft } from "react-icons/bi";
import { useRouter, useSearchParams } from "next/navigation";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import TitleContainer from "@/components/setting/TitleContainer";
import ContentBoxSmall from "@/components/container/ContentBoxSmall";
import { getQuestion, putQuestion } from "@/apis/question";
import { AllQuestionResponse } from "@/apis/question.type";

export default function Check() {
  const [shared, setShared] = useState(true);
  const [question, setQuestion] = useState<AllQuestionResponse | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchQuestion(parseInt(id));
    }
  }, [id]);

  const fetchQuestion = async (questionId: number) => {
    try {
      const fetchedQuestions = await getQuestion();

      const formattedQuestions = fetchedQuestions.map((q) => ({
        ...q,
        answer: q.answer ? [q.answer] : null,
      })) as AllQuestionResponse[];

      console.log("변환된 질문 목록:", formattedQuestions);

      const currentQuestion = formattedQuestions.find(
        (q) => q.id === questionId
      );
      if (currentQuestion) {
        setQuestion(currentQuestion);
        setShared(currentQuestion.shared);
      } else {
        console.error("질문을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("질문 불러오기 실패:", error);
    }
  };

  const toggleHandler = () => {
    setShared(!shared);
  };

  const handleSubmit = async () => {
    if (!question) {
      alert("질문 정보를 불러오지 못했습니다.");
      return;
    }
    try {
      await putQuestion(
        question.id,
        shared,
        question?.title,
        question?.content
      );
      alert("공유 상태가 업데이트되었습니다.");
      router.back();
    } catch (error) {
      console.error("공유 상태 업데이트 실패:", error);
      alert("공유 상태 업데이트에 실패했습니다.");
    }
  };

  return (
    <ContainerWrapper>
      <TitleContainer
        title="내가 쓴 글 확인하기"
        description={
          <>
            내가 작성한 질문들을 한눈에 모아봤어요.
            <br />
            답변이 완료된 질문을 수정할 수 없어요.
          </>
        }
      />
      <ContentWrapper>
        <ContentBoxSmall>
          <LabelWrapper>
            <Label htmlFor="title">제목</Label>
            <ToggleWrapper onClick={toggleHandler}>
              {shared ? (
                <BiSolidToggleRight size={30} color={theme.colors.primary} />
              ) : (
                <BiToggleLeft size={30} color={theme.colors.mutedText} />
              )}
            </ToggleWrapper>
          </LabelWrapper>
          <ContentTitle>{question?.title ?? "로딩 중..."}</ContentTitle>
          <Label htmlFor="question">궁금한 점</Label>
          <ContentDetail id="question">
            {question?.content ?? "로딩 중..."}
          </ContentDetail>
        </ContentBoxSmall>
        <ContentBoxSmall>
          <LabelWrapper>
            <Label htmlFor="title">답변</Label>
          </LabelWrapper>
          <ContentAnswer id="question">
            {question?.answer?.length
              ? question.answer[0].content
              : "아직 답변이 없습니다."}
          </ContentAnswer>
          <ButtonWapper>
            <SubmitButton type="button" onClick={handleSubmit}>
              확인
            </SubmitButton>
          </ButtonWapper>
        </ContentBoxSmall>
      </ContentWrapper>
    </ContainerWrapper>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.text};
  font-family: "Pretendard", sans-serif;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
`;

const ContentTitle = styled.div`
  width: 100%;
  margin: 8px 0px 16px 0px;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.mutedText};
  border-radius: 7px;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  font-family: "Pretendard", sans-serif;
`;
const ContentDetail = styled.div`
  width: 100%;
  height: 5rem;
  margin: 8px 0px;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.mutedText};
  border-radius: 7px;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  resize: none;
  font-family: "Pretendard", sans-serif;
  &:focus {
    outline: none;
    border-color: ${theme.button.primary.background};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
  &:focus {
    height: 150px;
  }
`;
const ContentAnswer = styled.div`
  width: 100%;
  height: 8rem;
  margin: 8px 0px;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.mutedText};
  border-radius: 7px;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  resize: none;
  font-family: "Pretendard", sans-serif;
  &:focus {
    outline: none;
    border-color: ${theme.button.primary.background};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;
const ButtonWapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  display: flex;
  padding: 10px 16px;
  background-color: ${theme.button.submit.background};
  color: ${theme.button.submit.text};
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;
