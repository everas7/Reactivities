import React from 'react';
import {
  Segment,
  Button,
  Placeholder,
  Item,
  Grid,
  Divider,
  Tab,
  Card
} from 'semantic-ui-react';

const pane = (
  <Tab.Pane>
    <Grid>
      <Grid.Column width={16} style={{ paddingBottom: 0 }}>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line length="very short" />
          </Placeholder.Header>
        </Placeholder>
      </Grid.Column>
      <Grid.Column width={16}>
        <Card.Group>
          <Card style={{ width: 117 }}>
            <Placeholder>
              <Placeholder.Image />
            </Placeholder>
            <Button.Group>
              <Button basic positive disabled content="Main" />
              <Button basic negative disabled icon="trash" />
            </Button.Group>
          </Card>
        </Card.Group>
      </Grid.Column>
    </Grid>
  </Tab.Pane>
);

const getMenuItem = (key: number) => (
  <Item key={key} active="true">
    <Placeholder>
      <Placeholder.Paragraph>
        <Placeholder.Line as="h2" />
      </Placeholder.Paragraph>
    </Placeholder>
  </Item>
);

const panes = [
  { menuItem: getMenuItem(1), render: () => pane },
  { menuItem: getMenuItem(2), render: () => pane },
  { menuItem: getMenuItem(3), render: () => pane },
  { menuItem: getMenuItem(4), render: () => pane },
  { menuItem: getMenuItem(5), render: () => pane }
];

export const ProfilePagePlaceholder = () => {
  return (
    <Placeholder fluid>
      <Segment>
        <Grid>
          <Grid.Column width={12}>
            <Item.Group>
              <Item>
                <Item.Image size="small">
                  <Placeholder
                    style={{ borderRadius: '50%', height: 150, width: 150 }}
                  >
                    <Placeholder.Image />
                  </Placeholder>
                </Item.Image>

                <Item.Content verticalAlign="middle">
                  <Placeholder>
                    <Placeholder.Paragraph>
                      <Placeholder.Line as="h2" length="short" />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
          <Grid.Column width={4}>
            <Placeholder>
              <Placeholder.Paragraph>
                <Placeholder.Line as="h2" length="full" />
                <Placeholder.Line as="h2" length="full" />
                <Placeholder.Line as="h2" length="full" />
              </Placeholder.Paragraph>
            </Placeholder>
            <Divider />
          </Grid.Column>
        </Grid>
      </Segment>
      <Tab
        panes={panes}
        menu={{ fluid: true, vertical: true }}
        menuPosition="right"
        defaultActiveIndex={0}
      />
    </Placeholder>
  );
};
