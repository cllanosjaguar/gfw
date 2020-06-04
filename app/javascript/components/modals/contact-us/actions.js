import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalContactUsOpen = createThunkAction(
  'setModalContactUsOpen',
  (isOpen) => () => {
    setComponentStateToUrl({
      key: 'contactUs',
      change: isOpen,
    });
  }
);
