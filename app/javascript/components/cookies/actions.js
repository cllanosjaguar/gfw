import { createAction, createThunkAction } from 'utils/redux';

const isServer = typeof window === 'undefined';

export const setCookiesBannerClosed = createAction('setCookiesBannerClosed');

export const agreeCookies = createThunkAction(
  'agreeCookies',
  () => dispatch => {
    if (!isServer) {
      localStorage.setItem('agreeCookies', true);
      dispatch(setCookiesBannerClosed());
    }
  }
);
