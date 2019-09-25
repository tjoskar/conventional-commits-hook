name: Node CI

on: ["push"]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js v10
        uses: actions/setup-node@v1
        with:
          node-version: "10.x"
      - name: ⬇️ Install
        run: npm install
        env:
          CI: true
      - name: 🏗 Build
        run: npm run build
      - name: ✅ Lint
        run: npm run lint
