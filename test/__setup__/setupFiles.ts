import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

declare let window: any;

Enzyme.configure({ adapter: new Adapter() });

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

window.skipEventLoop = () => new Promise(resolve => setImmediate(resolve));

window.requestAnimationFrame = (callback: () => void) => {
  setTimeout(callback, 0);
};

window.matchMedia = () => ({
  addListener: () => ({}),
  matches: false,
  removeListener: () => ({}),
});
