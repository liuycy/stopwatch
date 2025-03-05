import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import autoimport from "unplugin-auto-import/vite";

export default async () => {
  const unocss = (await import("unocss/vite")).default;

  return defineConfig({
    plugins: [
      uni(),
      unocss(),
      autoimport({
        imports: ["vue", "uni-app", "pinia"],
        dts: "src/auto-imports.d.ts",
        dirs: ["src/store", "src/types", "src/utils"],
        vueTemplate: true,
      }),
    ],
  });
};
