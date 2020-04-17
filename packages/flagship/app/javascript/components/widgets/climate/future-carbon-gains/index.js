import { all, spread } from 'axios';
import { getEmissions } from 'services/climate';

import {
  POLITICAL_BOUNDARIES_DATASET,
  PROJECTED_CARBON_STORAGE_FOREST_REGROWTH
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  POTENTIAL_CARBON_GAINS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'futureCarbonGains',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  categories: ['climate'],
  colors: 'climate',
  types: ['country'],
  admins: ['adm0'],
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['co2Gain', 'cGain']
    }
  ],
  metaKey: 'potential_tree_biomass_gain',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  chartType: 'composedChart',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // potential carbon gains
    {
      dataset: PROJECTED_CARBON_STORAGE_FOREST_REGROWTH,
      layers: [POTENTIAL_CARBON_GAINS]
    }
  ],
  visible: ['dashboard', 'analysis'],
  sentences: {
    initial:
      'In {location}, potential carbon sequestration may reach {amount} of {variable} by {maxYear}.'
  },
  settings: {
    unit: 'co2Gain'
  },
  whitelists: {
    adm0: [
      'ARG',
      'BLZ',
      'BOL',
      'BRA',
      'COL',
      'CRI',
      'CUB',
      'ECU',
      'SLV',
      'GTM',
      'GUY',
      'HND',
      'JAM',
      'MEX',
      'NIC',
      'PAN',
      'PRY',
      'PER',
      'PRI',
      'SUR',
      'VEN'
    ]
  },
  getData: params =>
    all([...getEmissions({ ...params })]).then(
      spread(
        (
          cYSF,
          cMASF,
          cPasture,
          cCrops,
          co2YSF,
          co2MASF,
          co2Pasture,
          co2Crops
        ) => {
          const data = {
            cGain: {
              YSF: cYSF.data && cYSF.data.rows,
              MASF: cMASF.data && cMASF.data.rows,
              Pasture: cPasture.data && cPasture.data.rows,
              Crops: cCrops.data && cCrops.data.rows
            },
            co2Gain: {
              YSF: co2YSF.data && co2YSF.data.rows,
              MASF: co2MASF.data && co2MASF.data.rows,
              Pasture: co2Pasture.data && co2Pasture.data.rows,
              Crops: co2Crops.data && co2Crops.data.rows
            }
          };
          return data;
        }
      )
    ),
  getDataURL: params => getEmissions({ ...params, download: true }),
  getWidgetProps
};
