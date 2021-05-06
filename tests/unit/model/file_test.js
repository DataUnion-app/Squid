import File from "model/file";
import MockAdapter from "axios-mock-adapter";
import Api from "common/api";
import {Settings} from "luxon";
Settings.defaultLocale = "en"
Settings.defaultZoneName = "UTC"

let chai = require("chai/chai");
let assert = chai.assert;

describe("model/file", () => {

    it("should return classes",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Name: "1/2/IMG123.jpg",
            Primary: true,
            Sidecar: true,
            Video: true};
        const file = new File(values);
        const result = file.classes(true);
        assert.include(result, "is-file");
        assert.include(result, "uid-ABC123");
        assert.include(result, "is-primary");
        assert.include(result, "is-sidecar");
        assert.include(result, "is-video");
        assert.include(result, "is-selected");
    });

    it("should get file defaults",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123"};
        const file = new File(values);
        const result = file.getDefaults();
        assert.equal(result.UID, "");
        assert.equal(result.Size, 0);
    });

    it("should get file base name",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        const result = file.baseName();
        assert.equal(result, "IMG123.jpg");
        const result2 = file.baseName(8);
        assert.equal(result2, "IMG123.…");
    });

    it("should return true",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        assert.equal(file.isFile(), true);
    });

    it("should return entity name",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Root: "",
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        assert.equal(file.getEntityName(), "/1/2/IMG123.jpg");
    });

    it("should return thumbnail url",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        assert.equal(file.thumbnailUrl("tile_224"), "/api/v1/t/54ghtfd/public/tile_224");
        const values2 = {
            InstanceID: 5,
            UID: "ABC123",
            Name: "1/2/IMG123.jpg",
            Error: true};
        const file2 = new File(values2);
        assert.equal(file2.thumbnailUrl("tile_224"), "/api/v1/svg/broken");
        const values3 = {
            InstanceID: 5,
            UID: "ABC123",
            Name: "1/2/IMG123.jpg",
            Type: "raw"};
        const file3 = new File(values3);
        assert.equal(file3.thumbnailUrl("tile_224"), "/api/v1/svg/raw");
    });

    it("should return download url",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        assert.equal(file.getDownloadUrl("abc"), "/api/v1/dl/54ghtfd?t=2lbh9x09");
    });

    it("should calculate size",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Width: 500,
            Height: 700,
            Name: "1/2/IMG123.jpg"};
        const file = new File(values);
        assert.equal(file.calculateSize(600, 800).width,  500);
        assert.equal(file.calculateSize(600, 800).height,  700);
        const values2 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Width: 900,
            Height: 850,
            Name: "1/2/IMG123.jpg"};
        const file2 = new File(values2);
        assert.equal(file2.calculateSize(600, 800).width,  600);
        assert.equal(file2.calculateSize(600, 800).height,  567);
        const values3 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Width: 750,
            Height: 850,
            Name: "1/2/IMG123.jpg"};
        const file3 = new File(values3);
        assert.equal(file3.calculateSize(900, 450).width,  397);
        assert.equal(file3.calculateSize(900, 450).height,  450);
    });

    it("should get date string",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.getDateString(), "Jul 8, 2012, 2:45 PM");
    });

    it("should get info",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.getInfo(), "JPG, 8µs");
    });

    it("should get type info",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.typeInfo(), "JPG");
        const values2 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Name: "1/2/IMG123.jpg",
            Video: true,
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file2 = new File(values2);
        assert.equal(file2.typeInfo(), "Video");
        const values3 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Name: "1/2/IMG123.jpg",
            Sidecar: true,
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file3 = new File(values3);
        assert.equal(file3.typeInfo(), "Sidecar");
    });

    it("should get size info",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Size: 8009,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.sizeInfo(), "7.8 KB");
        const values2 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Size: 8009999987,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file2 = new File(values2);
        assert.equal(file2.sizeInfo(), "7638.9 MB");
        const values3 = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Size: 8009999987,
            Name: "1/2/IMG123.jpg",
            Width: 500,
            Height: 800,
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file3 = new File(values3);
        assert.equal(file3.sizeInfo(), "500 × 800, 7638.9 MB");
    });

    it("should like file",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Favorite: false,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.Favorite, false);
        file.like();
        assert.equal(file.Favorite, true);
    });

    it("should unlike file",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Favorite: true,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.Favorite, true);
        file.unlike();
        assert.equal(file.Favorite, false);
    });

    it("should toggle like",  () => {
        const values = {
            InstanceID: 5,
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Favorite: true,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.Favorite, true);
        file.toggleLike();
        assert.equal(file.Favorite, false);
        file.toggleLike();
        assert.equal(file.Favorite, true);
    });

    it("should get photo resource",  () => {
        const values = {
            InstanceID: 5,
            PhotoUID: "bgad457",
            UID: "ABC123",
            Hash: "54ghtfd",
            Type: "jpg",
            Duration: 8009,
            Favorite: true,
            Name: "1/2/IMG123.jpg",
            CreatedAt: "2012-07-08T14:45:39Z",
            UpdatedAt: "2012-07-08T14:45:39Z",
        };
        const file = new File(values);
        assert.equal(file.getPhotoResource(), "photos/bgad457");
    });

    it("should get collection resource",  () => {
        const result = File.getCollectionResource();
        assert.equal(result, "files");
    });

    it("should get model name",  () => {
        const result = File.getModelName();
        assert.equal(result, "File");
    });

});
