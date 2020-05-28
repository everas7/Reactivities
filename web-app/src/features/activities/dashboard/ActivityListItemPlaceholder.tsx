import React, { Fragment } from 'react';
import { Segment, Button, Placeholder, Label, Item } from 'semantic-ui-react';

export const ActivityListItemPlaceholder = () => {
  return (
    <Fragment>
      <Placeholder fluid>
        <Label style={{opacity: '0.1', width: 130, height: 26}} size="large" color="grey" />
        <Item.Group divided>
          <Segment.Group>
            <Segment style={{ minHeight: 110 }}>
              <Placeholder>
                <Placeholder.Header image>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Segment>
            <Segment>
              <Placeholder>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder>
            </Segment>
            <Segment secondary style={{ minHeight: 70 }} />
            <Segment clearing>
              <Button disabled color="blue" floated="right" content="View" />
            </Segment>
          </Segment.Group>
        </Item.Group>

        <Label style={{opacity: '0.1', width: 130, height: 26}} size="large" color="grey"/>
        <Item.Group divided>
        <Segment.Group>
          <Segment style={{ minHeight: 110 }}>
            <Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line />
              </Placeholder.Paragraph>
            </Placeholder>
          </Segment>
          <Segment>
            <Placeholder>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder>
          </Segment>
          <Segment secondary style={{ minHeight: 70 }} />
          <Segment clearing>
            <Button disabled color="blue" floated="right" content="View" />
          </Segment>
        </Segment.Group>
        </Item.Group>
      </Placeholder>
    </Fragment>
  );
};
