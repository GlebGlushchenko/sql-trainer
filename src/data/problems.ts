import { ADVANCED_PROBLEMS } from './problems-advanced';
import { BASIC_PROBLEMS } from './problems-basic';
import type { Problem } from './types';

export const PROBLEMS: Problem[] = [...BASIC_PROBLEMS, ...ADVANCED_PROBLEMS].map((p, i) => ({ ...p, id: i + 1 }));

export const TOPICS: string[] = Array.from(new Set(PROBLEMS.map((p) => p.topic)));

export const getProblem = (id: number) => PROBLEMS.find((p) => p.id === id);
