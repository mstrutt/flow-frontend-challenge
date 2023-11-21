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

  /* This text is to be hidden visually and only referenced by ID by screen readers */
  [id].fs-h-screen-reader-text {
    display: none !important;
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

export const animationStyles = css`
  @keyframes flashUIColor {
    33%,
    to {
      background-color: var(--ui-color--active);
      opacity: 1;
    }

    from,
    66% {
      background-color: var(--ui-color);
      opacity: .9;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion) {
    *,
    :host {
      animation-delay: 0s !important;
      animation-duration: 0s !important;
      transition-delay: 0s !important;
      transition-duration: 0s !important;
    }
  }
`;
