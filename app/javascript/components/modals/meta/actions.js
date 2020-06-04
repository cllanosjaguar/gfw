import { createAction, createThunkAction } from 'utils/redux';
import { getMeta } from 'services/meta';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setModalMetaData = createAction('setModalMetaData');
export const setModalMetaLoading = createAction('setModalMetaLoading');
export const setModalMetaClosing = createAction('setModalMetaClosing');

export const setModalMetaSettings = createThunkAction(
  'setModalMetaSettings',
  change => () =>
    setComponentStateToUrl({
      key: 'modalMeta',
      change,
    })
);

export const getModalMetaData = createThunkAction(
  'getModalMetaData',
  metaKey => (dispatch, getState) => {
    const { modalMeta } = getState();
    if (modalMeta && !modalMeta.loading) {
      dispatch(setModalMetaLoading({ loading: true, error: false }));
      getMeta(metaKey)
        .then(response => {
          dispatch(setModalMetaData(response.data));
        })
        .catch(() => {
          dispatch(setModalMetaLoading({ loading: false, error: true }));
        });
    }
  }
);

export const setModalMetaClosed = createThunkAction(
  'setModalMetaClosed',
  () => dispatch => {
    dispatch(setModalMetaClosing(true));
    dispatch(setModalMetaSettings(''));
    setTimeout(() => {
      dispatch(setModalMetaClosing(false));
    }, 500);
  }
);
