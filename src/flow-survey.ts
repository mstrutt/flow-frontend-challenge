import { LitElement, html, css } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import { SurveyQuestion } from './survey-question';
import { ScoreModal } from './score-modal';

import './survey-question';
import './score-modal';

const questions = new URL('../../assets/Madrs-s.json', import.meta.url).href;


@customElement('flow-survey')
export class FlowSurvey extends LitElement {
  @property({ type: Array }) answers = [] as number[];
  @property({ type: Array }) questions = [] as Question[];
  scoreModal?: ScoreModal | null;
  questionComponenets?: NodeListOf<SurveyQuestion>;

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
  `;

  async connectedCallback() {
    super.connectedCallback();
    
    const questionData: Question[] = await fetch(questions)
      .then(response => response.json());
    this.questions = questionData;

    this.answers = new Array(this.questions.length);

    this.scoreModal?.updateVerdict();

    // Wait for the questions to be rendered
    await this.updateComplete;
    this.questionComponenets = this.shadowRoot?.querySelectorAll('survey-question');
  }

  firstUpdated() {
    this.scoreModal = this.shadowRoot?.querySelector('score-modal');
  }
  
  private _updateVerdict() {
    this.scoreModal?.updateVerdict();
  }

  @eventOptions({ passive: true })
  private _resetForm() {
    this.questionComponenets?.forEach(component => component.resetInput());
  }

  @eventOptions({ passive: true })
  private _onQuestionAnswered(event: QuestionAnsweredEvent) {
    const { answer, number } = event.detail;
    if (typeof answer === 'number' && typeof number === 'number') {
      this.answers[number] = answer;
    }

    this._updateVerdict();
  }

  protected render() {
    return html`
      <main>
        <h1>Flow Survey</h1>

        There are ${this.questions.length} questions.

        <form id="flow-survey" @question-answered=${this._onQuestionAnswered}>
          ${this.questions.map((question, number) => html`
            <h2 class="fs-progress-header">Question ${number + 1}/${this.questions.length}</h2>
            <survey-question .question=${question} .number=${number}></survey-question>
          `)}
        </form>
        <score-modal @reset=${this._resetForm} .answers=${this.answers}></score-modal>
      </main>
    `;
  }
}
