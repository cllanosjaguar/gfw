import request from 'utils/request';

const REQUEST_URL = `${process.env.CLIMATE_WATCH_API}/emissions`;

const QUERIES = {
  meta: '/meta',
  gas: '?gas={gas}&location={adm0}&source={source}'
};

export const getMeta = () => {
  const url = REQUEST_URL + QUERIES.meta;
  return request.get(url);
};

export const getGas = ({ adm0, gas, source }) => {
  const url =
    REQUEST_URL +
    QUERIES.gas
      .replace('{adm0}', adm0)
      .replace('{gas}', gas)
      .replace('{source}', source);
  return request.get(url);
};
