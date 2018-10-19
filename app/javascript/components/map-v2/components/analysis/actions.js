import { createAction, createThunkAction } from 'redux-tools';
import union from 'turf-union';
import { DASHBOARDS } from 'router';

import { fetchUmdLossGain } from 'services/analysis';
import { uploadShapeFile } from 'services/shape';
import { getGeostoreKey } from 'services/geostore';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import uploadFileConfig from './upload-config.json';

// url action
export const setAnalysisSettings = createThunkAction(
  'setAnalysisSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'analysis',
        change,
        state
      })
    );
  }
);

// store actions
export const setAnalysisData = createAction('setAnalysisData');
export const setAnalysisLoading = createAction('setAnalysisLoading');
export const clearAnalysisError = createAction('clearAnalysisError');

export const getAnalysis = createThunkAction(
  'getAnalysis',
  location => dispatch => {
    dispatch(setAnalysisLoading({ loading: true, error: '', data: {} }));
    fetchUmdLossGain(location)
      .then(responses => dispatch(setAnalysisData(responses)))
      .catch(error => {
        const { response } = error;
        const errors =
          response &&
          response.data &&
          response.data.errors &&
          response.data.errors[0];
        const { status } = errors || {};
        dispatch(
          setAnalysisLoading({
            data: {},
            loading: false,
            error:
              status >= 500
                ? 'Service temporarily unavailable. Please refresh.'
                : 'No data available'
          })
        );
        console.info(error);
      });
  }
);

export const uploadShape = createThunkAction(
  'uploadShape',
  shape => (dispatch, getState) => {
    dispatch(setAnalysisLoading({ loading: true, error: '', data: {} }));
    uploadShapeFile(shape)
      .then(response => {
        if (response && response.data && response.data.data) {
          const features = response.data
            ? response.data.data.attributes.features
            : null;
          if (features && features.length < uploadFileConfig.featureLimit) {
            const geojson = features.reduce(union);
            getGeostoreKey(geojson.geometry)
              .then(geostore => {
                if (geostore && geostore.data && geostore.data.data) {
                  const { id } = geostore.data.data;
                  const { query, type } = getState().location;
                  dispatch({
                    type,
                    payload: {
                      type: 'geostore',
                      adm0: id
                    },
                    ...(query && {
                      query: {
                        ...query,
                        ...(query.map && {
                          map: {
                            ...query.map,
                            canBound: true
                          }
                        })
                      }
                    })
                  });
                  dispatch(
                    setAnalysisLoading({
                      loading: false,
                      error: '',
                      errorMessage: ''
                    })
                  );
                }
              })
              .catch(error => {
                dispatch(
                  setAnalysisLoading({
                    loading: false,
                    error: 'error with shape',
                    errorMessage:
                      (error.response.data &&
                        error.response.data.errors &&
                        error.response.data.errors[0].detail) ||
                      'error with shape'
                  })
                );
                console.info(error);
              });
          }
        }
      })
      .catch(error => {
        dispatch(
          setAnalysisLoading({
            loading: false,
            error: 'error with shape',
            errorMessage:
              (error.response.data &&
                error.response.data.errors &&
                error.response.data.errors[0].detail) ||
              'error with shape'
          })
        );
        console.info(error);
      });
  }
);

export const clearAnalysis = createThunkAction(
  'clearAnalysis',
  () => (dispatch, getState) => {
    const { query, type } = getState().location;
    dispatch({
      type,
      ...(query && {
        query
      })
    });
  }
);

export const goToDashboard = createThunkAction(
  'goToDashboard',
  () => (dispatch, getState) => {
    const { payload, query } = getState().location.query;
    dispatch({
      type: DASHBOARDS,
      payload,
      ...(query && {
        query
      })
    });
  }
);
