import { Redirect, Route, Switch } from 'react-router-dom';
import OpeningPage from 'src/pages/OpeningPage';
import LoginPage from 'src/pages/LoginPage';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import DetailPage from '../pages/DetailPage';
import AnimalPage from '../pages/AnimalPage';
import NotFound404 from '../pages/NotFound404';
import DataUploadPage from '../pages/DataUploadPage';
import UpdatePage from '../pages/UpdatePage';
import CreatePage from '../pages/CreatePage';
import { useStoreState } from '../store';
import React, {Suspense, lazy} from 'react';
import Spinner from 'src/components/Spinner';

const Routes = () => {


    const OpeningPage = lazy(() => import('src/pages/OpeningPage'));

    const storageToken: string | null  = null;
    const token: string | null = useStoreState((state) => state.user.accessToken);
    let isAuth: string | null = sessionStorage.getItem('accessToken');
    //console.log({ isAuth })
    /*
    React.useEffect(() => {
        console.log(storageToken);
        isAuth = storageToken;
    }, []);

    React.useEffect(() => {
        storageToken !== null ? isAuth = storageToken : isAuth = token;
    }, [storageToken, token]);
    */

    return (
        <Switch>
            {/*<Route exact path="/" render={(props) => (isAuth !== null ? <HomePage /> : <OpeningPage />)} />*/}
            <Route 
             exact
             path="/"
             render={() => (
                <Suspense fallback={null}>
                    <OpeningPage/>
                </Suspense>
            )} />
            
            <Route
                exact
                path="/login"
                render={() =>
                    isAuth !== null ? (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    ) : (
                        <LoginPage />
                    )
                }
            />

            <Route
                exact
                path="/upload"
                render={() =>
                    isAuth !== null ? (
                        <DataUploadPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                //state: { from: props.location }
                            }}
                        />
                    )
                }
            />

            <Route
                exact
                path="/animals"
                render={() =>
                    isAuth !== null ? (
                        <AnimalPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                //state: { from: props.location }
                            }}
                        />
                    )
                }
            />

            <Route
                exact
                path="/register"
                render={() =>
                    isAuth === null ? (
                        <RegisterPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                //state: { from: props.location }
                            }}
                        />
                    )
                }
            />

            <Route
                exact
                path={'/animals/create'}
                render={() =>
                    isAuth !== null ? 
                        <CreatePage />
                     : (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    )
                }
            />

            <Route
                exact
                path={'/animals/update/:id'}
                render={() =>
                    isAuth !== null ? 
                        <UpdatePage />
                    : (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    )
                }
            />

            <Route
                exact
                path={'/animals/detail/:id'}
                render={() =>
                    isAuth !== null ? (
                        <DetailPage />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    )
                }
            />

            <Route component={NotFound404} />
        </Switch>
    );
};

export default Routes;
