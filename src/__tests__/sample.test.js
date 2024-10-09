import { createElement } from '../react-functions/createElement';
import { diff } from '../react-functions/diff';
import { updateDOM } from '../react-functions/updateDOM';
import { render } from '../react-functions/render';

test('createElement should create a virtual DOM node', () => {
  const vNode = createElement('div', { id: 'test' }, 'Hello World');
  expect(vNode).toEqual({
    type: 'div',
    props: {
      id: 'test',
      children: ['Hello World'],
    },
  });
});

test('diff should detect type change', () => {
  const oldVNode = createElement('div', {});
  const newVNode = createElement('span', {});

  const patches = diff(oldVNode, newVNode);
  expect(patches).toEqual([{ type: 'REPLACE', newVNode }]);
});

test('updateDOM should replace an element', () => {
  const parent = document.createElement('div');
  const oldChild = document.createElement('div');
  parent.appendChild(oldChild);

  const patch = {
    type: 'REPLACE',
    newVNode: { type: 'span', props: {}, children: [] },
  };
  updateDOM(parent, [patch]);

  expect(parent.firstChild.tagName).toBe('SPAN');
});

test('render should correctly render virtual DOM to real DOM', () => {
  const vNode = createElement('div', {}, createElement('h1', {}, 'Hello'));
  const container = document.createElement('div');
  render(vNode, container);

  expect(container.innerHTML).toBe('<div><h1>Hello</h1></div>');
});
