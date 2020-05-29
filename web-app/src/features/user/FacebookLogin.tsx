import React from 'react';
import FbConnection from 'react-facebook-login/dist/facebook-login-render-props';
import { Button, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

export const FacebookLogin: React.FC<IProps> = observer(
  ({ fbCallback, loading }) => {
    return (
      <FbConnection
        appId="3326297994068847"
        fields="name,email,picture"
        callback={fbCallback}
        render={(renderProps: any) => (
          <Button
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="facebook"
            loading={loading}
          >
            <Icon name="facebook" />
            Login with facebook
          </Button>
        )}
      />
    );
  }
);
