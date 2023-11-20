import { css } from 'lit';

export const modalStyles = css`
  :host(.fs-score-modal) {
    animation-duration: .4s;
    animation-fill-mode: both;
    animation-name: fadeIn;
    animation-timing-function: ease-in-out;
    background-color: var(--body-background);
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    left: 0;
    overflow-y: auto;
    position: fixed;
    right: 0;
    text-align: center;
    top: 0;
  }

  :host(.fs-score-modal--fade-out) {
    animation-name: fadeOut;
  }

  :host([aria-hidden="true"]) {
    display: none;
  }

  .fs-score-modal__header {
    background-image: radial-gradient(var(--score-background), var(--score-background) 70%, transparent 70%);
    background-position: 50% 99%;
    background-size: calc(250% - 65vw) 150%;
    color: var(--score-text);
    padding: calc(var(--spacing-unit) + 16.87vh) calc(var(--spacing-unit) * 3) 4.25em;
  }

  .fs-score-modal__title {
    margin: 0;
  }

  .fs-score-modal__points {
    font-size: var(--extra-large-heading);
    margin: 0.15em 0;
  }

  .fs-score-modal__out-of {
    color: var(--score-text--muted);
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
    font-weight: var(--font-weight--bold);
    margin: 0;
  }

  .fs-score-modal__explanation {
    margin: .4em 0;
  }

  .fs-score-modal__disclaimer {
    color: var(--body-copy--muted);
    margin: .8em 0 calc(var(--spacing-unit) * 2);
  }

  .fs-score-modal__close {
    margin: auto auto 0.25em;
    width: 97%;
  }
`;
