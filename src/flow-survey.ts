import { LitElement, html, css } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import { MAX_POINTS_PER_QUESTION, SCORING_RULES } from './constants';

import './survey-question';

const questions = new URL('../../assets/Madrs-s.json', import.meta.url).href;


@customElement('flow-survey')
export class FlowSurvey extends LitElement {
  @property({ type: Object }) answers = [] as number[];
  @property({ type: String }) header = 'Flow Survey';
  @property({ type: Number }) maxPoints: number = 0;
  @property({ type: Object }) questions = [] as Question[];
  @property({ type: Number }) totalPoints: number = 0;
  @property({ type: String }) verdict: string = '';

  static styles = css`
    :host {
      align-items: center;
      background-color: var(--flow-survey-background-color);
      color: #1a2b42;
      display: flex;
      flex-direction: column;
      font-size: calc(10px + 2vmin);
      justify-content: flex-start;
      margin: 0 auto;
      max-width: 960px;
      min-height: 100vh;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    
    const questionData: Question[] = await fetch(questions)
      .then(response => response.json());
    this.questions = questionData;

    this.answers = new Array(this.questions.length);

    this.maxPoints = MAX_POINTS_PER_QUESTION * this.questions.length;
  }

  updateVerdict() {
    this.totalPoints = this.answers.reduce((a, b) => a + b, 0);
    this.verdict = SCORING_RULES.find(rule =>
      this.totalPoints >= rule.lower && this.totalPoints <= rule.upper
    )?.verdict || '';
  }

  @eventOptions({ passive: true })
  private _onQuestionAnswered(event: QuestionAnsweredEvent) {
    const { answer, number } = event.detail;
    if (typeof answer === 'number' && typeof number === 'number') {
      this.answers[number] = answer;
    }

    this.updateVerdict();
  }

  protected render() {
    return html`
      <main>
        <h1>${this.header}</h1>

        There are ${this.questions.length} questions.

        <form id="flow-survey" @question-answered=${this._onQuestionAnswered}>
          ${this.questions.map((question, number) => html`
            <h2>Question ${number + 1}/${this.questions.length}</h2>
            <survey-question .question=${question} .number=${number}></survey-question>
          `)}
        </form>
        <div>
          <h2>Your score</h2>
          <p><span>${this.totalPoints}</span>/${this.maxPoints}</p>
          <p>${this.verdict}</p>
          <h3>What does this mean?</h3>
          <p>This score indicates that you have ${this.verdict.toLowerCase()} symptoms</p>
          <p>Remember that this questionaire is not a complete diagnosis, but rather a guideliens.</p>
          <button type="reset" form="flow-survey">Close</button>
        </div>
      </main>
    `;
  }
}
