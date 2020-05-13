import React from "react";
import { Menu, Button, Container } from "semantic-ui-react";
import './NavBar.module.css';

interface IProps {
  openCreateForm: () => void;
};

export const NavBar: React.FC<IProps> = ({openCreateForm}) => {
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <img src="assets/logo.png" alt="logo" className="menu__logo"/>
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" />
          <Menu.Item>
            <Button positive onClick={openCreateForm}>
              Create Activity
            </Button>
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};
