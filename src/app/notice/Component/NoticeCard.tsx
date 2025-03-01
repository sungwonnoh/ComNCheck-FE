"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/app/styles/theme";
import { useRouter } from "next/navigation";
import { majorEventItem } from "@/apis/notice.type";
import { useSwipeable } from "react-swipeable";
import { RiDeleteBin6Fill } from "react-icons/ri";
import CustomRow from "@/components/CustomRow";

interface NoticeCardProps {
  notice: majorEventItem & {
    dDay: string;
  };
  onDelete?: (id: number) => void;
  canDelete: boolean;
}

const NoticeCard = ({ notice, onDelete, canDelete }: NoticeCardProps) => {
  const router = useRouter();
  const [isSwiped, setIsSwiped] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => canDelete && setIsSwiped(true),
    onSwipedRight: () => canDelete && setIsSwiped(false),
    trackMouse: canDelete,
    trackTouch: canDelete,
  });

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notice.googleFormLink) {
      window.open(notice.googleFormLink, "_blank");
    } else {
      alert("구글폼 링크가 존재하지 않습니다.");
    }
  };

  const handleCardClick = () => {
    router.push(`/notice/event/detail?id=${notice.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm("삭제하시겠습니까?")) {
      onDelete(notice.id);
    }
  };

  return (
    <Card {...handlers} onClick={handleCardClick}>
      <CustomRow>
        <ContentWrapper $isSwiped={canDelete && isSwiped}>
          <Info>
            <Title>{notice.eventName}</Title>
            <Date>{notice.date}</Date>
          </Info>
          <SmallContainer>
            <DDay>{notice.dDay}</DDay>
            <ApplyButton onClick={handleApplyClick}>구글폼 신청</ApplyButton>
          </SmallContainer>
        </ContentWrapper>

        {canDelete && (
          <DeleteButton $isSwiped={isSwiped} onClick={handleDelete}>
            <RiDeleteBin6Fill />
          </DeleteButton>
        )}
      </CustomRow>
    </Card>
  );
};

const Card = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${theme.colors.mutedText};
  background-color: white;
  overflow: hidden;
  cursor: pointer;
  padding: 15px 0;
`;

const ContentWrapper = styled.div<{ $isSwiped: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  padding: 0 1rem;
  transition: transform 0.3s ease;
  transform: ${({ $isSwiped }) =>
    $isSwiped ? "translateX(-3rem)" : "translateX(0)"};
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

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.mutedText};
`;

const DDay = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const ApplyButton = styled.button`
  background-color: white;
  border: 1px solid ${theme.colors.mutedText};
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }
`;

const SmallContainer = styled.div`
  display: flex;
  flex-direction: table-row;
  align-items: center;
  gap: 1rem;
`;

export default NoticeCard;
