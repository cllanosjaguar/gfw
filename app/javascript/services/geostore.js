import axios from 'axios';

import { getGoogleLangCode } from 'utils/lang';

const REQUEST_URL = `${process.env.GFW_API}`;
const QUERIES = {
  geostore: '/geostore',
  admin: '/v2/geostore/admin'
};

const buildGeostoreUrl = ({ type, adm0, adm1, adm2, thresh }) => {
  let slug = type !== 'geostore' ? type : '';
  if (type === 'country') slug = 'admin';

  return `${REQUEST_URL}/v2/geostore${slug ? `/${slug}` : ''}/${adm0}${
    adm1 ? `/${adm1}` : ''
  }${adm2 ? `/${adm2}` : ''}${`?simplify=${!adm1 ? thresh : thresh / 10}`}`;
};

export const getGeostoreProvider = ({ type, adm0, adm1, adm2, token }) => {
  let thresh = 0.005;
  if (type === 'country') {
    const bigCountries = ['USA', 'RUS', 'CAN', 'CHN', 'BRA', 'IDN', 'AUS'];
    thresh = bigCountries.includes(adm0) ? 0.05 : 0.005;
  }
  const url = buildGeostoreUrl({ type, adm0, adm1, adm2, thresh });

  return axios.get(url, { cancelToken: token });
};

export const getGeostoreKey = (
  geojson,
  onUploadProgress,
  onDownloadProgress
) => {
  const url = REQUEST_URL + QUERIES.geostore;
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      geojson
    },
    url,
    onUploadProgress,
    onDownloadProgress
  });
};

export const getGeodescriberService = ({ geojson, lang, token }) =>
  // for now we are forcing english until API works
  axios({
    method: 'post',
    url: `${REQUEST_URL}/geodescriber/geom?lang=${getGoogleLangCode(
      lang
    )}&template=true&app=gfw`,
    data: {
      geojson
    },
    cancelToken: token
  });
