import { presetUni } from "@uni-helper/unocss-preset-uni";
import { defineConfig, transformerDirectives, transformerVariantGroup, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetUni({ attributify: { prefixedOnly: true } })],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
