const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const root = path.join(__dirname, "..");
const contentDir = process.env.INSIGHTS_CONTENT_DIR
  ? path.resolve(process.env.INSIGHTS_CONTENT_DIR)
  : path.join(root, "insights-content");
const siteContentDir = process.env.SITE_CONTENT_DIR
  ? path.resolve(process.env.SITE_CONTENT_DIR)
  : path.join(root, "site-content");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor, {
  permalink: false,
  level: [2, 3, 4],
});

function loadPosts() {
  const postsDir = path.join(contentDir, "posts");
  if (!fs.existsSync(postsDir)) {
    console.warn(`[insights] Missing posts directory: ${postsDir}`);
    return [];
  }

  return fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const filePath = path.join(postsDir, name);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const slug = name.replace(/\.md$/, "");
      const date = data.date ? new Date(data.date) : new Date();
      return {
        ...data,
        slug,
        date,
        content,
        html: md.render(content),
        url: `/insights/${slug}/`,
        inputPath: filePath,
      };
    })
    .sort((a, b) => b.date - a.date);
}

function loadTeamMembers() {
  const teamDir = path.join(siteContentDir, "team");
  if (!fs.existsSync(teamDir)) {
    console.warn(`[team] Missing team directory: ${teamDir}`);
    return [];
  }

  return fs
    .readdirSync(teamDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const filePath = path.join(teamDir, name);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const image = data.image || "/assets/img/team/team-1.jpg";
      // Homepage uses root-relative-without-leading-slash paths
      const imageSrc = image.replace(/^\//, "");
      return {
        slug: name.replace(/\.md$/, ""),
        name: data.name || "Team member",
        role: data.role || "",
        image,
        imageSrc,
        order: Number(data.order) || 99,
        bio: content.replace(/\r?\n/g, " ").trim(),
      };
    })
    .sort((a, b) => a.order - b.order);
}

function injectTeamIntoHomepage(fragmentHtml) {
  const indexPath = path.join(root, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("[team] index.html not found — skip team inject");
    return;
  }

  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const pattern =
    /<!-- ======= Team Section ======= -->[\s\S]*?<!-- End Team Section -->/;
  if (!pattern.test(indexHtml)) {
    console.warn("[team] Team section markers not found in index.html");
    return;
  }

  const indented = fragmentHtml
    .trim()
    .split("\n")
    .map((line, i) => (i === 0 ? line : `         ${line}`))
    .join("\n");

  const next = indexHtml.replace(
    pattern,
    `<!-- ======= Team Section ======= -->\n         ${indented}\n         <!-- End Team Section -->`
  );
  fs.writeFileSync(indexPath, next);
  console.log(`[team] Injected ${loadTeamMembers().length} members into index.html`);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    [path.join(contentDir, "media")]: "insights/media",
  });

  eleventyConfig.addPassthroughCopy({
    [path.join(contentDir, "admin")]: "admin",
  });

  // site-admin/ already lives at repo root (owners-only Decap) — no passthrough needed.

  const posts = loadPosts();
  const teamMembers = loadTeamMembers();
  eleventyConfig.addGlobalData("insightsPosts", posts);
  eleventyConfig.addGlobalData("teamMembers", teamMembers);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateObj));
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  eleventyConfig.addGlobalData("site", {
    name: "N. Betharia & Associates",
    tagline: "Chartered Accountants",
    url: "https://www.nbetharia.in",
    email: "ca.nbetharia@gmail.com",
    phone: "+91 712 2777 044",
  });

  eleventyConfig.addWatchTarget(path.join(contentDir, "posts"));
  eleventyConfig.addWatchTarget(path.join(contentDir, "media"));
  eleventyConfig.addWatchTarget(path.join(contentDir, "admin"));
  eleventyConfig.addWatchTarget(path.join(siteContentDir, "team"));
  // site-admin is static at repo root; watch for local rebuild convenience
  if (fs.existsSync(path.join(root, "site-admin"))) {
    eleventyConfig.addWatchTarget(path.join(root, "site-admin"));
  }

  eleventyConfig.on("eleventy.after", () => {
    const injectPath = path.join(root, "eleventy-team-inject.html");
    if (!fs.existsSync(injectPath)) {
      console.warn("[team] Inject fragment missing — was team-fragment.njk built?");
      return;
    }
    const fragment = fs.readFileSync(injectPath, "utf8");
    injectTeamIntoHomepage(fragment);
    fs.unlinkSync(injectPath);
  });

  return {
    dir: {
      input: path.join(__dirname),
      includes: "_includes",
      layouts: "_layouts",
      output: path.join(root),
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
