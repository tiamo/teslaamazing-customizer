import React, {Component} from 'react';
import {Fade, Modal, ModalBody} from "reactstrap";
import FirstScreen from "./FirstScreen";
import OrderForm from "./OrderForm";
import StepOne from "./OrderForm/StepOne";
import StepTwo from "./OrderForm/StepTwo";
import StepThree from "./OrderForm/StepThree";
import StepFour from "./OrderForm/StepFour";
import Logo from "./Svg/Logo";

// import asyncComponent from "./AsyncComponent";
// const StepThree = asyncComponent(() => import("./OrderForm/StepThree"));

// TODO: redux ?
let initialData = {
  name: '',
  product: '',
  frontInner: null,
  frontOuter: null,
  backInner: null,
  backOuter: null,
  items: {
    // "008": 12
  },
};

const Header = () => (
  <header className="Header">
    <a href="/" className="Header-logo">
      <Logo/>
    </a>
    <span className="Header-title">Customizer</span>
  </header>
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showFirstScreen: process.env.NODE_ENV !== 'development',
      showModal: false,
      modalContent: ""
    };
  }

  render() {
    return (
      <div className="App">
        <Fade in={this.state.showFirstScreen} unmountOnExit={true}>
          <FirstScreen onClick={() => {
            this.setState({showFirstScreen: false})
          }}/>
        </Fade>
        <Fade className="container" in={!this.state.showFirstScreen}>
          <Header/>
          <div className="App-main">
            <OrderForm data={initialData} onSubmit={this.handleSubmit}>
              <StepOne title="Name the project"/>
              <StepTwo title="Chose a product"/>
              <StepThree title="Upload your layouts"/>
              <StepFour title="Pickup inner color"/>
            </OrderForm>
          </div>
        </Fade>
        <Modal isOpen={this.state.showModal} toggle={this.toggleModal}>
          <ModalBody className="alert alert-success m-0">
            {this.state.modalContent}
          </ModalBody>
        </Modal>
      </div>
    );
  }

  /**
   * @param {Event} e
   */
  toggleModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  /**
   * @param {Object} data
   */
  handleSubmit = data => {
    this.setState({
      showModal: true,
      modalContent: <pre>{JSON.stringify(data, null, 4)}</pre>,
    });
  }

}

export default App;
