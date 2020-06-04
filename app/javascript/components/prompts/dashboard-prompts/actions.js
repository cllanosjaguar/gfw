import { createThunkAction, createAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { track } from 'app/analytics';

export const setShowDashboardPrompts = createAction('setShowDashboardPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');

export const setDashboardPromptsSettings = createThunkAction(
  'setDashboardPromptsSettings',
  change => (dispatch, state) => {
    const { dashboardPrompts } = state() || {};
    const { promptsViewed, showPrompts } = dashboardPrompts || {};
    const { stepsKey, force, stepIndex } = change || {};

    if (
      force ||
      (showPrompts && (!promptsViewed || !promptsViewed.includes(stepsKey)))
    ) {
      setComponentStateToUrl({
        key: 'dashboardPrompts',
        change,
      })
      if (stepsKey) {
        track('userPrompt', {
          label: `${stepsKey}: ${stepIndex + 1}`
        });
      }
    }

    if (stepsKey && showPrompts) {
      dispatch(setShowPromptsViewed(stepsKey));
    }
  }
);
