import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canonicalStoryUrl, canonicalDomain } from "./urls.ts";

describe("canonicalStoryUrl", () => {
	it("lowercases host and strips www", () => {
		assert.equal(
			canonicalStoryUrl("https://WWW.Example.com/Story"),
			"example.com/Story",
		);
	});

	it("drops tracking params but keeps real ones", () => {
		assert.equal(
			canonicalStoryUrl(
				"https://example.com/a?utm_source=x&fbclid=y&page=2",
			),
			"example.com/a?page=2",
		);
	});

	it("drops fragments and trailing slashes", () => {
		assert.equal(
			canonicalStoryUrl("https://example.com/a/b/#section"),
			"example.com/a/b",
		);
	});

	it("rejects non-http URLs", () => {
		assert.equal(canonicalStoryUrl("ftp://example.com/a"), null);
		assert.equal(canonicalStoryUrl("not a url"), null);
	});
});

describe("canonicalDomain", () => {
	it("normalizes domains and URLs", () => {
		assert.equal(canonicalDomain("WWW.Example.COM"), "example.com");
		assert.equal(
			canonicalDomain("https://news.example.com/path"),
			"news.example.com",
		);
		assert.equal(canonicalDomain("localhost"), null);
	});
});
