import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import finallyShim from 'promise.prototype.finally';

import reducerRegistry from 'app/registry';
import routes from 'app/routes';
import makeStore from 'app/store';

import MyGFWProvider from 'providers/mygfw-provider';

import 'styles/styles.scss';

finallyShim.shim();

class MyApp extends App {
  store = makeStore();

  componentDidMount() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  componentDidUpdate() {
    this.store.replaceReducer(combineReducers(reducerRegistry.getReducers()));
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { route } = router || {};
    const routeConfig = routes[route];

    return (
      <Provider store={this.store}>
        <MyGFWProvider />
        <Component {...routeConfig} {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
