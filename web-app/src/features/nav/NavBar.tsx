import React from 'react';
import { Menu, Button, Container } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export function NavBar() {
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as={NavLink} exact to="/">
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: '10px' }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" as={NavLink} exact to="/activities" />
          <Menu.Item>
            <Button positive as={NavLink} exact to="/activities/create">
              Create Activity
            </Button>
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
}
