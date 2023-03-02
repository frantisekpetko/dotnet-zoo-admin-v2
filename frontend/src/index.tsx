import React, {lazy} from 'react';
import ReactDOM from 'react-dom';
import 'src/index.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { StoreProvider } from 'easy-peasy';
import store from 'src/store';
import Routes from './routes/Routes';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';


import 'react-toastify/dist/ReactToastify.css';
/*
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
        <React.Fragment>
            <StoreProvider store={store}>
                <ToastContainer />
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </StoreProvider>
        </React.Fragment>,
    </React.StrictMode>
)
*/
ReactDOM.render(
    <React.Fragment>
        <StoreProvider store={store}>
            <ToastContainer/>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
        </StoreProvider>
    </React.Fragment>,
    document.getElementById('app')
);
