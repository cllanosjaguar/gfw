import { createSelector, createStructuredSelector } from 'reselect';
import Router from 'next/router';

const isServer = typeof window === 'undefined';
const { router } = Router;

const selectLoggedIn = (state) => state?.myGfw?.data?.loggedIn;
const selectLoggingIn = (state) => state?.myGfw?.loading;
const selectLocation = (state) => state?.location;
const selectQuery = () => router?.query;

export const selectActiveLang = () =>
  router?.query?.lang ||
  (!isServer && JSON.parse(localStorage.getItem('txlive:selectedlang'))) ||
  'en';

export const getEmbed = createSelector([selectLocation], (location) =>
  location?.pathname?.includes('/embed')
);

export const getIsGFW = createSelector(
  selectQuery,
  (query) => query?.gfw && JSON.parse(query.gfw)
);

export const getIsTrase = createSelector(
  selectQuery,
  (query) => query?.trase && JSON.parse(query.trase)
);

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn,
  authenticating: selectLoggingIn,
  isGFW: getIsGFW,
  isTrase: getIsTrase,
  embed: getEmbed,
});
