import { css } from 'lit';

export const questionStyles = css`
  .fs-question {
    border: none;
    margin: 0 auto;
    max-width: 34em;
    padding: 0 var(--spacing-unit);
  }

  .fs-question__title {
    padding: 0;
  }

  .fs-question__question {
    margin-top: 0.6em;
    margin-bottom: 1.2em;  
  }

  .fs-question__answers {
    border-top: 1px solid var(--border-color);
    margin-top: 2.6em;
    padding-top: 2em;
  }
`;

export const answerStyles = css`
  .fs-answer {
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: calc(var(--spacing-unit) / 3) 0;
  }

  .fs-answer__number {
    background-color: var(--ui-color);
    border-radius: calc(var(--tap-target-size) / 2);
    color: var(--ui-text-color);
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
    outline: 2px solid var(--ui-color--focus);
  }

  .fs-answer__input:checked + .fs-answer__number {
    background-color: var(--ui-color--active);
  }

  .fs-answer__text {
    margin: calc(var(--spacing-unit) / 3) 0;
  }
`;