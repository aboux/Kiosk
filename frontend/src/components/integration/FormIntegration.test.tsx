import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { QuestionForm } from "../question/QuestionForm";
import { QuestionEntityContentEnum } from "@/types/api-types";

// Mock des services
vi.mock("@/services/answers.service", () => ({
  useSaveAnswersMutation: () => [
    vi
      .fn()
      .mockResolvedValue({
        unwrap: () => Promise.resolve({ message: "Success" }),
      }),
    { isLoading: false, isSuccess: false, isError: false },
  ],
}));

vi.mock("@/services/questions.service", () => ({
  useGetQuestionsQuery: vi.fn(),
}));

import { useGetQuestionsQuery } from "@/services/questions.service";

describe("Form Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("conserve les réponses lors de la modification", async () => {
    const user = userEvent.setup();

    const testQuestions = [
      {
        id: 1,
        label: "Enter a number",
        content: QuestionEntityContentEnum.NUMBER,
        order: 0,
        unit: null as any,
        enumValues: [],
        children: [],
      },
    ];

    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: testQuestions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    const { store } = renderWithProviders(<QuestionForm />);

    // Saisit une première valeur
    const input = screen.getByPlaceholderText(/enter a number/i);
    await user.type(input, "10");

    expect(store.getState().answers.values["1"]).toBe(10);

    // Modifie la valeur
    await user.clear(input);
    await user.type(input, "20");

    expect(store.getState().answers.values["1"]).toBe(20);
  });

  it("gère plusieurs questions du même type", async () => {
    const user = userEvent.setup();

    const testQuestions = [
      {
        id: 1,
        label: "Question 1",
        content: QuestionEntityContentEnum.TEXT,
        order: 0,
        unit: null as any,
        enumValues: [],
        children: [],
      },
      {
        id: 2,
        label: "Question 2",
        content: QuestionEntityContentEnum.TEXT,
        order: 1,
        unit: null as any,
        enumValues: [],
        children: [],
      },
      {
        id: 3,
        label: "Question 3",
        content: QuestionEntityContentEnum.TEXT,
        order: 2,
        unit: null as any,
        enumValues: [],
        children: [],
      },
    ];

    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: testQuestions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    const { store } = renderWithProviders(<QuestionForm />);

    // Récupère tous les textarea
    const textareas = screen.getAllByPlaceholderText(/enter text/i);
    expect(textareas).toHaveLength(3);

    // Remplit chaque textarea
    await user.type(textareas[0], "Answer 1");
    await user.type(textareas[1], "Answer 2");
    await user.type(textareas[2], "Answer 3");

    // Vérifie que toutes les réponses sont enregistrées
    const state = store.getState();
    expect(state.answers.values["1"]).toBe("Answer 1");
    expect(state.answers.values["2"]).toBe("Answer 2");
    expect(state.answers.values["3"]).toBe("Answer 3");
  });

  it("affiche le formulaire vide initialement", () => {
    const testQuestions = [
      {
        id: 1,
        label: "Test Question",
        content: QuestionEntityContentEnum.TEXT,
        order: 0,
        unit: null as any,
        enumValues: [],
        children: [],
      },
    ];

    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: testQuestions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
    } as any);

    const { store } = renderWithProviders(<QuestionForm />);

    // Vérifie que le store est vide
    const state = store.getState();
    expect(Object.keys(state.answers.values)).toHaveLength(0);

    // Vérifie que l'input est vide
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toHaveValue("");
  });
});
