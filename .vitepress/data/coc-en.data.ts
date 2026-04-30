let renderer: any = null;

export default {
  async load() {
    if (!renderer) {
      const { createMarkdownRenderer } = await import("vitepress");
      const config = (globalThis as any).VITEPRESS_CONFIG;
      renderer = await createMarkdownRenderer(
        config.srcDir,
        config.markdown,
        config.site.base,
        config.logger,
      );
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/siiway/.github/main/CODE_OF_CONDUCT.en.md",
    );

    let raw: string;

    if (response.ok) {
      raw = await response.text();
    } else {
      raw =
        'Load Code of Conduct failed, please visit <a href="https://github.com/siiway/.github/blob/main/CODE_OF_CONDUCT.en.md">GitHub Source File</a> to view it.\nAlso, please [Let us know](./contact)!';
    }

    return renderer.render(raw);
  },
};
