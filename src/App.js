import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import SinglePost from './pages/SinglePage';
import MenuBar from './components/MenuBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Switch>
            <Route path='/posts/:postId' component={SinglePost} />
            <AuthRoute path='/register' component={Register} />
            <AuthRoute path='/login' component={Login} />
            <Route exact path='/' component={Home} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
