import { LitElement, html, css } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

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

  static styles = css`
    label {
      display: block;
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

  private _answerSelected(answer: number) {
    const questionAnsweredEvent = new CustomEvent('question-answered', {
      detail: { 
        number: this.number,
        answer,
      },
      bubbles: true,
    }) as QuestionAnsweredEvent;
    this.dispatchEvent(questionAnsweredEvent);
  }

  protected render() {
    return html`
      <fieldset>
        <legend>${this.question.title}</legend>
        <p>${this.question.question}</p>
        ${this.question.paragraph && html`<p>${this.question.paragraph}</p>`}
        ${this.responses.map(response => html`
          <label for="${this.id}-${response.value}">
            <input
              @input=${() => this._answerSelected(response.value)}
              id="${this.id}-${response.value}"
              name="${this.id}"
              type="radio"
              value="${response.value}"
            />
            <span>${response.value}</span>
            ${response.label && html`<span>${response.label}</span>`}
          </label>
        `)}
      </fieldset>
    `;
  }
}
