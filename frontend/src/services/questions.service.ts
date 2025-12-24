import { baseApi } from "./baseApi";
import { LocaleEnum, QuestionEntity } from "@/types/api-types";

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<QuestionEntity[], LocaleEnum>({
      query: (locale) => ({
        url: "/v1/questions",
        params: { locale },
      }),
      providesTags: ["Questions"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetQuestionsQuery } = questionsApi;
