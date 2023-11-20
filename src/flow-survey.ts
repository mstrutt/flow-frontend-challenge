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
      align-items: stretch;
      display: flex;
      flex-direction: column;
      font-size: 16px;
      justify-content: flex-start;
      min-height: 100vh;
    }

    @media screen and (min-width: 420px) and (max-width: 999px) {
      :host {
        font-size: calc(14px + 1vw);
      }
    }

    @media screen and (min-width: 1000px) {
      :host {
        font-size: 24px;
      }
    }

    .fs-progress-header {
      font-size: var(--small-heading);
      margin: 2em 0;
      text-align: center;
    }

    .fs-score-modal {
      background-color: var(--body-background);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      text-align: center;
    }

    .fs-score-modal__header {
      background-image: radial-gradient(var(--dark-blue), var(--dark-blue) 70%, transparent 70%);
      background-position: 50% 99%;
      background-size: calc(250% - 65vw) 150%;
      color: var(--white);
      padding: calc(var(--spacing-unit) + 16.87vh) calc(var(--spacing-unit) * 3) 4.25em;
    }

    .fs-score-modal__title {
      font-size: var(--large-heading);
      font-weight: var(--font-weight--normal);
      margin: 0;
    }

    .fs-score-modal__points {
      font-size: var(--extra-large-heading);
      margin: 0.15em 0;
    }

    .fs-score-modal__out-of {
      color: var(--white--faded);
    }

    .fs-score-modal__verdict {
      margin: 0.8em 0 0;
    }

    .fs-score-modal__body {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      margin: 0 auto;
      max-width: 24em;
      padding: calc(var(--spacing-unit) * 2) var(--spacing-unit);
    }

    .fs-score-modal__subtitle {
      font-size: var(--large-paragraph);
      font-weight: var(--font-weight--bold);
      margin: 0;
    }

    .fs-score-modal__explanation {
      font-size: var(--large-paragraph);
      margin: .4em 0;
    }

    .fs-score-modal__disclaimer {
      color: var(--mid-grey);
      margin: .8em 0 calc(var(--spacing-unit) * 2);
    }

    .fs-button {
      border: none;
      border-radius: calc(var(--tap-target-size) / 2);
      font-size: inherit;
      font-weight: var(--font-weight--bold);
      height: calc(var(--tap-target-size) + 2px);
      line-height: calc(var(--tap-target-size) + 2px);
      max-width: 21em;
      padding: 0;
    }

    .fs-button--primary {
      background-color: var(--dark-green);
      color: var(--white);
    }

    .fs-score-modal__close {
      margin: auto auto 0.25em;
      width: 97%;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    
    const questionData: Question[] = await fetch(questions)
      .then(response => response.json());
    this.questions = questionData;

    this.answers = new Array(this.questions.length);

    this.maxPoints = MAX_POINTS_PER_QUESTION * this.questions.length;

    this.updateVerdict();
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
            <h2 class="fs-progress-header">Question ${number + 1}/${this.questions.length}</h2>
            <survey-question .question=${question} .number=${number}></survey-question>
          `)}
        </form>
        <div class="fs-score-modal">
          <div class="fs-score-modal__header">
            <h2 class="fs-score-modal__title">Your score</h2>
            <p class="fs-score-modal__points">${this.totalPoints}<span class="fs-score-modal__out-of">/${this.maxPoints}</span></p>
            <p class="fs-score-modal__verdict">${this.verdict}</p>
          </div>
          <div class="fs-score-modal__body">
            <h3 class="fs-score-modal__subtitle">What does this mean?</h3>
            <p class="fs-score-modal__explanation">This score indicates that you have ${this.verdict.toLowerCase()} symptoms</p>
            <p class="fs-score-modal__disclaimer">Remember that this questionaire is not a complete diagnosis, but rather a guideliens.</p>
            <button class="fs-button fs-button--primary fs-score-modal__close type="reset" form="flow-survey">Close</button>
          </div>
        </div>
      </main>
    `;
  }
}
