// Decision tree engine for onboarding questionnaires

export interface QuestionOption {
  value: string;
  label: string;
  triggers?: string[];
}

export interface ShowCondition {
  question_id: string;
  operator: 'includes' | 'excludes' | 'equals';
  value: string | string[];
}

export interface OnboardingQuestion {
  id: string;
  category: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  allow_other?: boolean;
  show_when?: ShowCondition | null;
}

export interface OnboardingResponse {
  question_id: string;
  selected: string[];
  other_text?: string;
}

function evaluateCondition(
  condition: ShowCondition,
  responses: Map<string, OnboardingResponse>
): boolean {
  const response = responses.get(condition.question_id);
  if (!response) return false;

  const selected = response.selected;
  const condValue = condition.value;

  switch (condition.operator) {
    case 'includes': {
      if (Array.isArray(condValue)) {
        return condValue.some((v) => selected.includes(v));
      }
      return selected.includes(condValue);
    }
    case 'excludes': {
      if (Array.isArray(condValue)) {
        return !condValue.some((v) => selected.includes(v));
      }
      return !selected.includes(condValue);
    }
    case 'equals': {
      if (Array.isArray(condValue)) {
        return selected.length === condValue.length && condValue.every((v) => selected.includes(v));
      }
      return selected.length === 1 && selected[0] === condValue;
    }
    default:
      return false;
  }
}

export function getVisibleQuestions(
  allQuestions: OnboardingQuestion[],
  responses: Map<string, OnboardingResponse>
): OnboardingQuestion[] {
  return allQuestions.filter((q) => {
    if (!q.show_when) return true;
    return evaluateCondition(q.show_when, responses);
  });
}

export function allQuestionsAnswered(
  allQuestions: OnboardingQuestion[],
  responses: Map<string, OnboardingResponse>
): boolean {
  const visible = getVisibleQuestions(allQuestions, responses);
  return visible.every((q) => {
    const r = responses.get(q.id);
    return r && (r.selected.length > 0 || (r.other_text && r.other_text.length > 0));
  });
}
