import React from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation, Switch } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import { HomePage } from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { NotFound } from './NotFound';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route
                  key={location.key}
                  exact
                  path={['/activities/create', '/activities/manage/:id']}
                  component={ActivityForm}
                />
                <Route
                  exact
                  path="/activities/:id"
                  component={ActivityDetails}
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
