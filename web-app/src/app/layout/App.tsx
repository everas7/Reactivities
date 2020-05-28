import React, { useContext, useEffect } from 'react';
import { Container, Loader } from 'semantic-ui-react';
import { NavBar } from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer, } from 'mobx-react-lite';
import { Route, useLocation, Switch } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { HomePage } from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { NotFound } from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import ModalContainer from '../common/modals/ModalContainer';
import {ProfilePage} from '../../features/profiles/ProfilePage';
import { PrivateRoute } from './PrivateRoute';

function App() {
  const location = useLocation();
  const rootStore = useContext(RootStoreContext);
  const { token, setAppLoaded, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getUser, setAppLoaded]);

  if (!appLoaded) return <Loader content="Loading app..." />;
  return (
    <>
      <ToastContainer position="bottom-right" />
      <ModalContainer />
      <Route exact path="/" component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute exact path="/activities" component={ActivityDashboard} />
                <PrivateRoute
                  key={location.key}
                  exact
                  path={['/activities/create', '/activities/manage/:id']}
                  component={ActivityForm}
                />
                <PrivateRoute
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <PrivateRoute
                  exact
                  path="/profile/:username"
                  component={ProfilePage}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
