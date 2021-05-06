import User from "model/user";
import MockAdapter from "axios-mock-adapter";
import Api from "common/api";

let chai = require("chai/chai");
let assert = chai.assert;

describe("model/user", () => {
    const mock = new MockAdapter(Api);

    it("should get entity name",  () => {
        const values = {ID: 5, FullName: "Max Last", PrimaryEmail: "test@test.com", RoleAdmin: true};
        const user = new User(values);
        const result = user.getEntityName();
        assert.equal(result, "Max Last");
    });

    it("should get id",  () => {
        const values = {ID: 5, FullName: "Max Last", PrimaryEmail: "test@test.com", RoleAdmin: true};
        const user = new User(values);
        const result = user.getId();
        assert.equal(result, 5);
    });

    it("should get model name",  () => {
        const result = User.getModelName();
        assert.equal(result, "User");
    });

    it("should get collection resource",  () => {
        const result = User.getCollectionResource();
        assert.equal(result, "users");
    });

   it("should get register form",  async() => {
       mock.onAny("users/52/register").reply(200, "registerForm");
        const values = {ID: 52, FullName: "Max Last"};
        const user = new User(values);
        const result = await user.getRegisterForm();
        assert.equal(result.definition, "registerForm");
       mock.reset();
   });

    it("should get profile form",  async() => {
        mock.onAny("users/53/profile").reply(200, "profileForm");
        const values = {ID: 53, FullName: "Max Last"};
        const user = new User(values);
        const result = await user.getProfileForm();
        assert.equal(result.definition, "profileForm");
        mock.reset();
    });

    it("should get change password",  async() => {
        mock.onPut("users/54/password").reply(200,  {password: "old", new_password: "new"});
        const values = {ID: 54, FullName: "Max Last",  PrimaryEmail: "test@test.com", RoleAdmin: true};
        const user = new User(values);
        const result = await user.changePassword("old", "new");
        assert.equal(result.new_password, "new");
    });

    it("should save profile",  async() => {
        mock.onPost("users/55/profile").reply(200,  {FullName: "Max New",});
        const values = {ID: 55, FullName: "Max Last", PrimaryEmail: "test@test.com", RoleAdmin: true};
        const user = new User(values);
        assert.equal(user.FullName, "Max Last");
        await user.saveProfile();
        assert.equal(user.FullName, "Max New");
    });
});
