import { css } from 'lit';

export const surveyStyles = css`
  :host {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    justify-content: flex-start;
    min-height: 100vh;
  }

  @media screen and (min-width: 420px) and (max-width: 999px) {
    :host {
      font-size: calc(14px + 1vw);
    }
  }

  @media screen and (min-width: 1000px) {
    :host {
      font-size: 24px;
    }
  }

  .fs-form__section {
    padding-top: 2em;
    padding-bottom:  12vh;
  }

  .fs-progress-header {
    font-size: var(--small-heading);
    margin: 0 0 2em;
    text-align: center;
  }
`;
