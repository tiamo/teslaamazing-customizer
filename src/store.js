import {combineReducers, createStore} from 'redux';
import {reducer as formReducer} from 'redux-form';
import app from "./reducers/index"

const reducer = combineReducers({
  app,
  form: formReducer
});

const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer);

export default store;
