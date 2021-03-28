import './App.css';
import './index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Authentication/login';
import Register from './components/Authentication/register';
import { CSSTransition } from 'react-transition-group';
import Header from './components/Main/header';
import WelcomePage from './components/Welcome/welcomePage';
import Folderview from './components/FolderView/folderview.component';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AboutSection from './components/Main/AboutSection';
import { Link as Scroll } from 'react-scroll'

const useStyles = makeStyles((theme) => ({
  root:{
    minHeight: '100vh',
   },
   down:{
     fontSize: '4rem',
   }
  })
);

function App() {
  const classes = useStyles();
  const [activeMenu, setActiveMenu] = useState('login');
  const [menuHeight, setMenuHeight] = useState(null);  
  const dropdownRef = useRef(null);
  const [checked, setChecked] = useState(false);

  function calcHeight(el){
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    setChecked(true)
  }, [])

  function handleChangeInForm(newValue) {
    setActiveMenu(newValue);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Header/>
              <div style={{ height: menuHeight }} ref={dropdownRef} className={classes.root} id = "loginRegister">
                <CSSTransition
                  in={activeMenu === 'login'}
                  timeout={500}
                  classNames="page-primary"
                  onEnter = {calcHeight}
                  unmountOnExit      
                  
                >
                  <Login activeMenu = {activeMenu} onChange={handleChangeInForm} />
                </CSSTransition>
                <CSSTransition
                  in={activeMenu === 'register'}
                  timeout={500}
                  classNames="page-secondary"
                  unmountOnExit    
                  onEnter = {calcHeight}  
                >
                  <Register activeMenu = {activeMenu} onChange={handleChangeInForm} />
                </CSSTransition>
                <Scroll to="about-section" smooth={true}>
                  <IconButton>
                    <ExpandMoreIcon className={classes.down} />
                  </IconButton>
                </Scroll>
              </div>
            <AboutSection />
          </Route>
        </Switch>  
        <Switch>
            <Route path="/welcome">
              <WelcomePage/>
            </Route>
        </Switch>
        <Switch>
          <Route path='/folderview'>
            <Folderview/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
