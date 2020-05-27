import React from 'react';
import { IAttendee } from '../../../app/models/activity';
import { List, Popup, Image } from 'semantic-ui-react';

interface IProps {
  attendees: IAttendee[];
}

const style: React.CSSProperties = {
  borderWidth: 2,
  borderColor: 'orange'
};

export const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <List.Item key={attendee.username}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                circular
                size="mini"
                src={attendee.image || '/assets/user.png'}
                bordered
                style={attendee.following ? style : null}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};
