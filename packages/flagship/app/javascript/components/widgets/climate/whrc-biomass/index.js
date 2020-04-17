import { getBiomassRanking } from 'services/climate';

import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_BIOMASS_DENSITY_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_BIOMASS_DENSITY
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'whrc-biomass',
  title: {
    default: 'Aboveground live woody biomass in {location}',
    global: 'Global aboveground live woody biomass'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'variable',
      label: 'variable',
      type: 'switch',
      whitelist: ['totalbiomass', 'biomassdensity'],
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  refetchKeys: ['variable', 'threshold'],
  chartType: 'rankedList',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // above ground woody biomass
    {
      dataset: TREE_BIOMASS_DENSITY_DATASET,
      layers: [TREE_BIOMASS_DENSITY]
    }
  ],
  visible: ['dashboard', 'analysis'],
  colors: 'climate',
  metaKey: 'aboveground_biomass',
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentences: {
    initial:
      'In 2000, {location} had an aboveground live woody biomass density of {biomassDensity}, and a total biomass of {totalBiomass}.',
    totalbiomass:
      'Around {value} of the world’s {label} is contained in the top 5 countries.',
    biomassdensity:
      'The average {label} of the world’s top 5 countries is {value}.'
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
    extentYear: 2000,
    layers: ['loss'],
    pageSize: 5,
    page: 0,
    variable: 'totalbiomass'
  },
  getData: params =>
    getBiomassRanking(params).then(res => res.data && res.data.rows),
  getDataURL: params => [getBiomassRanking({ ...params, download: true })],
  getWidgetProps
};
