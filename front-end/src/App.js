import './App.css';
import './index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Authentication/login';
import Register from './components/Authentication/register';
import { CSSTransition } from 'react-transition-group';
import Header from './components/Main/header';
import Footer from './components/Main/footer';
import UploadPage from './components/Upload/uploadPage.component';

function App() {
  const [activeMenu, setActiveMenu] = useState('login');
  const [menuHeight, setMenuHeight] = useState(null);  
  const dropdownRef = useRef(null);

  function calcHeight(el){
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function handleChangeInForm(newValue) {
    setActiveMenu(newValue);
  }

  return (
    <div className="App">
      
      <BrowserRouter>
      <Switch>
          <Route path="/welcome">
            <UploadPage/>
          </Route>
        </Switch>

      <Switch>
          <Route path="/login">
            
         <Header/>
      <div style={{ height: menuHeight }} ref={dropdownRef}>
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
        
        
      </div>
      </Route>
        </Switch>
        
                  
      </BrowserRouter>
    </div>
  );
}

export default App;
