import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';

import {
  filterWidgetsByLocation,
  getWidgetCategories,
  getActiveCategory
} from 'components/widgets/selectors';
import {
  getActiveArea,
  selectAreaLoading
} from 'providers/areas-provider/selectors';

import CATEGORIES from 'data/categories.json';

// get list data
const selectShowMap = state =>
  state.location && state.location.query && !!state.location.query.showMap;
const selectLocation = state => state.location;
const selectAreaError = state => state.areas && state.areas.error;
const selectLocationType = state => state.location?.type;
const selectCategory = state => state.location?.query?.category || 'summary';
export const selectQuery = state => state.location?.query;

export const getEmbed = createSelector(
  [selectLocation],
  location => location.pathname?.includes('/embed')
);

export const getWidgetAnchor = createSelector(
  [selectQuery, filterWidgetsByLocation],
  (query, widgets) => {
    const { scrollTo } = query || {};
    const hasWidget =
      widgets && widgets.length && widgets.find(w => w.widget === scrollTo);

    return hasWidget ? document.getElementById(scrollTo) : null;
  }
);

export const getNoWidgetsMessage = createSelector(
  [selectCategory],
  category => `${upperFirst(category)} data for {location} coming soon`
);

export const getLinks = createSelector(
  [getWidgetCategories, getActiveCategory],
  (widgetCats, activeCategory) => {
    if (!widgetCats) {
      return null;
    }

    const allCats = process.env.FEATURE_ENV === 'staging' ? CATEGORIES : CATEGORIES.filter(cat => cat.value !== 'fires');

    return allCats.filter(c => widgetCats.includes(c.value)).map(
      category => ({
        label: category.label,
        category: category.value,
        active: activeCategory === category.value
      })
    );
  }
);

export const getDashboardsProps = createStructuredSelector({
  showMapMobile: selectShowMap,
  category: getActiveCategory,
  links: getLinks,
  widgetAnchor: getWidgetAnchor,
  noWidgetsMessage: getNoWidgetsMessage,
  locationType: selectLocationType,
  activeArea: getActiveArea,
  areaLoading: selectAreaLoading,
  widgets: filterWidgetsByLocation,
  areaError: selectAreaError
});
