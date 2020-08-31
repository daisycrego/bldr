import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import Game from './app/Game';
import store from './app/store';

// ========================================

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Game/>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
