export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  topic: string;
  /** Поддерживается `код` в обратных кавычках и переносы строк */
  description: string;
  hints: string[];
  solution: string;
  /** Порядок строк важен при проверке */
  ordered?: boolean;
  /** Запрос, результат которого сравнивается после выполнения решения (для INSERT/UPDATE/DELETE/DDL) */
  check?: string;
}

export type ProblemInput = Omit<Problem, 'id'>;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
};
