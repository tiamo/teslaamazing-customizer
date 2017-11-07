import React from 'react';
import {Fade, Modal, ModalBody} from "reactstrap";
import FirstScreen from "./FirstScreen";
import OrderForm from "./OrderForm";
import Magnetic from "./Svg/Magnetic";
import Values from "./Values";
import {connect} from "react-redux";
import {setSuccessMessage, toggleFirstScreen} from "../actions";

const Header = () => (
  <header className="Header">
    <a href="/" className="Header-logo">
      <Magnetic/>
    </a>
    <span className="Header-title">Customizer</span>
  </header>
);

const App = ({firstScreen, hideFirstScreen, successMessage, setSuccessMessage}) => (
  <div className="App">
    <Fade in={firstScreen} unmountOnExit={true}>
      <FirstScreen onClick={hideFirstScreen}/>
    </Fade>
    <Fade className="container" in={!firstScreen}>
      <Header/>
      <div className="App-main">
        <OrderForm onSubmit={() => {
          setSuccessMessage("Thanks for your order!")
        }}/>
        {process.env.NODE_ENV === "development" && (<Values form="order"/>)}
      </div>
    </Fade>

    {successMessage && (
      <Modal isOpen={true} toggle={() => {
        setSuccessMessage(null)
      }}>
        <ModalBody className="alert alert-success m-0">
          {successMessage}
        </ModalBody>
      </Modal>
    )}
  </div>
);

export default connect(state => {
  return state.app;
}, dispatch => {
  return {
    hideFirstScreen: (e) => {
      dispatch(toggleFirstScreen(false))
    },
    setSuccessMessage: (msg) => {
      dispatch(setSuccessMessage(msg))
    }
  }
})(App);
