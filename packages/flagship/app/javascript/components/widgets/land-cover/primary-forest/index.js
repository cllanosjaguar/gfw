import { getExtent } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'primaryForest',
  title: 'Primary forest in {location}',
  categories: ['land-cover'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_primary_forest',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER
      }
    }
  ],
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    landCover: 4
  },
  settings: {
    forestType: 'primary_forest',
    threshold: 30,
    extentYear: 2000
  },
  sentences: {
    initial:
      'As of 2001, {percentage} of {location} total tree cover was <b>primary forest</b>.',
    withIndicator:
      'As of 2001, {percentage} of {location} total tree cover in {indicator} was <b>primary forest</b>.'
  },
  refetchKeys: ['landCategory', 'threshold', 'extentYear'],
  whitelists: {
    adm0: [
      'IDN',
      'BRA',
      'MYS',
      'COL',
      'PER',
      'IND',
      'MMR',
      'VNM',
      'VEN',
      'CMR',
      'MEX',
      'BOL',
      'PAN',
      'ECU',
      'COG',
      'KHM',
      'COD',
      'THA',
      'LAO',
      'BTN',
      'PHL',
      'GAB',
      'CRI',
      'ARG',
      'PNG',
      'SUR',
      'GUY',
      'CHN',
      'GTM',
      'GUF',
      'HND',
      'NPL',
      'TZA',
      'NIC',
      'KEN',
      'GNQ',
      'MDG',
      'ZAF',
      'CUB',
      'PRY',
      'LBR',
      'CAF',
      'LKA',
      'DOM',
      'BRN',
      'BLZ',
      'SLB',
      'UGA',
      'CIV',
      'NGA',
      'AGO',
      'ETH',
      'TWN',
      'GNB',
      'BGD',
      'USA',
      'FJI',
      'PRI',
      'TTO',
      'VUT',
      'GIN',
      'JAM',
      'SLE',
      'MOZ',
      'RWA',
      'SLV',
      'ZMB',
      'GHA',
      'GLP',
      'CYM',
      'DMA',
      'AUS',
      'BHS',
      'HTI',
      'SEN',
      'MWI',
      'TCA',
      'PLW',
      'LCA',
      'MTQ',
      'ZWE',
      'VCT',
      'SSD',
      'VGB',
      'VIR',
      'GMB',
      'BDI',
      'SGP',
      'BEN',
      'MSR',
      'COM',
      'KNA',
      'MAF',
      'BES',
      'TGO',
      'ABW',
      'MDV',
      'ATG',
      'TLS',
      'SXM',
      'LSO',
      'AIA',
      'CHL',
      'CUW',
      'UMI',
      'GRD'
    ]
  },
  getData: params =>
    all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
      getExtent({
        ...params,
        forestType:
          params.forestType === 'primary_forest'
            ? 'plantations'
            : params.forestType
      })
    ]).then(
      spread((gadm28Response, iflResponse, plantationsResponse) => {
        const gadmExtent = gadm28Response.data && gadm28Response.data.data;
        const primaryExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let plantations = 0;
        let data = {};
        const plantationsData =
          plantationsResponse.data && plantationsResponse.data.data;
        plantations = plantationsData.length ? plantationsData[0].extent : 0;
        if (primaryExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].extent;
          extent = primaryExtent[0].extent;
          data = {
            totalArea,
            totalExtent,
            extent,
            plantations
          };
        }
        return data;
      })
    ),
  getDataURL: params => [
    getExtent({ ...params, forestType: '', download: true }),
    getExtent({ ...params, download: true }),
    getExtent({
      ...params,
      forestType:
        params.forestType === 'primary_forest'
          ? 'plantations'
          : params.forestType,
      download: true
    })
  ],
  getWidgetProps
};
