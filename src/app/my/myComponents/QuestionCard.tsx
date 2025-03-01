"use client";
import React from "react";
import styled from "styled-components";
import { theme } from "@/app/styles/theme";
import { useSwipeable } from "react-swipeable";
import { RiDeleteBin6Fill } from "react-icons/ri";
import CustomRow from "@/components/CustomRow";

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    date: string;
    isAnswered: boolean;
  };
  index: number;
  onDelete: (id: number) => void;
  onCardClick: (id: number, isAnswered: boolean) => void;
  canDelete?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onDelete,
  onCardClick,
  canDelete,
}) => {
  const [isSwiped, setIsSwiped] = React.useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSwiped(true),
    onSwipedRight: () => setIsSwiped(false),
    // 삭제 권한이 없는 경우 스와이프 기능 자체를 비활성화
    trackMouse: canDelete,
    trackTouch: canDelete,
  });

  const handleCardClick = () => {
    onCardClick(question.id, question.isAnswered);
  };

  return (
    <Card {...handlers} onClick={handleCardClick}>
      <CustomRow>
        <ContentWrapper $isSwiped={isSwiped}>
          <QuestionWrapper>
            <NumberCircle>{index + 1}</NumberCircle>
            <QuestionInfo>
              <QuestionTitle>
                {question.title.length > 17
                  ? `${question.title.substring(0, 13)}...`
                  : question.title}
              </QuestionTitle>
              <QuestionDate>{question.date}</QuestionDate>
            </QuestionInfo>
          </QuestionWrapper>
          <AnswerStatus $isAnswered={question.isAnswered}>
            {question.isAnswered ? "답변완료" : "답변예정"}
          </AnswerStatus>
        </ContentWrapper>

        {canDelete && (
          <DeleteButton
            $isSwiped={isSwiped}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question.id);
            }}
          >
            <RiDeleteBin6Fill />
          </DeleteButton>
        )}
      </CustomRow>
    </Card>
  );
};

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-bottom: 1px solid ${theme.colors.mutedText};
  background-color: white;
  overflow: hidden;
  cursor: pointer;
`;

const ContentWrapper = styled.div<{ $isSwiped: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  transition: transform 0.3s ease;
  padding-right: 1rem;
  transform: ${({ $isSwiped }) =>
    $isSwiped ? "translateX(-3rem)" : "translateX(0)"};
  justify-content: space-between;
`;

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NumberCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${theme.button.secondary.background};
  color: ${theme.button.secondary.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  margin-right: 15px;
`;

const QuestionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuestionDate = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.mutedText};
`;

const AnswerStatus = styled.span<{ $isAnswered: boolean }>`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${({ $isAnswered }) =>
    $isAnswered ? theme.colors.success : theme.colors.warning};
`;

const DeleteButton = styled.button<{ $isSwiped: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.danger};
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  opacity: ${({ $isSwiped }) => ($isSwiped ? 1 : 0)};
  pointer-events: ${({ $isSwiped }) => ($isSwiped ? "auto" : "none")};
  transition: opacity 0.3s ease;
`;

export default QuestionCard;
