export type Operation = '+' | '-' | '*' | '/' | null;

export interface CalculationHistory {
	id: string;
	expression: string;
	result: string;
	timestamp: number;
}
