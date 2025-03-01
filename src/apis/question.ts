import instance from "./instance";
import {
  QuestionRequest,
  AllQuestionResponse,
  AllFAQQuestionResponse,
} from "./question.type";

// MY - 질문하기 post
export const postQuestion = async (data: QuestionRequest): Promise<void> => {
  try {
    await instance.post("/api/v1/major/questions", data);
  } catch (error) {
    console.error("MY - 질문하기 post API 요청 실패:", error);
    throw error;
  }
};

// MY - 내가 쓴글 조회
export const getQuestion = async (): Promise<AllQuestionResponse[]> => {
  try {
    const response = await instance.get<AllQuestionResponse[]>(
      "/api/v1/major/questions/my"
    );
    return response.data;
  } catch (error) {
    console.error("MY - 내가 쓴글 조회 API 요청 실패:", error);
    throw error;
  }
};
// MY - 내가 쓴글 특정 조회
export const getQuestionById = async (
  majorQuestionId: number
): Promise<AllQuestionResponse> => {
  try {
    const response = await instance.get<AllQuestionResponse>(
      `/api/v1/major/questions/${majorQuestionId}`
    );
    return response.data;
  } catch (error) {
    console.error("MY - 내가 쓴글 특정 조회 API 요청 실패:", error);
    throw error;
  }
};

//MY - 내가쓴글 답변완료일 경우, 삭제가능
export const deleteQuestion = async (
  majorQuestionId: number
): Promise<void> => {
  try {
    const response = await instance.delete(
      `/api/v1/major/questions/${majorQuestionId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//MY - 내가 쓴글 내가쓴글 답변완료일 경우, 확인 가능
export const putQuestion = async (
  majorQuestionId: number,
  shared: boolean,
  title: string,
  content: string
): Promise<void> => {
  try {
    const response = await instance.put(
      `/api/v1/major/questions/${majorQuestionId}`,
      { shared, title, content }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// MY - 내가 쓴글 답변예정일 경우, 수정 가능
export const UpdateQuestion = async (
  majorQuestionId: number,
  shared: boolean,
  title: string,
  content: string
): Promise<void> => {
  try {
    const response = await instance.put(
      `/api/v1/major/questions/${majorQuestionId}`,
      { shared, title, content }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// MY - 답변하기 모든 질문 list 불러오기 학생회,과회장 권한
export const getQuestionAllList = async (): Promise<AllQuestionResponse[]> => {
  try {
    const response = await instance.get<AllQuestionResponse[]>(
      `/api/v1/major/questions/all`
    );

    console.log(
      "MY - 답변하기 모든 질문 list 불러오기 학생회,과회장 권한 get API 요청 값:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      "MY - 답변하기 모든 질문 list 불러오기 학생회,과회장 권한 get API 요청 실패:",
      error
    );
    throw error;
  }
};

// FAQ - 답변 가져오기 get
export const getFAQ = async (): Promise<AllFAQQuestionResponse[]> => {
  console.log("getFAQ 함수 실행됨");

  try {
    console.log("API 요청 시작...");
    const response = await instance.get<AllFAQQuestionResponse[]>(
      "/api/v1/major/questions"
    );
    console.log("API 응답 받음:", response.data);
    return response.data;
  } catch (error) {
    console.error("FAQ API 요청 실패:", error);
    throw error;
  }
};
