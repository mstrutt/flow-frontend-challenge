import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import type { FlowSurvey } from '../src/flow-survey.js';
import '../src/flow-survey.js';

describe('FlowSurvey', () => {
  let element: FlowSurvey;
  beforeEach(async () => {
    element = await fixture(html`<flow-survey></flow-survey>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
