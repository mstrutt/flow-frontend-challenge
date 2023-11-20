import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Question, QuestionAnsweredEvent } from './interfaces';
import { MAX_POINTS_PER_QUESTION } from './constants';

interface Response {
  label: string|null,
  value: number,
}

@customElement('survey-question')
export class SurveyQuestion extends LitElement {
  @property({ type: Number }) number!: number;
  @property({ type: Object }) question!: Question;
  @property({ type: Object }) responses: Response[] = [];
  private firstInput?: HTMLInputElement | null;
  private answerTimeout: any;

  static styles = css`
    .fs-question {
      border: none;
      margin: 0 auto;
      max-width: 34em;
      padding: 0 var(--spacing-unit);
    }

    .fs-question__title {
      font-size: var(--large-heading);
      padding: 0;
    }

    .fs-question__question {
      font-size: var(--large-paragraph);
      margin-top: 0.6em;
      margin-bottom: 1.2em;  
    }

    .fs-question__answers {
      border-top: 1px solid var(--border-color);
      margin-top: 2.6em;
      padding-top: 2em;
    }

    .fs-answer {
      align-items: center;
      cursor: pointer;
      display: flex;
      padding: calc(var(--spacing-unit) / 3) 0;
    }

    .fs-answer__input {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    .fs-answer__number {
      background-color: var(--off-white);
      border-radius: calc(var(--tap-target-size) / 2);
      color: var(--black);
      display: block;
      flex-shrink: 0;
      height: var(--tap-target-size);
      line-height: var(--tap-target-size);
      margin: calc(var(--spacing-unit) / 3) var(--spacing-unit) calc(var(--spacing-unit) / 3) 0;
      text-align: center;
      transition: background-color .15s;
      width: var(--tap-target-size);
    }

    .fs-answer__input:focus-visible + .fs-answer__number {
      outline: 2px solid var(--dark-blue);
    }

    .fs-answer__input:checked + .fs-answer__number {
      background-color: var(--light-blue);
    }

    .fs-answer__text {
      margin: calc(var(--spacing-unit) / 3) 0;
    }
  `;
  
  connectedCallback() {
    super.connectedCallback();

    this.id = this.question.title.replace(/\W/g, '-').toLowerCase();

    // Possible answers range from 0 to MAX, array is always 1 longer
    this.responses = [...(new Array(MAX_POINTS_PER_QUESTION + 1))]
      .map((_, value) => ({
        // Labels for even values only
        label: value % 2 ? null : this.question.responses[value / 2],
        value,
      }));
  }

  protected firstUpdated() {
    this.firstInput = this.shadowRoot?.querySelector('input') as HTMLInputElement;
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
    this.firstInput?.focus();
  }

  resetInput() {
    const selectedInput = this.shadowRoot?.querySelector('input:checked') as HTMLInputElement;
    selectedInput.checked = false;
  }

  private _answerSelected(answer: number) {
    clearTimeout(this.answerTimeout);
    this.answerTimeout = setTimeout(() => this.answerSelected(answer), 800);
  }

  protected render() {
    return html`
      <fieldset class="fs-question">
        <legend class="fs-question__title">${this.question.title}</legend>
        <p class="fs-question__question">${this.question.question}</p>
        ${this.question.paragraph && html`<p class="fs-question__paragraph">${this.question.paragraph}</p>`}
        <div class="fs-question__answers">
          ${this.responses.map(response => html`
            <label class="fs-answer" for="${this.id}-${response.value}">
              <input
                @input=${() => this._answerSelected(response.value)}
                class="fs-answer__input"
                id="${this.id}-${response.value}"
                name="${this.id}"
                type="radio"
                value="${response.value}"
              />
              <span class="fs-answer__number">${response.value}</span>
              ${response.label && html`<span class="fs-answer__text">${response.label}</span>`}
            </label>
          `)}
        </div>
      </fieldset>
    `;
  }
}
