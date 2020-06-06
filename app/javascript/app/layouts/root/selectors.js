import { createStructuredSelector } from 'reselect';

const selectLoggedIn = (state) => state?.myGfw?.data?.loggedIn;

export const getPageProps = createStructuredSelector({
  loggedIn: selectLoggedIn
});
