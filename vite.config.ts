import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";

import manifestJson from "./manifest.json";

const manifest = manifestJson as ManifestV3Export;

export default defineConfig({
  // depending on your application, base can also be "/"
  plugins: [tsconfigPaths(), react(), crx({ manifest })],
});
