import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import { yearTicksFormatter } from 'components/widgets/utils/data';

// get list data
const getLoss = state => state.data && state.data.loss;
const getExtent = state => state.data && state.data.extent;
const getSettings = state => state.settings;
const getIsTropical = state => state.isTropical;
const getLocationLabel = state => state.locationLabel;
const getIndicator = state => state.indicator;
const getColors = state => state.colors;
const getSentence = state => state && state.sentence;

const parseData = createSelector(
  [getLoss, getExtent, getSettings],
  (data, extent, settings) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;

    return data.filter(d => d.year >= startYear && d.year <= endYear).map(d => {
      const percentageLoss = (d.area && d.area && d.area / extent * 100) || 0;

      return {
        ...d,
        area: d.area || 0,
        emissions: d.emissions || 0,
        percentage: percentageLoss > 100 ? 100 : percentageLoss
      };
    });
  }
);

const parseConfig = createSelector([getColors], colors => ({
  height: 250,
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.main,
        background: false
      }
    }
  },
  xAxis: {
    tickFormatter: yearTicksFormatter
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'year'
    },
    {
      key: 'area',
      unit: 'ha',
      unitFormat: value =>
        (value < 1000 ? Math.round(value) : format('.3s')(value))
    },
    {
      key: 'percentage',
      unit: '%',
      unitFormat: value =>
        (value < 1000 ? Math.round(value) : format('.2r')(value))
    }
  ]
}));

const parseSentence = createSelector(
  [
    parseData,
    getExtent,
    getSettings,
    getIsTropical,
    getLocationLabel,
    getIndicator,
    getSentence
  ],
  (data, extent, settings, tropical, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const {
      initial,
      withIndicator,
      noLoss,
      noLossWithIndicator,
      co2Emissions
    } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;
    let sentence = indicator ? withIndicator : initial;
    if (totalLoss === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }
    if (tropical && totalLoss > 0) {
      sentence = `${sentence}, ${co2Emissions}`;
    }
    sentence = `${sentence}.`;

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      loss: formatNumber({ num: totalLoss, unit: 'ha' }),
      percent: `${format('.2r')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
