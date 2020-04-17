import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data && state.data.data;
const getSettings = state => state.settings;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentence;

export const parseData = createSelector(
  [getData, getColors, getSettings],
  (data, colors, settings) => {
    if (isEmpty(data)) return null;
    const list = data.topNodes.targetNodes;
    const rankedList = list.map(l => ({
      label: capitalize(l.name),
      value: settings.unit === 't' ? l.value : l.height * 100,
      id: l.id,
      volume: l.value,
      percentage: l.height * 100,
      unit: settings.unit,
      iso: l.geo_id,
      color: colors.main
    }));
    return {
      ...data,
      rankedData: rankedList
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getSentences, getSettings, getLocationName],
  (data, sentence, settings, locationName) => {
    if (!data) return null;
    const { startYear, endYear, commodity } = settings;
    const topLocation = data.rankedData[0];
    const params = {
      startYear,
      endYear,
      commodity: `${locationName} ${commodity.toLowerCase()}`,
      source: topLocation.label,
      volume: formatNumber({ num: topLocation.volume, unit: 't' }),
      percentage: formatNumber({ num: topLocation.percentage, unit: '%' }),
      location: locationName
    };

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
