import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { buildDateArray } from 'utils/dates';

// get list data
const getData = state => state.data && state.data.alerts;
const getLatestDate = state => state.data && state.data.latestDate;
const getCurrentLocation = state => state.locationLabel;
const getColors = state => state.colors;
const getSentence = state => state.sentence;

export const filterData = createSelector(
  [getData, getLatestDate],
  (data, latestDate) => {
    if (!data || isEmpty(data)) return null;

    const filteredData = data.filter(d =>
      moment(d.day).isAfter(moment(latestDate).subtract(1, 'week'))
    );

    if (!filteredData || sumBy(filteredData, 'count') === 0) return null;

    const startDate = moment(latestDate).subtract(1, 'week');
    const endDate = moment(latestDate);

    const weekData = buildDateArray(startDate, endDate).map(d => {
      const dayData = filteredData.find(fd => fd.day === d);
      return (
        dayData || {
          count: 0,
          day: d
        }
      );
    });

    return weekData;
  }
);

export const parseData = createSelector([filterData], data => {
  if (!data || data.length < 1) return null;
  return data;
});

export const parseConfig = createSelector(
  [parseData, getColors],
  (data, colors) => {
    if (!data || !data.length) return null;

    return {
      gradients: [
        {
          attributes: {
            id: 'firesGradient',
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '0%'
          },
          stops: [
            {
              offset: '0%',
              stopColor: colors.main,
              stopOpacity: '0'
            },
            {
              offset: '100%',
              stopColor: colors.main
            }
          ]
        }
      ],
      xKey: 'day',
      yKeys: {
        lines: {
          count: {
            stroke: 'url(#firesGradient)',
            type: 'monotone'
          }
        }
      },
      xAxis: {
        tickCount: 2,
        interval: data.length - 2,
        padding: { right: 8 },
        tickFormatter: t => moment(t).format('Do MMM')
      },
      tooltip: [
        {
          key: 'day',
          unitFormat: value => moment(value).format('Do MMM YYYY')
        },
        {
          key: 'count',
          unit: '',
          unitFormat: value =>
            (Number.isInteger(value) ? format(',')(value) : value)
        }
      ]
    };
  }
);

export const parseSentence = createSelector(
  [getData, filterData, getCurrentLocation, getSentence],
  (data, filteredData, currentLabel, sentence) => {
    if (isEmpty(data)) return null;
    const weekGladCount = filteredData ? sumBy(filteredData, 'count') : 'No';
    const averageGladCount = data ? Math.round(sumBy(data, 'count') / 52) : 0;

    const params = {
      location: currentLabel,
      count:
        typeof weekGladCount === 'number'
          ? format(',')(weekGladCount)
          : weekGladCount,
      weeklyMean: format(',')(averageGladCount)
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
