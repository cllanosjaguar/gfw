import { createStructuredSelector } from 'reselect';

import { getUserAreas } from 'providers/areas-provider/selectors';

const selectAreasLoading = state => state?.areas?.loading;
const selectLoggedIn = state => state?.myGfw?.data?.loggedIn;
const selectLoggingIn = state => state?.myGfw?.loading;

export const getMyGFWProps = createStructuredSelector({
  loading: selectAreasLoading,
  loggedIn: selectLoggedIn,
  loggingIn: selectLoggingIn,
  areas: getUserAreas
});
