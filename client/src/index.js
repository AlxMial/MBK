import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider }  from 'react-redux';
import thunk from "redux-thunk";
import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore,
  i18nReducer
} from "react-redux-i18n";

import en from "assets/i18next/en.json";
import th from "assets/i18next/th.json";

import { createStore,combineReducers,applyMiddleware } from "redux";
import reducers  from "../src/services/reducers";
import * as Storage from "../src/services/Storage.service";
import { BrowserRouter} from "react-router-dom";
import 'flowbite';
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
const translateionsObject = {
  th: th,
  en: en,
}

const store = createStore(
  combineReducers(
    {
      ...reducers,
      i18n:i18nReducer,
    }),
    applyMiddleware(thunk)
)

syncTranslationWithStore(store);
store.dispatch(loadTranslations(translateionsObject));
store.dispatch(setLocale(Storage.GetLanguage()));

disableReactDevTools();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
