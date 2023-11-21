import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import { MAX_POINTS_PER_QUESTION } from './constants';

import { questionStyles, answerStyles } from './css/question';
import { animationStyles, helperStyles, typographyStyles } from './css/shared';

interface Response {
  label: string | null;
  value: number;
}

@customElement('survey-question')
export class SurveyQuestion extends LitElement {
  @property({ type: Number }) number!: number;

  @property({ type: Object }) question!: Question;

  @property({ type: Object }) responses: Response[] = [];

  private _firstInput?: HTMLInputElement | null;

  private _answerTimeout: any;

  static styles = [
    animationStyles,
    helperStyles,
    typographyStyles,
    questionStyles,
    answerStyles,
  ];

  connectedCallback() {
    super.connectedCallback();

    this.id = this.question.title.replace(/\W/g, '-').toLowerCase();

    // Possible answers range from 0 to MAX, array is always 1 longer
    const numberOfResponses = MAX_POINTS_PER_QUESTION + 1;
    this.responses = Array.from({ length: numberOfResponses }, (_, value) => ({
      // Labels for even values only
      label: value % 2 ? null : this.question.responses[value / 2],
      value,
    }));
  }

  protected firstUpdated() {
    this._firstInput = this.shadowRoot?.querySelector<HTMLInputElement>('input');
  }

  answerSelected(answer: number) {
    const questionAnsweredEvent = new CustomEvent('question-answered', {
      detail: {
        number: this.number,
        answer,
      },
      bubbles: true,
    }) as QuestionAnsweredEvent;
    this.dispatchEvent(questionAnsweredEvent);
  }

  giveFocus() {
    this._firstInput?.focus();
  }

  resetInput() {
    const selectedInput =
      this.shadowRoot?.querySelector<HTMLInputElement>('input:checked');
    if (selectedInput) {
      selectedInput.checked = false;
    }
  }

  private _answerSelected(answer: number) {
    clearTimeout(this._answerTimeout);
    this._answerTimeout = setTimeout(() => this.answerSelected(answer), 900);
  }

  protected render() {
    return html`
      <fieldset class="fs-question">
        <legend class="fs-question__title fs-t-large-heading">
          ${this.question.title}
        </legend>
        <p class="fs-question__question fs-t-large-paragraph">
          ${this.question.question}
        </p>
        ${this.question.paragraph && html`
          <p class="fs-question__paragraph">${this.question.paragraph}</p>
        `}
        <div class="fs-question__answers">
          ${this.responses.map(response => html`
            <label class="fs-answer" for="${this.id}-${response.value}">
              <input
                @input=${() => this._answerSelected(response.value)}
                class="fs-answer__input fs-h-visually-hidden"
                id="${this.id}-${response.value}"
                name="${this.id}"
                type="radio"
                .value=${response.value}
              />
              <span class="fs-answer__number">${response.value}</span>
              ${response.label && html`
                <span class="fs-answer__text">${response.label}</span>
              `}
            </label>
          `)}
        </div>
      </fieldset>
    `;
  }
}
