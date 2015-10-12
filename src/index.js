import React from 'react';
import App from './Containers/App';
import { Provider } from 'react-redux';

import configureStore from '../src/store/configureStore.js'
const store = configureStore();

React.render(
    <Provider store={store}>
      {() => <App />}
    </Provider>,
    document.getElementById('root')
);
