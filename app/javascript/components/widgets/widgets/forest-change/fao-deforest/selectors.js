import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getLocation = state => state.payload || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSettings = state => state.settings || null;
const getPeriod = state => state.period || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getLocation, getColors],
  (data, location, colors) => {
    if (!data || !data.rank) return null;

    const { rank } = data;
    const locationIndex = findIndex(rank, d => d.iso === location.country);
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
    const dataTrimmed = rank.slice(trimStart, trimEnd);
    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      path: `/country/${d.iso}`,
      value: d.deforest
    }));
  }
);

export const getSentence = createSelector(
  [
    getData,
    getLocation,
    getCurrentLocation,
    getSettings,
    getPeriod,
    getSentences
  ],
  (data, location, currentLabel, settings, period, sentences) => {
    if (!data || !data.fao) return '';
    const { initial, noDeforest, humanDeforest } = sentences;
    const topFao = data.fao.filter(d => d.year === settings.period);
    const { deforest, humdef } = topFao[0];

    let sentence = noDeforest;
    if (deforest) {
      sentence = humdef ? humanDeforest : initial;
    }
    const params = {
      location: currentLabel,
      year: period && period.label,
      rate: `${format('.3s')(deforest)}ha/yr`,
      human: `${format('.3s')(humdef)}ha/yr`
    };

    return {
      sentence,
      params
    };
  }
);
