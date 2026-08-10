const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const root = path.join(__dirname, "..");
const contentDir = process.env.INSIGHTS_CONTENT_DIR
  ? path.resolve(process.env.INSIGHTS_CONTENT_DIR)
  : path.join(root, "insights-content");

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

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    [path.join(contentDir, "media")]: "insights/media",
  });

  eleventyConfig.addPassthroughCopy({
    [path.join(contentDir, "admin")]: "admin",
  });

  const posts = loadPosts();
  eleventyConfig.addGlobalData("insightsPosts", posts);

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
