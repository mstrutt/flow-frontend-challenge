import { LitElement, html } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import type { SurveyQuestion } from './survey-question';
import type { ScoreModal } from './score-modal';

import { helperStyles } from './css/shared';
import { surveyStyles } from './css/survey';

import './survey-question';
import './score-modal';

const questions = new URL('../../assets/Madrs-s.json', import.meta.url).href;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion)').matches;

@customElement('flow-survey')
export class FlowSurvey extends LitElement {
  @property({ type: Array }) answers: number[] = [];

  @property({ type: Array }) questions: Question[] = [];

  private _scoreModal?: ScoreModal | null;

  private _questionComponenets?: NodeListOf<SurveyQuestion>;

  static styles = [
    helperStyles,
    surveyStyles,
  ];

  async connectedCallback() {
    super.connectedCallback();

    const response = await fetch(questions);
    const questionData = await response.json() as Question[];
    this.questions = questionData;

    this.answers = new Array(this.questions.length);

    this._scoreModal?.updateVerdict();

    // Wait for the questions to be rendered
    await this.updateComplete;
    this._questionComponenets = this.shadowRoot?.querySelectorAll('survey-question');
  }

  protected firstUpdated() {
    this._scoreModal = this.shadowRoot?.querySelector('score-modal');
  }

  questionAnswered(questionIndex: number, answer: number) {
    this.answers[questionIndex] = answer;
    this._updateVerdict();

    // If the focus has already left the question, don't adjust the focus or scroll.
    // Safari doesn't track activeElement properly in the shadowDOM - checking the
    // document.activeElement is this element prevents a false positive.
    const thisQuestion = this._questionComponenets && this._questionComponenets[questionIndex];
    if (
      !thisQuestion ||
      (!thisQuestion.shadowRoot?.activeElement && document.activeElement === this)
    ) {
      return;
    }

    // Focus and scroll smoothly to the next question
    const nextQuestion = this._questionComponenets && this._questionComponenets[questionIndex + 1];
    if (!nextQuestion) {
      return;
    }
    // Get the current scroll coordinates
    const x = window.scrollX;
    const y = window.scrollY;
    // Shift the focus
    nextQuestion.giveFocus();
    // Reset scroll position to avoid the visual jump of moving focus
    window.scrollTo(x, y);
    // Smoothly scroll to the next question
    nextQuestion.parentElement?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  private _updateVerdict() {
    this._scoreModal?.updateVerdict();
  }

  @eventOptions({ passive: true })
  private _resetForm() {
    this._questionComponenets?.forEach((component, index) => {
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

    this.questionAnswered(number, answer);
  }

  protected render() {
    return html`
      <main>
        <h1 class="fs-h-visually-hidden">Flow Survey</h1>

        <form
          @question-answered=${this._onQuestionAnswered}
          class="fs-form"
          id="flow-survey"
        >
          ${this.questions.map(
            (question, number) => html`
              <section class="fs-form__section" id="question-${number + 1}">
                <h2 class="fs-progress-header fs-t-large-heading">
                  Question ${number + 1}/${this.questions.length}
                </h2>
                <survey-question
                  .question=${question}
                  .number=${number}
                ></survey-question>
              </section>
            `
          )}
        </form>
        <score-modal
          @reset=${this._resetForm}
          .answers=${this.answers}
        ></score-modal>
      </main>
    `;
  }
}
