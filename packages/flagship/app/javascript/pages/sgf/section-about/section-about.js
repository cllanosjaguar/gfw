import { createElement } from 'react';

import Earth from './img/earth.svg';
import Map from './img/map.svg';
import People from './img/people.svg';

import Component from './section-about-component';

const sgfBenefits = [
  'Grant awards between $10K - $40K.',
  'Individualized training and support.',
  'Form part of the GFW partnership.'
];

const fellowshipBenefits = [
  'A monthly stipend, and access to additional discretionary funds for feld visits, equipment purchases, professional development, or workshop costs.',
  'All expenses paid (airfare, visa costs, meals and accommodation) to participate in tech camp and the GFW User Summit in Washington, DC.',
  'Training by experts in forest monitoring, land use planning, advocacy and enforcement, and project design and implementation.',
  'Participation in the GFW partnership and SGF/Fellowship alumni community.',
  'Communications coverage in WRI’s newsletters, blogs and social media.'
];

const results = [
  {
    icon: Earth,
    label: '<b>44 projects</b> from <b>30 countries</b>'
  },
  {
    icon: Map,
    label: 'Over <b>1.8 billion hectares</b> of forests monitored using GFW'
  },
  {
    icon: People,
    label: 'Over <b>1,800</b> people trained in using GFW'
  }
];

export default () =>
  createElement(Component, { sgfBenefits, fellowshipBenefits, results });
