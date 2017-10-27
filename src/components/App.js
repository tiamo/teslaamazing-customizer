import React, {Component} from 'react';
import FirstScreen from "./FirstScreen";
import OrderForm from "./OrderForm";
import * as Steps from "./Steps";
import {Fade, Modal, ModalBody} from "reactstrap";
import Logo from "./Svg/Logo";

// TODO: redux ?
let initialData = {
  name: '',
  product: '',
  frontInner: '',
  frontOuter: '',
  backInner: '',
  backOuter: '',
  items: {
    // "008": 12
  },
};

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <a href="/" className="Header-logo">
          <Logo/>
        </a>
        <span className="Header-title">Customizer</span>
      </header>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showFirstScreen: true,
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
              <Steps.One title="Name the project"/>
              <Steps.Two title="Chose a product"/>
              <Steps.Three title="Upload your layouts"/>
              <Steps.Four title="Pickup inner color"/>
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

  toggleModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleSubmit = data => {
    this.setState({
      showModal: true,
      modalContent: <pre>{JSON.stringify(data, null, 4)}</pre>,
    });
  }

}

export default App;
