import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main heading", () => {
  render(<App />);
  // The application header displays the app name
  const headings = screen.getAllByText(/holidaze/i);
  expect(headings.length).toBeGreaterThan(0);
});
