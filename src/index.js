import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Data} from "./util";

ReactDOM.render(<App data={new Data()} />, document.getElementById('root'));
registerServiceWorker();
