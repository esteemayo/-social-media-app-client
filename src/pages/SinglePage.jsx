import { useQuery, useMutation } from '@apollo/react-hooks';
import { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Loader,
} from 'semantic-ui-react';
import Moment from 'react-moment';

import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';

const SinglePost = ({ match, history }) => {
  const postId = match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);
  const [comment, setComment] = useState('');

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      commentInputRef.current.blur();
      setComment('');
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    history.push('/');
  };

  return !data ? (
    <Loader active inline='centered' />
  ) : (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            size='small'
            float='right'
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{data.getPost.username}</Card.Header>
              <Card.Meta>
                <Moment fromNow>{data.getPost.createdAt}</Moment>
              </Card.Meta>
              <Card.Description>{data.getPost.body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{
                id: data.getPost.id,
                likes: data.getPost.likes,
                likeCount: data.getPost.likeCount
              }} />

              <MyPopup content='Comment on post'>
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log('Comment on post')}
                >
                  <Button basic color='blue'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {data.getPost.commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {user && user.username === data.getPost.username && (
                <DeleteButton postId={postId} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form>
                  <div className='ui action input fluid'>
                    <input
                      type='text'
                      placeholder='Comment...'
                      name='comment'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      ref={commentInputRef}
                    />
                    <button
                      type='submit'
                      className='ui button teal'
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}

          {data.getPost.comments.map((comment) => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={postId} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>
                  <Moment fromNow>{comment.createdAt}</Moment>
                </Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
};

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      username
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default SinglePost;
