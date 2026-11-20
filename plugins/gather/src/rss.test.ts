import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseFeedItems } from "./rss.ts";

const RSS = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>Test</title>
<item><title><![CDATA[Story One]]></title><link>https://example.com/one?utm_source=rss</link><pubDate>Thu, 20 Nov 2026 10:00:00 GMT</pubDate></item>
<item><title>Story Two &amp; More</title><link>https://example.com/two</link></item>
</channel></rss>`;

const ATOM = `<feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Atom Story</title><link href="https://example.com/atom"/></entry>
</feed>`;

describe("parseFeedItems", () => {
	it("parses RSS2 items with dates and entities", () => {
		const items = parseFeedItems(RSS);
		assert.equal(items.length, 2);
		assert.equal(items[0].title, "Story One");
		assert.equal(items[0].url, "https://example.com/one?utm_source=rss");
		assert.equal(items[0].publishedAt, "2026-11-20T10:00:00.000Z");
		assert.equal(items[1].title, "Story Two & More");
		assert.equal(items[1].publishedAt, null);
	});

	it("parses Atom entries", () => {
		const items = parseFeedItems(ATOM);
		assert.equal(items.length, 1);
		assert.equal(items[0].url, "https://example.com/atom");
	});

	it("dedupes repeat URLs and returns [] for unknown XML", () => {
		assert.equal(parseFeedItems("<html><body>nope</body></html>").length, 0);
	});
});
