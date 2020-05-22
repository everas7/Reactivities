import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Card, Header, Image, Grid, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';

export const ProfilePhotos = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    deletePhoto,
    loading
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow="6">
              {profile &&
                profile.photos.map(photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    <Button.Group>
                      <>
                        <Button
                          basic
                          name={photo.id}
                          positive
                          loading={loading && target === photo.id}
                          disabled={photo.isMain || (loading && deleteTarget === photo.id)}
                          content="Main"
                          onClick={e => {
                            setTarget(e.currentTarget.name);
                            setMainPhoto(photo);
                          }}
                        />
                        <Button
                          basic
                          name={photo.id}
                          negative
                          loading={loading && deleteTarget === photo.id}
                          disabled={photo.isMain || (loading && target === photo.id)}
                          icon="trash"
                          onClick={e => {
                            setDeleteTarget(e.currentTarget.name);
                            deletePhoto(photo);
                          }}
                        />
                      </>
                    </Button.Group>
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
