export const SCORING_RULES = [{
  lower: 0,
  upper: 12,
  verdict: 'No or minmal depression',
}, {
  lower: 13,
  upper: 19,
  verdict: 'Light depression',
}, {
  lower: 20,
  upper: 34,
  verdict: 'Moderate depression',
}, {
  lower: 35,
  upper: Infinity,
  verdict: 'Severe depression',
}];

export const MAX_POINTS_PER_QUESTION = 6;

export const CSS_CLASSES = {
  HAS_MODAL: 'has-modal',
};
