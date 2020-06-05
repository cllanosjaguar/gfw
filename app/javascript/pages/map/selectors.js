import { createSelector, createStructuredSelector } from 'reselect';

import {
  getDrawing,
  getMapLoading,
  getActiveDatasetsFromState,
  getInteractionSelected,
  getBasemapFromState,
} from 'components/map/selectors';
import { getShowDraw } from 'components/analysis/selectors';

import initialState from './initial-state';

// state from url
const selectMainMapUrlState = (state) => state.location?.query?.mainMap;
const selectLocation = (state) => state.location;
const selectMenuSection = (state) =>
  state.location &&
  state.location.query &&
  state.location.query.menu &&
  state.location.query.menu.menuSection;
const getDrawGeostoreId = (state) => state.draw && state.draw.geostoreId;

// SELECTORS
export const getEmbed = createSelector([selectLocation], (location) =>
  location?.pathname?.includes('/embed')
);

export const getMainMapSettings = createSelector(
  [selectMainMapUrlState],
  (urlState) => ({
    ...initialState,
    ...urlState,
  })
);

export const getHidePanels = createSelector(
  getMainMapSettings,
  (settings) => settings.hidePanels
);

export const getShowBasemaps = createSelector(
  getMainMapSettings,
  (settings) => settings.showBasemaps
);

export const getShowRecentImagery = createSelector(
  getMainMapSettings,
  (settings) => settings.showRecentImagery
);

export const getHideLegend = createSelector(
  getMainMapSettings,
  (settings) => settings.hideLegend
);

export const getShowAnalysis = createSelector(
  getMainMapSettings,
  (settings) => settings.showAnalysis
);

export const getOneClickAnalysis = createSelector(
  [getShowDraw, selectLocation, getDrawing, getMapLoading, getShowAnalysis],
  (showDraw, location, draw, loading, showAnalysis) => {
    const hasLocation = !!location.adm0;
    const isDrawing = draw || showDraw;
    return !hasLocation && !isDrawing && !loading && showAnalysis;
  }
);

export const getMapProps = createStructuredSelector({
  analysisActive: getShowAnalysis,
  recentActive: getShowRecentImagery,
  oneClickAnalysis: getOneClickAnalysis,
  hidePanels: getHidePanels,
  menuSection: selectMenuSection,
  activeDatasets: getActiveDatasetsFromState,
  embed: getEmbed,
  geostoreId: getDrawGeostoreId,
  selectedInteraction: getInteractionSelected,
  location: selectLocation,
  basemap: getBasemapFromState,
});
