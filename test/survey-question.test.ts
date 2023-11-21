import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import type { SurveyQuestion } from '../src/survey-question.js';
import '../src/survey-question.js';
import { MAX_POINTS_PER_QUESTION } from '../src/constants.js';
import { Question } from '../src/interfaces.js';

describe('SurveyQuestion', () => {
  let element: SurveyQuestion;
  let question: Question;
  beforeEach(async () => {
    question = {
      title: 'Title',
      question: 'This is the question.',
      paragraph: 'This is the paragraph.',
      responses: [
        'Zero',
        'Two',
        'Four',
        'Six',
      ],
    };
    element = await fixture(html`<survey-question .number=${0} .question=${question}></survey-question>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('sanitised id', () => {
    it('is based on the title', () => {
      expect(element.id).to.equal('title');
    });

    it('handles spaces and punctuation', async () => {
      question.title = `That's not a good title`;
      element = await fixture(html`<survey-question .number=${0} .question=${question}></survey-question>`);

      expect(element.id).to.equal('that-s-not-a-good-title');
    });
  });

  describe('responses', () => {
    it('creates an array of responses 1 longer than the maximum points (to included zero)', () => {
      expect(element.responses.length).to.equal(MAX_POINTS_PER_QUESTION + 1);
    });

    it('assigns a label to the even values', () => {
      expect(element.responses[0].label).to.equal('Zero');
      expect(element.responses[1].label).to.equal(null);
      expect(element.responses[2].label).to.equal('Two');
      expect(element.responses[3].label).to.equal(null);
      expect(element.responses[4].label).to.equal('Four');
      expect(element.responses[5].label).to.equal(null);
      expect(element.responses[6].label).to.equal('Six');
    });

    it('gives squential, zero-based values', () => {
      element.responses.forEach((response, index) => {
        expect(response.value).to.equal(index);
      });
    });
  });

  describe('answerSelected()', () => {
    beforeEach(() => {
      sinon.spy(element, 'dispatchEvent');
    });

    it('dispatches question-answered event', () => {
      element.answerSelected(0);
      expect(element.dispatchEvent).to.have.been.calledOnce;
    });

    it('includes detail about the answer', async () => {
      element.answerSelected(3);
      expect(element.dispatchEvent).to.have.been.calledWithMatch(
        new CustomEvent('question-answered', {
          detail: {
            number: 0,
            answer: 3,
          },
          bubbles: true,
        })
      );

      element = await fixture(html`<survey-question .number=${7} .question=${question}></survey-question>`);
      sinon.spy(element, 'dispatchEvent');
      element.answerSelected(5);
      expect(element.dispatchEvent).to.have.been.calledWithMatch(
        new CustomEvent('question-answered', {
          detail: {
            number: 7,
            answer: 5,
          },
          bubbles: true,
        })
      );
    });
  });

  describe('giveFocus()', () => {
    let inputs: NodeListOf<HTMLInputElement>;

    beforeEach(() => {
      inputs = element.shadowRoot!.querySelectorAll<HTMLInputElement>('input');
      inputs.forEach(input => sinon.spy(input, 'focus'));
    });

    it('fosues the first answer', () => {
      element.giveFocus();
      expect(inputs[0].focus).to.have.been.calledOnce;
    });

    it('does not focus the other answers', () => {
      inputs.forEach((input, index) => {
        if (!index) {
          return;
        }
        expect(input.focus).not.to.have.been.called;
      });
    });
  });

  describe('resetInput()', () => {
    it('resets the selected input', () => {
      const inputs = element.shadowRoot!.querySelectorAll<HTMLInputElement>('input');
      inputs[3].click();
      expect(inputs[3].checked).to.be.true;
      element.resetInput();
      expect(inputs[3].checked).not.to.be.true;
      const newCheckedInput = element.shadowRoot!.querySelector<HTMLInputElement>('input:checked');
      expect(newCheckedInput).to.equal(null);
    });

    it('handles no inputs being selected', () => {
      expect(element.resetInput()).not.to.throw;
      expect(element.resetInput()).not.to.throw;
    });
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
