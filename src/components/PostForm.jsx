import { useMutation } from '@apollo/react-hooks';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks';

const PostForm = () => {
  const { handleChange, handleSubmit, values } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const newData = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { newData } });
      values.body = '';
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
  });

  function createPostCallback() {
    createPost();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hello World!'
            name='body'
            value={values.body}
            error={error ? true : false}
            onChange={handleChange}
          />
        </Form.Field>
        <Button type='submit' color='teal'>
          Submit
        </Button>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likes {
        id
        username
        createdAt
      }
      likeCount
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

export default PostForm;
