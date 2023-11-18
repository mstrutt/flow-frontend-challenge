export interface Question {
  paragraph?: string,
  question: string,
  responses: string[],
  title: string,
}

export interface QuestionAnsweredEvent extends CustomEvent {
  detail: {
    answer: number,
    number: number,
  }
}
