module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "jsdom",
  testMatch: [
    "**/tests/api/**/*.test.ts",
    "**/tests/e2e/**/*.test.ts",
    "**/tests/unit/**/*.test.tsx",
    "**/tests/integration/**/*.test.tsx",
  ],
  moduleNameMapper: {
    "cropperjs/dist/cropper.css$":
      "<rootDir>/tests/__mocks__/cropperjs/dist/cropper.css.js",
    "^react-chartjs-2$": "<rootDir>/tests/__mocks__/react-chartjs-2.js",
    "\\.(svg|png|jpg|jpeg|gif)$": "<rootDir>/tests/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^swiper/react$": "<rootDir>/tests/__mocks__/swiper-react.js",
    "^swiper/modules$": "<rootDir>/tests/__mocks__/swiper-modules.js",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  transform: {
    "^.+\\.mjs$": "babel-jest",
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: "tsconfig.jest.json", useESM: true },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!(mongodb|bson|jose|openid-client|@panva/hkdf|uuid|preact-render-to-string|preact|mongodb)/)",
  ],
};
