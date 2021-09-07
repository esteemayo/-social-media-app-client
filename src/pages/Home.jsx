import { Grid, Loader, Transition } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import { useContext } from 'react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import PostCard from './../components/PostCard';
import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1 className='page-title'>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <Loader active inline='centered' />
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
