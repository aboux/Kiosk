import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { QuestionForm } from "./QuestionForm";
import { mockQuestions } from "@/test/mockData";

// Mock du toast
const mockToast = vi.fn();
vi.mock("../ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock des hooks
vi.mock("@/store/slices/questions/questionsHooks", () => ({
  useQuestions: vi.fn(),
}));

vi.mock("@/store/slices/answers/answersHooks", () => ({
  useAnswers: vi.fn(),
}));

// Mock du composant QuestionNode
vi.mock("./QuestionNode", () => ({
  QuestionNode: ({ question }: any) => (
    <div data-testid={`question-${question.id}`}>
      Question: {question.label}
    </div>
  ),
}));

import { useQuestions } from "@/store/slices/questions/questionsHooks";
import { useAnswers } from "@/store/slices/answers/answersHooks";

describe("QuestionForm", () => {
  const mockSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un loader pendant le chargement", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: undefined,
      isLoading: true,
      isSuccess: false,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: false,
      isSaved: false,
      isFailed: false,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    const { container } = renderWithProviders(<QuestionForm />);

    // Cherche le loader avec la classe animate-spin
    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("affiche toutes les questions chargées", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: false,
      isSaved: false,
      isFailed: false,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    renderWithProviders(<QuestionForm />);

    // Vérifie que chaque question est rendue
    mockQuestions.forEach((question) => {
      expect(screen.getByTestId(`question-${question.id}`)).toBeInTheDocument();
    });
  });

  it("affiche le bouton de soumission", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: false,
      isSaved: false,
      isFailed: false,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    renderWithProviders(<QuestionForm />);

    expect(
      screen.getByRole("button", { name: /save answers/i })
    ).toBeInTheDocument();
  });

  it("désactive le bouton pendant la sauvegarde", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: true,
      isSaved: false,
      isFailed: false,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    renderWithProviders(<QuestionForm />);

    const submitButton = screen.getByRole("button", { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it("affiche un message de succès après sauvegarde", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: false,
      isSaved: true,
      isFailed: false,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    renderWithProviders(<QuestionForm />);

    // Utilise getAllByText car il y a plusieurs éléments avec "success"
    const successElements = screen.getAllByText(/success/i);
    expect(successElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", () => {
    vi.mocked(useQuestions).mockReturnValue({
      questions: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      language: "fr" as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    });

    vi.mocked(useAnswers).mockReturnValue({
      answers: {},
      isSaving: false,
      isSaved: false,
      isFailed: true,
      updateAnswer: vi.fn(),
      save: mockSave,
      clear: vi.fn(),
    });

    renderWithProviders(<QuestionForm />);

    expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
  });
});
