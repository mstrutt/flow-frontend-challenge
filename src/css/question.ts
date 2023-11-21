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

  @media screen and (min-width: 1000px) {
    .fs-question {
      display: grid;
      grid-template-columns: 40% 60%;
      grid-template-rows: auto auto auto;
      max-width: 60em;
    }

    .fs-question__title {
      /* Fixes Safari */
      white-space: nowrap;
    }

    .fs-question__question {
      margin-top: calc(var(--spacing-unit) * 4 / 3);
    }

    .fs-question__paragraph {
      margin-top: 0;
    }

    .fs-question__answers {
      grid-column: 2;
      grid-row: 1 / span 3;
      border-top: none;
      border-left: 1px solid var(--border-color);
      margin: var(--spacing-unit) 0 0 calc(var(--spacing-unit) * 2);
      padding: 0 0 0 calc(var(--spacing-unit) * 2);
    }
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
    margin:
      calc(var(--spacing-unit) / 3)
      var(--spacing-unit)
      calc(var(--spacing-unit) / 3)
      0;
    text-align: center;
    transition: background-color 50ms;
    width: var(--tap-target-size);
  }

  .fs-answer__input:focus-visible + .fs-answer__number {
    outline: 2px solid var(--ui-color--focus);
  }

  .fs-answer__input:checked + .fs-answer__number {
    animation-delay: .2s;
    animation-duration: .45s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    animation-name: flashUIColor;
    background-color: var(--ui-color--active);
  }

  .fs-answer__text {
    margin: calc(var(--spacing-unit) / 3) 0;
  }
`;
