import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setAreaOfInterestModalSettings = createThunkAction(
  'setAreaOfInterestModalSettings',
  change => () =>
    setComponentStateToUrl({
      key: 'areaOfInterestModal',
      change,
    })
);
