// simpleReact.js

let globalState = [];
let stateCursor = 0;
let currentComponent = null;

export function useState(initialState) {
  const FROZEN_CURSOR = stateCursor;
  globalState[FROZEN_CURSOR] = globalState[FROZEN_CURSOR] || initialState;

  const setState = (newState) => {
    globalState[FROZEN_CURSOR] = newState;
    rerender();
  };

  stateCursor++;
  return [globalState[FROZEN_CURSOR], setState];
}



export function createElement(type, props, ...children) {
  return { type, props: { ...props, children } };
}


function renderElement(node) {

  // Handle text nodes
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(node);
  }


  if (Array.isArray(node)) {
    // Render each item in the array and return a DocumentFragment
    const fragment = document.createDocumentFragment();
    node.forEach(child => {
      fragment.appendChild(renderElement(child));
    });
    return fragment;
  }


  // Handle regular HTML elements
  const element = document.createElement(node.type);


  if (node.props && node.props.children) {
    node.props.children
      .map(renderElement)
      .forEach(child => element.appendChild(child));
  }

  if (node.props) {
    Object.keys(node.props)
      .filter(prop => prop !== "children")
      .forEach(prop => {
        if (prop.startsWith("on")) {
          // Add event listener for props starting with "on"
          const eventType = prop.toLowerCase().substring(2); // Extract the event type (e.g., "click")
          element.addEventListener(eventType, node.props[prop]);
        } else {
          element.setAttribute(prop, node.props[prop]);
        }
      });
  }

  return element;
}



let appRoot;
let appTree;

export function render(component, rootElement) {
  appRoot = rootElement;
  appTree = component;
  rerender();
}

function rerender() {
  stateCursor = 0;
  currentComponent = { deps: [] };
  const element = renderElement(appTree());
  appRoot.innerHTML = "";
  appRoot.appendChild(element);
}
