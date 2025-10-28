const React = require("react");

const BrowserRouter = ({ children }) =>
  React.createElement(React.Fragment, null, children);
const Routes = ({ children }) =>
  React.createElement(React.Fragment, null, children);
const Route = ({ element, children }) => (element ? element : children);
const Link = ({ to, children, ...props }) =>
  React.createElement("a", { href: to || "#", ...props }, children);
const NavLink = Link;

module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  MemoryRouter: BrowserRouter,
  useNavigate: () => () => {},
  useParams: () => ({}),
  useLocation: () => ({ pathname: "/", state: {} }),
};
