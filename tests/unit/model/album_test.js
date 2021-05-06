import Album from "model/album";
import MockAdapter from "axios-mock-adapter";
import Api from "common/api";

import {Settings} from "luxon";
Settings.defaultLocale = "en"
Settings.defaultZoneName = "UTC"

let chai = require("chai/chai");
let assert = chai.assert;

const mock = new MockAdapter(Api);

mock
    .onPost().reply(200)
    .onDelete().reply(200);

describe("model/album", () => {
    it("should get route view",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019"};
        const album = new Album(values);
        const result = album.route("test");
        assert.equal(result.name, "test");
        assert.equal(result.params.slug, "christmas-2019");
    });

    it("should return classes",  () => {
        const values = {UID: 5, Title: "Christmas 2019", Slug: "christmas-2019", Type: "moment", Favorite: true, Private: true};
        const album = new Album(values);
        const result = album.classes(true);
        assert.include(result, "is-album");
        assert.include(result, "uid-5");
        assert.include(result, "type-moment");
        assert.include(result, "is-selected");
        assert.include(result, "is-favorite");
        assert.include(result, "is-private");
    });

    it("should get album entity name",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019"};
        const album = new Album(values);
        const result = album.getEntityName();
        assert.equal(result, "christmas-2019");
    });

    it("should get album id",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019", UID: 66};
        const album = new Album(values);
        const result = album.getId();
        assert.equal(result, "66");
    });

    it("should get album title",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019"};
        const album = new Album(values);
        const result = album.getTitle();
        assert.equal(result, "Christmas 2019");
    });

    it("should get thumbnail url",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019", UID: 66};
        const album = new Album(values);
        const result = album.thumbnailUrl("xyz");
        assert.equal(result, "/api/v1/albums/66/t/public/xyz");
    });

    it("should get created date string",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z"};
        const album = new Album(values);
        const result = album.getCreatedString();
        assert.equal(result, "Jul 8, 2012, 2:45 PM");
    });

    it("should get album date string with invalid day",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z", Day: -1, Month: 5, Year: 2019};
        const album = new Album(values);
        const result = album.getDateString();
        assert.equal(result, "May 2019");
    });

    it("should get album date string with invalid year",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z", Day: 1, Month: 5, Year: 800};
        const album = new Album(values);
        const result = album.getDateString();
        assert.equal(result, "Unknown");
    });

    it("should get day string",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z", Day: 8, Month: 5, Year: 2019};
        const album = new Album(values);
        const result = album.dayString();
        assert.equal(result, "08");
    });

    it("should get month string",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z", Day: 8, Month: -5, Year: 2019};
        const album = new Album(values);
        const result = album.monthString();
        assert.equal(result, "01");
    });

    it("should get year string",  () => {
        const values = {ID: 5, Title: "Christmas 2019", Slug: "christmas-2019", CreatedAt: "2012-07-08T14:45:39Z", Day: 8, Month: -5, Year: 800};
        const album = new Album(values);
        const result = album.yearString();
        assert.equal(result, new Date().getFullYear().toString().padStart(4, "0"));
    });

    it("should get model name",  () => {
        const result = Album.getModelName();
        assert.equal(result, "Album");
    });

    it("should get collection resource",  () => {
        const result = Album.getCollectionResource();
        assert.equal(result, "albums");
    });

    it("should return batch size",  () => {
        assert.equal(Album.batchSize(), 24);
    });

    it("should like album",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019", Favorite: false};
        const album = new Album(values);
        assert.equal(album.Favorite, false);
        album.like();
        assert.equal(album.Favorite, true);
    });

    it("should unlike album",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019", Favorite: true};
        const album = new Album(values);
        assert.equal(album.Favorite, true);
        album.unlike();
        assert.equal(album.Favorite, false);
    });

    it("should toggle like",  () => {
        const values = {id: 5, Title: "Christmas 2019", Slug: "christmas-2019", Favorite: true};
        const album = new Album(values);
        assert.equal(album.Favorite, true);
        album.toggleLike();
        assert.equal(album.Favorite, false);
        album.toggleLike();
        assert.equal(album.Favorite, true);
    });
});
