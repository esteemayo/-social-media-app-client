import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Moment from 'react-moment';

import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';
import MyPopup from '../util/MyPopup';

const PostCard = ({
  post: { body, id, username, likes, likeCount, commentCount, createdAt },
}) => {
  const { user } = useContext(AuthContext);

  return (
    <Card.Group>
      <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>
            <Moment fromNow>{createdAt}</Moment>
          </Card.Meta>
          <Card.Description>
            {body.split(' ').splice(0, 20).join(' ')}...
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>
            <LikeButton
              user={user}
              post={{ id, likes, likeCount }}
            />

            <MyPopup content='Comment on post'>
              <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='blue' basic>
                  <Icon name='comments' />
                </Button>
                <Label basic color='blue' pointing='left'>
                  {commentCount}
                </Label>
              </Button>
            </MyPopup>
            {user && user.username === username && (
              <DeleteButton postId={id} />
            )}
          </div>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default PostCard;
