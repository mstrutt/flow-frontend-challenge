import { LitElement, html, css } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import { SurveyQuestion } from './survey-question';
import { ScoreModal } from './score-modal';

import { helperStyles } from './css/shared';
import { surveyStyles } from './css/survey';

import './survey-question';
import './score-modal';

const questions = new URL('../../assets/Madrs-s.json', import.meta.url).href;


@customElement('flow-survey')
export class FlowSurvey extends LitElement {
  @property({ type: Array }) answers = [] as number[];
  @property({ type: Array }) questions = [] as Question[];
  scoreModal?: ScoreModal | null;
  questionComponenets?: NodeListOf<SurveyQuestion>;

  static styles = [
    helperStyles,
    surveyStyles,
  ];

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

  protected firstUpdated() {
    this.scoreModal = this.shadowRoot?.querySelector('score-modal');
  }
  
  private _updateVerdict() {
    this.scoreModal?.updateVerdict();
  }

  @eventOptions({ passive: true })
  private _resetForm() {
    this.questionComponenets?.forEach((component, index) => {
      component.resetInput();
      // Focus the first question
      if (!index) {
        component.giveFocus();
      }
    });
    this.answers = new Array(this.questions.length);
  }

  @eventOptions({ passive: true })
  private _onQuestionAnswered(event: QuestionAnsweredEvent) {
    const { answer, number } = event.detail;
    if (typeof answer !== 'number' || typeof number !== 'number') {
      return;
    }

    this.answers[number] = answer;
    this._updateVerdict();

    // If the focus has already left the question, don't adjust the focus or scroll
    const thisQuestion = this.questionComponenets && this.questionComponenets[number];
    if (!thisQuestion || !thisQuestion.matches(':focus-within')) {
      return false;
    }

    // Focus and scroll smoothly to the next question
    const nextQuestion = this.questionComponenets && this.questionComponenets[number + 1];
    if (nextQuestion) {
      // Get the current scroll coordinates
      const x = window.scrollX
      const y = window.scrollY;
      // Shift the focus
      nextQuestion.giveFocus();
      // Reset scroll position to avoid the visual jump of moving focus
      window.scrollTo(x, y);
      // Smoothly scroll to the next question
      nextQuestion.parentElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected render() {
    return html`
      <main>
        <h1 class="fs-h-visually-hidden">Flow Survey</h1>

        <form class="fs-form" id="flow-survey" @question-answered=${this._onQuestionAnswered}>
          ${this.questions.map((question, number) => html`
            <section class="fs-form__section" id="question-${number + 1}">
              <h2 class="fs-progress-header fs-t-large-heading">Question ${number + 1}/${this.questions.length}</h2>
              <survey-question .question=${question} .number=${number}></survey-question>
            </section>
          `)}
        </form>
        <score-modal @reset=${this._resetForm} .answers=${this.answers}></score-modal>
      </main>
    `;
  }
}
