import { css } from 'lit';

export const buttonStyles = css`
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
    transition: background-color .15s;
  }

  .fs-button:active {
    transform: translateY(1px);
  }

  .fs-button--primary {
    background-color: var(--button-background--primary);
    color: var(--button-text--primary);
  }

  .fs-button--primary:hover {
    background-color: var(--button-background--primary-hover);
  }
`;

export const helperStyles = css`
  .fs-h-visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export const typographyStyles = css`
  .fs-t-large-heading {
    font-size: var(--large-heading);
    font-weight: var(--font-weight--normal);
  }

  .fs-t-large-paragraph {
    font-size: var(--large-paragraph);
    font-weight: var(--font-weight--normal);
  }
`;
