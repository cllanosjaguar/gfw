import { createSelector, createStructuredSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';

const getData = state => state.data;
const getAdm0 = state => state.adm0;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSettings = state => state.settings;
const getPeriod = state => state.settings.period;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

export const parseData = createSelector(
  [getData, getAdm0, getColors],
  (data, adm0, colors) => {
    if (!data || !data.rank) return null;
    const { rank } = data;
    let dataTrimmed = rank;
    if (adm0) {
      const locationIndex = findIndex(rank, d => d.iso === adm0);
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > rank.length - 3) {
        trimStart = rank.length - 5;
        trimEnd = rank.length;
      }
      dataTrimmed = rank.slice(trimStart, trimEnd);
    }

    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      value: d.deforest
    }));
  }
);

export const parseSentence = createSelector(
  [getData, getLocationName, getSettings, getPeriod, getSentences],
  (data, currentLabel, settings, period, sentences) => {
    if (!data || !data.fao) return null;
    const {
      initial,
      noDeforest,
      humanDeforest,
      globalInitial,
      globalHuman
    } = sentences;
    const topFao = data.fao.filter(d => d.year === settings.period);
    const { deforest, humdef } = topFao[0] || {};
    const totalDeforest = sumBy(data.rank, 'deforest') || 0;
    const rate = currentLabel === 'global' ? totalDeforest : deforest;

    let sentence = humdef ? humanDeforest : initial;
    if (currentLabel === 'global') {
      sentence = humdef ? globalHuman : globalInitial;
    } else if (!deforest) sentence = noDeforest;

    const rateFormat = rate < 1 ? '.3r' : '.3s';
    const humanFormat = humdef < 1 ? '.3r' : '.3s';

    const params = {
      location: currentLabel,
      year: period,
      rate: `${format(rateFormat)(rate)}ha`,
      human: `${format(humanFormat)(humdef)}ha`
    };

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
