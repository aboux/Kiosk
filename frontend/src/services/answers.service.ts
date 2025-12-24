import { baseApi } from "./baseApi";
import type {
  CreateAnswersDto,
  SaveAnswersResponseDto,
} from "@/types/api-types";

export const answersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveAnswers: builder.mutation<
      SaveAnswersResponseDto,
      Record<string, string | number | null>
    >({
      query: (answers) => {
        const answersArray: CreateAnswersDto[] = Object.entries(answers).map(
          ([questionId, value]) => ({
            questionId: Number(questionId),
            answer: String(value ?? ""),
          })
        );

        return {
          url: "/v1/answers",
          method: "POST",
          body: answersArray,
        };
      },
      invalidatesTags: ["Answers"],
    }),
  }),
  overrideExisting: false,
});

export const { useSaveAnswersMutation } = answersApi;
