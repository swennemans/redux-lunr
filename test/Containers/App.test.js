import React from 'react/addons';
import test from 'tape';

const {TestUtils} = React.addons;

import App from '../../src/Containers/App';

const setup = () => {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(React.createElement(App));
  return shallowRenderer.getRenderOutput()
};

console.log(JSON.stringify(setup()));

test('It should render', (assert) => {
  const component = setup();
  assert.equal(component.type, 'div');
  assert.end();
});