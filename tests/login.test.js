import supertest from "supertest";
import { app } from "../app.js";

describe("login controller", () => {
  test("should return user data on successful login", async () => {
    const resp = await supertest(app).post("/api/users/login").send({
      email: "example@example.com",
      password: "123456",
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.token).toBeDefined();
    expect(resp.body.user).toBeDefined();
    expect(resp.body.user.email).toBe("example@example.com");
    expect(typeof resp.body.user.email).toBe("string");
    expect(typeof resp.body.user.subscription).toBe("string");
  });
});
