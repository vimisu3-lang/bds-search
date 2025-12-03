export interface QnA {
  id: number;
  question: string;
  answer: string;
}

export interface SearchState {
  query: string;
  results: QnA[];
}