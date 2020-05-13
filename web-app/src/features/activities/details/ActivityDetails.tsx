import React, { useContext } from "react";
import { Card, Image, ButtonGroup, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (selectedActivity: IActivity | null) => void;
}

export const ActivityDetails: React.FC<IProps> = ({
  setEditMode,
  setSelectedActivity
}) => {
  const activityStore = useContext(ActivityStore);
  const {selectedActivity:activity} = activityStore;
  return (
    <Card fluid>
      <Image
        src={`assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <ButtonGroup widths={2}>
          <Button
            onClick={() => setEditMode(true)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => setSelectedActivity(null)}
            basic
            color="grey"
            content="Cancel"
          />
        </ButtonGroup>
      </Card.Content>
    </Card>
  );
};
