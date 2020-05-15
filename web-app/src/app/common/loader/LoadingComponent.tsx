import React from 'react'
import { Dimmer, Loader, } from 'semantic-ui-react';

interface IProps {
  content?: string;
  inverted?: boolean;
};

export const LoadingComponent: React.FC<IProps> = ({
  content,
  inverted = true,
}) => {
  return (
    <Dimmer inverted={inverted} active>
      <Loader content={content}/>
    </Dimmer>
  )
};
