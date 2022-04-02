import React from 'react';
import NavBar from './NavBar';
import SelfDestruct from './SelfDestruct';
import Help from './Help';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { PoemList } from '../../features/poems/poemList';
import { Poem } from '../../features/poems/poem';
import { FeaturedWorldPoem } from './FeaturedWorldPoem';

const user_id = 'a';

function Game() {
    return (
        <Router>
            <NavBar />

            <div className='App'>
                <Switch>
                    <Route
                        exact
                        path='/'
                        render={() => (
                            <React.Fragment>
                                <Poem />
                            </React.Fragment>
                        )}
                    />
                    <Route
                        exact
                        path='/history'
                        render={() => (
                            <React.Fragment>
                                <PoemList />
                            </React.Fragment>
                        )}
                    />
                    <Route exact path='/relax' component={SelfDestruct} />
                    <Route exact='/help' path='/help' component={Help} />
                    <Route
                        exact
                        path='/user'
                        render={() => (
                            <React.Fragment>
                                <FeaturedWorldPoem />
                            </React.Fragment>
                        )}
                    />
                    <Route exact path='/poems/:poemId' component={Poem} />
                    <Redirect to='/' />
                </Switch>
            </div>
        </Router>
    );
}

export default Game;
