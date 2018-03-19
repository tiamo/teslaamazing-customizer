import React from 'react';
import {Fade, Modal, ModalBody} from "reactstrap";
import FirstScreen from "./FirstScreen";
import OrderForm from "./OrderForm";
import Magnetic from "./Svg/Magnetic";
import Values from "./Values";
import {connect} from "react-redux";
import {setSuccessMessage, toggleFirstScreen} from "../actions";
import API from "../api";
import axios from 'axios';
import _ from "lodash";

const Header = () => (
  <header className="Header">
    <a href="/" className="Header-logo">
      <Magnetic/>
    </a>
    <span className="Header-title">Customizer</span>
  </header>
);

const App = ({firstScreen, hideFirstScreen, successMessage, setSuccessMessage, proceedToCheckout}) => (
  <div className="App">
    <Fade in={firstScreen} unmountOnExit={true}>
      <FirstScreen onClick={hideFirstScreen}/>
    </Fade>
    <Fade className="container" in={!firstScreen}>
      <Header/>
      <div className="App-main">
        <OrderForm onSubmit={proceedToCheckout}/>
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

    {/*<Modal isOpen={true} className="preloader">*/}
      {/*<ModalBody>*/}
        {/*Loading...*/}
      {/*</ModalBody>*/}
    {/*</Modal>*/}
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
    },
    proceedToCheckout: (values) => {

      let data = new FormData();
      data.append('project', values.name);
      data.append('frontOuter', values.frontOuter);
      data.append('frontInner', values.frontInner);
      data.append('backInner', values.backInner);
      data.append('backOuter', values.backOuter);

      _.forEach(values.items, function(value, key) {
        if (key !=='_') {
          data.append('purchases['+ key +']', value);
        }
      });


      API.post('guest-carts').then((res) => {

        let cartId = res.data;

        API.post('guest-carts/' + cartId + '/items', JSON.stringify({
          cartItem: {
            sku: '001',
            qty: 10,
            quoteId: cartId,
            productOption: {}
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((res) => {

          console.log(res);

        });

      });

      // axios
      //   .post('https://teslaamazing.com/rest/V1/guest-carts', data, {
      //     // headers: {
      //     //   'content-type': 'application/x-www-form-urlencoded'
      //     // }
      //   })
      //   .then((res) => {
      //     console.log(res);
      //     // window.location = 'https://teslaamazing.com/checkout';
      //   })

    }
  }
})(App);
