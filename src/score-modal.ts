import { LitElement, html, css } from 'lit';
import { property, customElement, eventOptions } from 'lit/decorators.js';

import { CSS_CLASSES, MAX_POINTS_PER_QUESTION, SCORING_RULES } from './constants';


@customElement('score-modal')
export class ScoreModal extends LitElement {
  @property({ type: Array }) answers!: number[];
  @property({ type: Number }) maxPoints: number = 0;
  @property({ type: Number }) totalPoints: number = 0;
  @property({ type: String }) verdict: string = '';
  @property({ type: String }) verdictLowercase: string = '';
  closeButton?: HTMLElement | null;
  private closeButtonId: string = 'close-button';
  private modalTitleId: string = 'modal-title';
  private modalDescriptionId: string = 'modal-description';

  static styles = css`
    :host([aria-hidden="true"]) {
      display: none;
    }

    .fs-score-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;

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
      cursor: pointer;
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

  constructor() {
    super();

    this.onKeydown = this.onKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-labelledby', this.modalTitleId);
    this.setAttribute('aria-describedby', this.modalDescriptionId);

    this.updateVerdict();
  }

  firstUpdated() {
    this.closeButton = this.shadowRoot?.getElementById(this.closeButtonId);
  }

  updateVerdict() {
    this.totalPoints = this.answers.reduce((a, b) => a + b, 0);
    this.maxPoints = MAX_POINTS_PER_QUESTION * this.answers.length;
    this.verdict = SCORING_RULES.find(rule =>
      this.totalPoints >= rule.lower && this.totalPoints <= rule.upper
    )?.verdict || '';
    this.verdictLowercase = this.verdict.toLocaleLowerCase()

    // If there is an answer for every question
    if (this.answers.length && Object.values(this.answers).length === this.answers.length) {
      this.showVerdict();
    } else {
      this.hideVerdict();
    }
  }

  showVerdict() {
    this.ariaHidden = 'false';
    document.body.classList.add(CSS_CLASSES.HAS_MODAL);
    window.addEventListener('keydown', this.onKeydown);
    this.focus();
  }

  hideVerdict() {
    this.ariaHidden = 'true';
    document.body.classList.remove(CSS_CLASSES.HAS_MODAL);
    window.removeEventListener('keydown', this.onKeydown);
  }
  
  resetVerdict() {
    window.scrollTo(0, 0);
    this.dispatchEvent(new CustomEvent('reset'));
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.hideVerdict();
      return;
    }

    // Primative focus trap that works because there's only one focusable element
    if (event.key === 'Tab' || event.keyCode === 9) {
      this.closeButton?.focus();
      event.preventDefault();
      return;
    } 
  }

  private _onCloseClick() {
    this.resetVerdict();
    this.hideVerdict();
  }

  protected render() {
    return html`
      <div class="fs-score-modal">
        <div class="fs-score-modal__header">
          <h2 id="${this.modalTitleId}" class="fs-score-modal__title">Your score</h2>
          <p class="fs-score-modal__points">${this.totalPoints}<span class="fs-score-modal__out-of">/${this.maxPoints}</span></p>
          <p id="${this.modalDescriptionId}" class="fs-score-modal__verdict">${this.verdict}</p>
        </div>
        <div class="fs-score-modal__body">
          <h3 class="fs-score-modal__subtitle">What does this mean?</h3>
          <p class="fs-score-modal__explanation">This score indicates that you have ${this.verdictLowercase} symptoms</p>
          <p class="fs-score-modal__disclaimer">Remember that this questionnaire is not a complete diagnosis, but rather a guideline.</p>
          <button
            @click=${this._onCloseClick}
            class="fs-button fs-button--primary fs-score-modal__close
            form="flow-survey"
            id="${this.closeButtonId}"
            type="reset"
          >Close</button>
        </div>
      </div>
    `;
  }
}
