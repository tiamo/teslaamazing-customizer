import React from 'react'
import {values as valuesDecorator} from 'redux-form'

const Values = ({form, format = values => JSON.stringify(values, null, 2)}) => {

  const style = {
    width: '100%',
    padding: '10px',
    background: '#f4f4f4',
    position: 'fixed',
    top: 0,
    left: 0,
    fontSize: '0.6rem',
  };

  const decorator = valuesDecorator({form});
  const component = ({values}) => (
    <div style={style}>
      <code>{format(values)}</code>
    </div>
  );
  const Decorated = decorator(component);
  return <Decorated/>
};

export default Values