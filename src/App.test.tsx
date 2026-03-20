import { render, screen } from "@testing-library/react";
import { ChakraProvider, Theme, defaultSystem } from "@chakra-ui/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the title", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <Theme appearance="dark" hasBackground>
          <App />
        </Theme>
      </ChakraProvider>,
    );
    expect(screen.getByRole("heading", { name: /sxsw music 2026/i })).toBeInTheDocument();
  });
});

