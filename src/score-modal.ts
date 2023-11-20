import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { CSS_CLASSES, MAX_POINTS_PER_QUESTION, SCORING_RULES } from './constants';

import { buttonStyles } from './css/shared';
import { modalStyles } from './css/modal';

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

  static styles = [
    buttonStyles,
    modalStyles,
  ];

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

  protected firstUpdated() {
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
