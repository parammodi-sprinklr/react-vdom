import { createElement } from '../react-functions/createElement';
import { render } from '../react-functions/render';

let counter = 0;

export const CounterComponent = () => {
  const handleClick = () => {
    counter += 1;
    renderApp();
  };

  return createElement(
    'div',
    {},
    createElement('h1', {}, `Counter: ${counter}`),
    createElement('button', { onclick: handleClick }, 'Increment')
  );
};

const renderApp = () => {
  const app = CounterComponent();
  const root = document.getElementById('root');
  render(app, root);
};
