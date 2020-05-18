import React, { useContext } from 'react';
import { Menu, Button, Container, Dropdown, Image } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';

export function NavBar() {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
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
          {user && (
            <Menu.Item position="right">
              <Image avatar spaced="right" src={user.image || '/assets/user.png'} />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/username`}
                    text="My profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </div>
  );
}
