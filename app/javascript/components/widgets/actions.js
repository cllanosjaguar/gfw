import { createAction, createThunkAction } from 'utils/redux';
import { track } from 'app/analytics';

import { setComponentStateToUrl } from 'utils/stateToUrl';
import { getNonGlobalDatasets } from 'services/analysis-cached';
import { setDashboardPromptsSettings } from 'components/prompts/dashboard-prompts/actions';

// widgets
export const setWidgetsData = createAction('setWidgetsData');
export const setWidgetsLoading = createAction('setWidgetsLoading');

export const getWidgetsData = createThunkAction(
  'getWidgetsData',
  () => dispatch => {
    dispatch(setWidgetsLoading({ loading: true, error: false }));
    getNonGlobalDatasets()
      .then(response => {
        const { rows } = response.data;
        dispatch(
          setWidgetsData({
            nonGlobalDatasets: rows && rows[0]
          })
        );
      })
      .catch(() => {
        dispatch(setWidgetsLoading({ error: true, loading: false }));
      });
  }
);

export const setWidgetSettings = createThunkAction(
  'setWidgetSettings',
  ({ change, widget }) => (dispatch) => {
    setComponentStateToUrl({
      key: 'widget',
      subKey: widget,
      change,
    })
    track('changeWidgetSettings', {
      label: `${widget}`
    });
    if (!change.interaction) {
      dispatch(
        setDashboardPromptsSettings({
          open: true,
          stepIndex: 0,
          stepsKey: 'shareWidget'
        })
      );
    }
  }
);

export const setActiveWidget = createThunkAction(
  'setActiveWidget',
  widget => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        widget,
        showMap: true
      }
    });
  }
);

export const goToWidgetLocation = createThunkAction(
  'goToWidgetLocation',
  params => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload: {
        type: payload.type === 'global' ? 'country' : payload.type,
        ...params
      },
      query: {
        ...query,
        map: {
          ...(query && query.map),
          canBound: true
        }
      }
    });
  }
);
