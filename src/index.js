import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  BrowserRouter,
} from 'react-router-dom'
import Store from './store'
import AppRoot from './components/AppRoot'

// root of the frontend application
// <BrowserRouter> defines routing using react-router 4
// <Provider> defines the Redux store
ReactDOM.render(
  <BrowserRouter>
    <Provider store={Store}>
      <AppRoot />
    </Provider>
  </BrowserRouter>
  , document.getElementById('root'))
