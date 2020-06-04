import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setProfileModalOpen = createThunkAction(
  'setProfileModalOpen',
  change => () =>
    setComponentStateToUrl({
      key: 'profile',
      change
    })
);
