import { createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setSectionProjectsModalSlug = createThunkAction(
  'setSectionProjectsModal',
  slug => () => {
    setComponentStateToUrl({
      key: 'sgfModal',
      change: slug
    })
  }
);
