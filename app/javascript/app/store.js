import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { reduxModule as myGfwReduxModule } from 'providers/mygfw-provider';
import locationReduxModule from 'providers/location-provider';

import reducerRegistry from './registry';

reducerRegistry.registerModule('myGfw', myGfwReduxModule);
reducerRegistry.registerModule('location', locationReduxModule);

const initialReducers = combineReducers(reducerRegistry.getReducers());

export default (initialState) => {
  const store = createStore(
    initialReducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

  return store;
};
