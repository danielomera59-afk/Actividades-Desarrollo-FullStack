const { validateCommission } = require("../middleware/validator");

describe("Pruebas del Validador de Comisiones", () => {
  test("Debe devolver error 400 si el email no tiene @", () => {
    const req = { body: { email: "correo_invalido", description: "Quiero un dibujo", artistKey: "luna" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateCommission(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("Debe devolver error 400 si falta artistKey", () => {
    const req = { body: { email: "artista@ejemplo.com", description: "Quiero un dibujo" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateCommission(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("Debe llamar a next() si los datos son válidos", () => {
    const req = {
      body: {
        email: "artista@ejemplo.com",
        description: "Quiero un dibujo de mi gato",
        artistKey: "luna",
        commissionType: "bust",
        priority: "normal",
        deadline: "2026-03-08"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateCommission(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});