import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";

describe("Counter Component", () => {
  it("renders initial counter state", () => {
    render(<Home />);
    expect(screen.getByRole("status")).toHaveTextContent("0");
    expect(screen.getByText("Counter")).toBeInTheDocument();
  });

  describe("keyboard controls", () => {
    const setup = () => {
      render(<Home />);
      return screen.getByRole("status");
    };

    it("increments counter with Space key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "Space" });
      expect(counter).toHaveTextContent("1");
    });

    it("increments counter with Enter key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "Enter" });
      expect(counter).toHaveTextContent("1");
    });

    it("increments counter with Up Arrow key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "ArrowUp" });
      expect(counter).toHaveTextContent("1");
    });

    it("increments counter with Right Arrow key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "ArrowRight" });
      expect(counter).toHaveTextContent("1");
    });

    it("decrements counter with Down Arrow key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "ArrowDown" });
      expect(counter).toHaveTextContent("-1");
    });

    it("decrements counter with Left Arrow key", () => {
      const counter = setup();
      fireEvent.keyDown(window, { code: "ArrowLeft" });
      expect(counter).toHaveTextContent("-1");
    });

    it("shows reset confirmation with Escape key", () => {
      setup();
      fireEvent.keyDown(window, { code: "Escape" });
      expect(
        screen.getByText("Are you sure you want to reset the counter?")
      ).toBeInTheDocument();
    });
  });

  describe("button controls", () => {
    it("increments counter with +1 button", () => {
      render(<Home />);
      fireEvent.click(screen.getByLabelText("Count up"));
      expect(screen.getByRole("status")).toHaveTextContent("1");
    });

    it("decrements counter with -1 button", () => {
      render(<Home />);
      fireEvent.click(screen.getByLabelText("Count down"));
      expect(screen.getByRole("status")).toHaveTextContent("-1");
    });

    it("shows reset confirmation with Reset button", () => {
      render(<Home />);
      fireEvent.click(screen.getByLabelText("Reset counter"));
      expect(
        screen.getByText("Are you sure you want to reset the counter?")
      ).toBeInTheDocument();
    });

    it("resets counter when confirmed", () => {
      render(<Home />);
      // First increment the counter
      fireEvent.click(screen.getByLabelText("Count up"));
      expect(screen.getByRole("status")).toHaveTextContent("1");

      // Click reset button
      fireEvent.click(screen.getByLabelText("Reset counter"));

      // Confirm reset
      fireEvent.click(screen.getByText("Confirm"));
      expect(screen.getByRole("status")).toHaveTextContent("0");
    });
  });

  describe("local storage", () => {
    it("saves counter value to local storage", () => {
      render(<Home />);
      fireEvent.click(screen.getByLabelText("Count up"));
      expect(localStorage.getItem("count")).toBe("1");
    });

    it("loads counter value from local storage", () => {
      localStorage.setItem("count", "5");
      render(<Home />);
      expect(screen.getByRole("status")).toHaveTextContent("5");
    });
  });
});
