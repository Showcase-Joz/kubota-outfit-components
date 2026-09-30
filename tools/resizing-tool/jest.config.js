const path = require("path");
module.exports = {
  rootDir: "../..",
  roots: ["<rootDir>/tests", "<rootDir>/tools/resizing-tool/src"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(j|t)sx?$": [require.resolve("babel-jest"), { configFile: path.join(__dirname, "babel.config.json") }],
  },
  moduleDirectories: ["node_modules", path.join(__dirname, "node_modules")],
  moduleNameMapper: {
    "^kubota-outfit-components$": "<rootDir>/dist/index.js",
    "\\.(css)$": require.resolve("identity-obj-proxy"),
    "single-spa-react/parcel": "single-spa-react/lib/cjs/parcel.cjs",
  },
  setupFilesAfterEnv: [require.resolve("@testing-library/jest-dom")],
};
