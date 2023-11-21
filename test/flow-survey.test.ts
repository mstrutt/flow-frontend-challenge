import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import type { FlowSurvey } from '../src/flow-survey.js';
import '../src/flow-survey.js';

describe('FlowSurvey', () => {
  let element: FlowSurvey;
  beforeEach(async () => {
    element = await fixture(html`<flow-survey></flow-survey>`);
    // One more render cycle after the data is fetched
    await element.updateComplete;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('Flow Survey');
  });

  describe('questionAnswered()', () => {
    beforeEach(async () => {
      // Casting to <any> allows sinon.spy to work on private methods
      sinon.spy(element, <any>'_updateVerdict');
      sinon.spy(window, 'scrollTo');
      element['_questionComponenets']?.forEach((questionComonpent) => {
        sinon.spy(questionComonpent, 'giveFocus');
      });
    });

    it('updates the answer array', () => {
      expect(element.answers[3]).not.to.equal(4);
      expect(element.answers[5]).not.to.equal(6);
      element.questionAnswered(3, 4);
      element.questionAnswered(5, 6);
      expect(element.answers[3]).to.equal(4);
      expect(element.answers[5]).to.equal(6);
    });

    it('calls to update the verdict', () => {
      expect(element['_updateVerdict']).not.to.have.been.called;
      element.questionAnswered(0, 0);
      expect(element['_updateVerdict']).to.have.been.calledOnce;
    });

    it('focuses the next question', () => {
      element.questionAnswered(0, 0);
      const nextQuestion = element['_questionComponenets']![1];
      expect(nextQuestion.giveFocus).to.have.been.calledOnce;

      expect(element['_questionComponenets']![0].giveFocus).not.to.have.been.called;
      expect(element['_questionComponenets']![2].giveFocus).not.to.have.been.called;
      expect(element['_questionComponenets']![3].giveFocus).not.to.have.been.called;
      expect(element['_questionComponenets']![4].giveFocus).not.to.have.been.called;
      expect(element['_questionComponenets']![5].giveFocus).not.to.have.been.called;
      expect(element['_questionComponenets']![6].giveFocus).not.to.have.been.called;
    });

    it('scrolls the page', () => {
      const parentElement = element['_questionComponenets']![1]!.parentElement as HTMLElement;
      sinon.spy(parentElement, 'scrollIntoView');

      element.questionAnswered(0, 0);
      expect(window.scrollTo).to.have.been.called;
      expect(parentElement.scrollIntoView).to.have.been.called;
    });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
