import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import { CSS_CLASSES, MAX_POINTS_PER_QUESTION } from '../src/constants.js';
import type { ScoreModal } from '../src/score-modal.js';
import '../src/score-modal.js';

describe('ScoreModal', () => {
  let element: ScoreModal;
  beforeEach(async () => {
    element = await fixture(html`<score-modal .answers=${[]}></score-modal>`);
  });

  afterEach(() => {
    document.body.className = '';
    sinon.restore();
  });

  it('renders a h2', () => {
    const h2 = element.shadowRoot!.querySelector('h2')!;
    expect(h2).to.exist;
    expect(h2.textContent?.trim()).to.equal('Your score');
  });

  it('sets up the component', () => {
    expect(element.classList.contains(CSS_CLASSES.MODAL)).to.be.true;
    expect(element.getAttribute('role')).to.equal('dialog');
    expect(element.getAttribute('aria-modal')).to.equal('true');
    expect(element.getAttribute('aria-hidden')).to.equal('true');

    // Real elements shoudl exist for the aria label and description with text
    const labelledBy = element.getAttribute('aria-labelledby');
    const labelledByEl = element.shadowRoot!.getElementById(labelledBy!);
    expect(labelledByEl).to.exist;
    expect(labelledByEl?.textContent).not.to.equal('');
    const describedBy = element.getAttribute('aria-describedby');
    const describedByEl = element.shadowRoot!.getElementById(describedBy!);
    expect(describedByEl).to.exist;
    expect(describedByEl?.textContent).not.to.equal('');
  });

  describe('scoring', () => {
    it('calculates the total points based on the lenght of the answers array', () => {
      const score = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score.textContent?.trim()).to.equal('0/0');
    });

    it('calculates the total points based on the lenght of the answers array', async () => {
      const answers1 = [0];
      element = await fixture(html`<score-modal .answers=${answers1}></score-modal>`);

      const score1 = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score1.textContent?.trim()).to.equal(`0/${MAX_POINTS_PER_QUESTION}`);

      const answers2 = new Array(100);
      element = await fixture(html`<score-modal .answers=${answers2}></score-modal>`);

      const score2 = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score2.textContent?.trim()).to.equal(`0/${MAX_POINTS_PER_QUESTION * 100}`);
    });

    it('gives the score by summing the answers', async () => {
      const answers1 = [6, 6, 6, 6, 6, 6];
      element = await fixture(html`<score-modal .answers=${answers1}></score-modal>`);

      const score1 = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score1.textContent?.trim()).to.match(/36\/\d+/);

      const answers2 = [0, 1, 2, 3, 4, 5, 0];
      element = await fixture(html`<score-modal .answers=${answers2}></score-modal>`);

      const score2 = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score2.textContent?.trim()).to.match(/15\/\d+/);
    });

    it('handles missing answers', async () => {
      const answers = new Array(10);
      answers[3] = 4;
      answers[6] = 5;
      answers[9] = 6;
      element = await fixture(html`<score-modal .answers=${answers}></score-modal>`);

      const score = element.shadowRoot!.querySelector('.fs-score-modal__points')!;
      expect(score.textContent?.trim()).to.match(/15\/\d+/);
    });
  });

  describe('verdict', () => {
    it('renders a verdict', async () => {
      const answers = [0];
      element = await fixture(html`<score-modal .answers=${answers}></score-modal>`);

      const verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict).to.exist;
      expect(verdict.textContent?.trim()).not.to.equal('');
    });

    it('gives the correct verdict for the points', async () => {
      // No-minimal
      element = await fixture(html`<score-modal .answers=${[0]}></score-modal>`);
      let verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('No or minimal depression');

      element = await fixture(html`<score-modal .answers=${[6]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('No or minimal depression');

      element = await fixture(html`<score-modal .answers=${[12]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('No or minimal depression');

      // Light
      element = await fixture(html`<score-modal .answers=${[13]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Light depression');

      element = await fixture(html`<score-modal .answers=${[16]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Light depression');

      element = await fixture(html`<score-modal .answers=${[19]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Light depression');

      // Moderate
      element = await fixture(html`<score-modal .answers=${[20]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Moderate depression');

      element = await fixture(html`<score-modal .answers=${[28]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Moderate depression');

      element = await fixture(html`<score-modal .answers=${[34]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Moderate depression');

      // Severe
      element = await fixture(html`<score-modal .answers=${[35]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Severe depression');

      element = await fixture(html`<score-modal .answers=${[45]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Severe depression');

      element = await fixture(html`<score-modal .answers=${[54]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Severe depression');
    });

    it('handles scores outside of range without breaking', async () => {
      element = await fixture(html`<score-modal .answers=${[-50]}></score-modal>`);
      let verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('');

      element = await fixture(html`<score-modal .answers=${[999999]}></score-modal>`);
      verdict = element.shadowRoot!.getElementById(element['_modalDescriptionId'])!;
      expect(verdict.textContent?.trim()).to.equal('Severe depression');
    });
  });

  describe('updateVerdict()', () => {
    beforeEach(() => {
      sinon.spy(element, 'showVerdict');
      sinon.spy(element, 'hideVerdict');
    });

    it('updates totalPoints', () => {
      element.totalPoints = 0;
      element.answers = [1, 2, 3];
      expect(element.totalPoints).to.equal(0);

      element.updateVerdict();
      expect(element.totalPoints).to.equal(6);
    });

    it('updates maxPoints', () => {
      element.maxPoints = 0;
      element.answers = new Array(10);
      expect(element.maxPoints).to.equal(0);

      element.updateVerdict();
      expect(element.maxPoints).to.equal(MAX_POINTS_PER_QUESTION * 10);
    });

    it('updates verdict', () => {
      element.verdict = '';
      element.answers = [0];
      expect(element.verdict).to.equal('');

      element.updateVerdict();
      expect(element.verdict).to.equal('No or minimal depression');
    });

    it('calls showVerdict when every question has been answered', () => {
      expect(element.showVerdict).not.to.have.been.called;

      element.answers = new Array(2);
      element.updateVerdict();
      expect(element.showVerdict).not.to.have.been.called;

      element.answers[0] = 1;
      element.updateVerdict();
      expect(element.showVerdict).not.to.have.been.called;

      element.answers[1] = 2;
      element.updateVerdict();
      expect(element.showVerdict).to.have.been.called;
    });

    it('calls hideVerdict when no questions have been answered', () => {
      expect(element.hideVerdict).not.to.have.been.called;

      element.answers = [1, 2, 3];
      element.updateVerdict();
      expect(element.hideVerdict).not.to.have.been.called;

      element.answers = new Array(3);
      element.updateVerdict();
      expect(element.hideVerdict).to.have.been.called;
    });

    it('calls hideVerdict when only some questions have been answered', () => {
      expect(element.hideVerdict).not.to.have.been.called;

      element.answers = new Array(3);
      element.answers[0] = 0;
      element.updateVerdict();
      expect(element.hideVerdict).to.have.been.calledOnce;

      element.answers[1] = 1;
      element.updateVerdict();
      expect(element.hideVerdict).to.have.been.calledTwice;

      element.answers[2] = 2;
      element.updateVerdict();
      // Now checking the count hasn't increased
      expect(element.hideVerdict).to.have.been.calledTwice;
    });
  });

  describe('showVerdict()', () => {
    beforeEach(() => {
      sinon.spy(element, 'focus');
    });

    it('updates the isVisible property', () => {
      element.isVisible = false;
      element.showVerdict();
      expect(element.isVisible).to.be.true;
    });

    it('updates updates the DOM', () => {
      expect(element.getAttribute('aria-hidden')).to.equal('true');
      expect(document.body.classList.contains(CSS_CLASSES.HAS_MODAL)).to.be.false;

      element.showVerdict();

      expect(element.getAttribute('aria-hidden')).to.equal('false');
      expect(document.body.classList.contains(CSS_CLASSES.HAS_MODAL)).to.be.true;
    });

    it('focuses the modal', () => {
      expect(element.focus).not.to.have.been.called;

      element.showVerdict();

      expect(element.focus).to.have.been.called;
    });
  });

  describe('hideVerdict()', () => {
    beforeEach(() => {
      sinon.spy(window, 'removeEventListener');
    });

    it('updates the isVisible property', () => {
      element.isVisible = true;
      element.hideVerdict();
      expect(element.isVisible).to.be.false;
    });

    it('rests the UI after animationend event', () => {
      element.isVisible = true;
      element.ariaHidden = 'false';
      document.body.classList.add(CSS_CLASSES.HAS_MODAL);

      element.hideVerdict();
      expect(window.removeEventListener).to.have.been.calledOnce;
      // None of these should change until the animationend event
      expect(element.ariaHidden).to.equal('false');
      expect(document.body.classList.contains(CSS_CLASSES.HAS_MODAL)).to.be.true;
      expect(element.classList.contains(CSS_CLASSES.MODAL_FADE_OUT)).to.be.true;

      element.dispatchEvent(new AnimationEvent('animationend'));
      expect(element.ariaHidden).to.equal('true');
      expect(document.body.classList.contains(CSS_CLASSES.HAS_MODAL)).to.be.false;
      expect(element.classList.contains(CSS_CLASSES.MODAL_FADE_OUT)).to.be.false;
      // Still only once
      expect(window.removeEventListener).to.have.been.calledOnce;
    });
  });

  describe('resetVerdict()', () => {
    it('scrolls the page to top', () => {
      sinon.spy(window, 'scrollTo');
      element.resetVerdict();
      expect(window.scrollTo).to.have.been.calledWith(0, 0);
    });

    it('dispatches a reset event to the parent', () => {
      sinon.spy(element, 'dispatchEvent');
      element.resetVerdict();
      expect(element.dispatchEvent).to.have.been.calledOnce;
      expect(element.dispatchEvent).to.have.been.calledWithMatch(
        new CustomEvent('reset')
      );
    });
  });

  describe('onKeydown()', () => {
    beforeEach(() => {
      sinon.spy(element, 'hideVerdict');
      sinon.spy(element, 'resetVerdict');
      sinon.spy(element.closeButton!, 'focus');
    });

    it('calls hideVerdict on an Escape key', () => {
      expect(element.hideVerdict).not.to.have.been.called;
      expect(element.resetVerdict).not.to.have.been.called;

      element.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(element.hideVerdict).not.to.have.been.called;
      expect(element.resetVerdict).not.to.have.been.called;

      element.onKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(element.hideVerdict).to.have.been.calledOnce;
      expect(element.resetVerdict).to.have.been.called;
    });

    it('focuses the closeButton on a Tab key', () => {
      expect(element.closeButton!.focus).not.to.have.been.called;

      element.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(element.closeButton!.focus).not.to.have.been.called;

      element.onKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(element.closeButton!.focus).to.have.been.called;
    });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
