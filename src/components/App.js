import React, {Component} from 'react';
import logo from '../assets/logo.svg';
import FirstScreen from "./FirstScreen";
import OrderForm from "./OrderForm";
import * as Steps from "./Steps";

class App extends Component {
  render() {

    let showFirstScreen = true;

    // TODO: redux ?
    let store = {
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

    // initial step
    let step = 1;
    // if (store.name !== '') {
    //   step = 2;
    //   if (store.product !== '') {
    //     step = 3;
    //   }
    // }
    // step = 4;

    let steps = [
      {
        title: 'Name the project',
        component: Steps.One
      },
      {
        title: 'Chose a product',
        component: Steps.Two
      },
      {
        title: 'Upload your layouts',
        component: Steps.Three
      },
      {
        title: 'Pickup inner color',
        component: Steps.Four
      },
    ];

    return (
      <div className="App">
        <FirstScreen active={showFirstScreen}/>
        <div className="container">
          <header className="App-header">
            <a href="/"><img src={logo} className="App-logo" alt="logo"/></a>
            <span className="App-title">Customizer</span>
          </header>
          <div className="App-main">
            <OrderForm step={step} steps={steps} store={store}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
