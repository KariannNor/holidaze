// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Provide TextEncoder/TextDecoder in the test environment when missing.
// Some modern packages rely on these globals; Node's util provides them.
if (typeof TextEncoder === "undefined") {
  // eslint-disable-next-line global-require
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// NOTE: react-router-dom is mocked via __mocks__/react-router-dom.js
// Jest picks it up automatically via moduleNameMapper in package.json.
