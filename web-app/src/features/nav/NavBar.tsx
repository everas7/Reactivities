import React, { useContext } from "react";
import { Menu, Button, Container } from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStore';

export function NavBar() {
  const activityStore = useContext(ActivityStore);
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <img src="assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" />
          <Menu.Item>
            <Button positive onClick={activityStore.openCreateForm}>
              Create Activity
            </Button>
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};
