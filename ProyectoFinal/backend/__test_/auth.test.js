const request = require("supertest");
const app = require("../testApp");

describe("Auth tests", () => {
  const rnd = Math.floor(Math.random() * 1000000);
  const user = { username: `user_${rnd}`, password: "123456", role: "user" };

  test("Register exitoso", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("Register duplicado devuelve 409", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.statusCode).toBe(409);
  });

  test("Login exitoso", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: user.username, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("role");
  });

  test("Login fallido devuelve 401", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: user.username, password: "malpass" });
    expect(res.statusCode).toBe(401);
  });
});
