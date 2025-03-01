import React from "react";
import QuestionCard from "./QuestionCard";
import ContainerWrapper from "@/components/container/ContainerWrapper";
import FormWrapper from "@/components/container/FormWrapper";

interface Question {
  id: number;
  title: string;
  date: string;
  answer: string;
  isAnswered: boolean;
}

interface CommonQuestionListProps {
  questions: Question[];
  onDelete: (id: number) => void;
  onCardClick: (id: number, isAnswered: boolean) => void;
  canDelete: boolean;
}

const FAQQuestionList: React.FC<CommonQuestionListProps> = ({
  questions,
  onDelete,
  onCardClick,
  canDelete,
}) => {
  return (
    <ContainerWrapper>
      <FormWrapper>
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onDelete={onDelete}
            onCardClick={onCardClick}
            canDelete={canDelete}
          />
        ))}
      </FormWrapper>
    </ContainerWrapper>
  );
};

export default FAQQuestionList;
