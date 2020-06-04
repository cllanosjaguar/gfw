import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalGFWFiresOpen = createThunkAction(
  'setModalGFWFiresOpen',
  isOpen => () => {
    setComponentStateToUrl({
      key: 'gfwfires',
      change: isOpen
    })
  }
);
