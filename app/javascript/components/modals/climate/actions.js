import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalGFWClimateOpen = createThunkAction(
  'setModalGFWClimateOpen',
  isOpen => () => {
    setComponentStateToUrl({
      key: 'gfwclimate',
      change: isOpen,
    })
  }
);
