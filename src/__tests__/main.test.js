import { createElement } from '../react-functions/createElement';
import { diff } from '../react-functions/diff';
import { updateDOM } from '../react-functions/updateDOM';
import { render } from '../react-functions/render';

// tests/noExternalImports.test.js
jest.mock('react', () => ({})); // Mock React
jest.mock('react-dom', () => ({})); // Mock ReactDOM

describe('createElement', () => {
  test('should create an element with multiple children', () => {
    const vNode = createElement(
      'div',
      { id: 'parent' },
      createElement('span', {}, 'Child 1'),
      createElement('span', {}, 'Child 2')
    );
    expect(vNode).toEqual({
      type: 'div',
      props: {
        id: 'parent',
        children: [
          { type: 'span', props: { children: ['Child 1'] } },
          { type: 'span', props: { children: ['Child 2'] } },
        ],
      },
    });
  });

  test('should handle no props and no children', () => {
    const vNode = createElement('div');
    expect(vNode).toEqual({
      type: 'div',
      props: {
        children: [],
      },
    });
  });

  test('should handle deeply nested structures', () => {
    const vNode = createElement(
      'div',
      {},
      createElement('span', {}, createElement('b', {}, 'Bold Text'))
    );
    expect(vNode).toEqual({
      type: 'div',
      props: {
        children: [
          {
            type: 'span',
            props: {
              children: [{ type: 'b', props: { children: ['Bold Text'] } }],
            },
          },
        ],
      },
    });
  });
});

describe('diff', () => {
  test('should handle adding new child nodes', () => {
    const oldVNode = createElement('div', {}, createElement('p', {}, 'Hello'));
    const newVNode = createElement(
      'div',
      {},
      createElement('p', {}, 'Hello'),
      createElement('span', {}, 'New Child')
    );

    const patches = diff(oldVNode, newVNode);
    expect(patches).toEqual([
      {
        index: 1,
        patches: [
          {
            type: 'ADD',
            newVNode: { type: 'span', props: { children: ['New Child'] } },
          },
        ],
      },
    ]);
  });

  test('should detect deeply nested structure changes', () => {
    const oldVNode = createElement('div', {}, createElement('span', {}, 'Old'));
    const newVNode = createElement('div', {}, createElement('span', {}, 'New'));

    const patches = diff(oldVNode, newVNode);
    expect(patches).toEqual([
      { index: 0, patches: [{ type: 'TEXT', newText: 'New' }] },
    ]);
  });

  test('should handle completely different node structures', () => {
    const oldVNode = createElement('div', {}, createElement('p', {}, 'Hello'));
    const newVNode = createElement('span', {}, 'Goodbye');

    const patches = diff(oldVNode, newVNode);
    expect(patches).toEqual([{ type: 'REPLACE', newVNode }]);
  });
});

describe('updateDOM', () => {
  test('should add a new child node', () => {
    const parent = document.createElement('div');
    const oldChild = document.createElement('p');
    parent.appendChild(oldChild);

    const patch = {
      type: 'ADD',
      newVNode: { type: 'span', props: { children: [] } },
    };
    updateDOM(parent, [patch]);

    expect(parent.childNodes[1].tagName).toBe('SPAN');
  });

  test('should replace deeply nested elements', () => {
    const parent = document.createElement('div');
    const oldChild = document.createElement('div');
    oldChild.innerHTML = '<p>Old Text</p>';
    parent.appendChild(oldChild);

    const patch = {
      type: 'REPLACE',
      newVNode: {
        type: 'div',
        props: { children: [createElement('span', {}, 'New Text')] },
      },
    };
    updateDOM(parent, [patch]);

    expect(parent.firstChild.innerHTML).toBe('<span>New Text</span>');
  });

  test('should apply multiple patches correctly', () => {
    const parent = document.createElement('div');
    const oldChild = document.createElement('p');
    oldChild.textContent = 'Old Text';
    parent.appendChild(oldChild);

    const patches = [
      { type: 'TEXT', newText: 'New Text' },
      { type: 'ADD', newVNode: { type: 'span', props: { children: [] } } },
    ];

    updateDOM(parent, patches);

    expect(parent.firstChild.textContent).toBe('New Text');
    expect(parent.childNodes[1].tagName).toBe('SPAN');
  });
});

describe('render', () => {
  test('should render nested elements correctly', () => {
    const vNode = createElement('div', {}, createElement('span', {}, 'Text'));
    const container = document.createElement('div');
    render(vNode, container);

    expect(container.innerHTML).toBe('<div><span>Text</span></div>');
  });

  test('should apply multiple renders without full DOM replacement', () => {
    const container = document.createElement('div');

    // Initial render
    const firstVNode = createElement(
      'div',
      {},
      createElement('h1', {}, 'Initial')
    );
    render(firstVNode, container);
    expect(container.innerHTML).toBe('<div><h1>Initial</h1></div>');

    // Second render (updates)
    const secondVNode = createElement(
      'div',
      {},
      createElement('h1', {}, 'Updated')
    );
    render(secondVNode, container);
    expect(container.innerHTML).toBe('<div><h1>Updated</h1></div>');

    // Ensure container wasn't fully replaced
    expect(container.childNodes.length).toBe(1);
  });

  test('should handle large-scale virtual DOM diffing efficiently', () => {
    const container = document.createElement('div');

    // Create a large virtual DOM structure
    const largeVNode = createElement(
      'div',
      {},
      ...Array.from({ length: 1000 }, (_, i) =>
        createElement('p', {}, `Paragraph ${i}`)
      )
    );

    render(largeVNode, container);
    expect(container.childNodes[0].childNodes.length).toBe(1000);
  });
});
