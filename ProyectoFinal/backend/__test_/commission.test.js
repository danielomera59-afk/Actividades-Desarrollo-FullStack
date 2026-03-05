const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../testApp");

describe("Commissions tests", () => {
  let adminToken;
  let userToken;
  let createdId;
  let userId;

  const rnd = Math.floor(Math.random() * 1000000);
  const admin = { username: `admin_${rnd}`, password: "123456", role: "admin" };
  const user = { username: `user_${rnd}`, password: "123456", role: "user" };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(admin);
    await request(app).post("/api/auth/register").send(user);

    const adminLogin = await request(app).post("/api/auth/login").send({ username: admin.username, password: admin.password });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app).post("/api/auth/login").send({ username: user.username, password: user.password });
    userToken = userLogin.body.token;

    // sacamos id del token sin verificar (solo decode)
    userId = jwt.decode(userToken).id;
  });

  test("User puede crear comisión", async () => {
    const res = await request(app)
      .post("/api/commissions")
      .set("Authorization", `Bearer ${userToken}`)
      .field("email", "cliente@mail.com")
      .field("description", "Una comisión de prueba")
      .field("artistKey", "luna")
      .field("commissionType", "bust")
      .field("priority", "normal")
      .field("deadline", "2026-03-08");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  test("Validación fallida al crear (email malo) devuelve 400", async () => {
    const res = await request(app)
      .post("/api/commissions")
      .set("Authorization", `Bearer ${userToken}`)
      .field("email", "noesemail")
      .field("description", "Descripción válida")
      .field("artistKey", "luna");

    expect(res.statusCode).toBe(400);
  });

  test("User lista comisiones (paginación)", async () => {
    const res = await request(app)
      .get("/api/commissions?page=1&limit=10")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);

    // No debe regresar más que el límite
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });

  test("Filtro por status funciona (no truena)", async () => {
    const res = await request(app)
      .get("/api/commissions?page=1&limit=10&status=pending")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("User NO puede cambiar status (403)", async () => {
    const res = await request(app)
      .patch(`/api/commissions/${createdId}/status`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "accepted" });

    expect(res.statusCode).toBe(403);
  });

  test("Admin SÍ puede cambiar status (200)", async () => {
    const res = await request(app)
      .patch(`/api/commissions/${createdId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "accepted" });

    expect(res.statusCode).toBe(200);
  });

  test("Admin puede eliminar comisión (200) y luego GET da 404", async () => {
    const del = await request(app)
      .delete(`/api/commissions/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(del.statusCode).toBe(200);

    const get = await request(app)
      .get(`/api/commissions/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(get.statusCode).toBe(404);
  });
});
