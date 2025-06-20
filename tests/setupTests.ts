require("dotenv").config({ path: ".env.local" });
import "@testing-library/jest-dom";
import React from "react";
import { TextEncoder, TextDecoder } from "util";
import "whatwg-fetch";

// MSW setup
import { server } from "./msw/server";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests (i.e. for testing one-time error scenarios).
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Polyfill for Jest jsdom environment
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as any;
}

jest.mock("lottie-react", () => ({
  __esModule: true,
  default: () => React.createElement("div", { "data-testid": "lottie-mock" }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, ...rest } = props;
    return React.createElement("img", rest);
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/app/utils/mongoClient", () => ({
  getMongoClient: jest.fn(),
}));

jest.mock("mongodb", () => ({
  ObjectId: jest.fn(),
  MongoClient: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
