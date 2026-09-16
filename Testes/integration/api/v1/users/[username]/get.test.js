import { version as uuidVersion } from "uuid";
import orchestrator from "@/Testes/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymos user", () => {
    test("With exact case watch", async () => {
      const responce1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmo.case@example.com",
          password: "password123",
        }),
      });

      expect(responce1.status).toBe(201);

      const responce2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(responce2.status).toBe(200);

      const responce2Body = await responce2.json();

      expect(responce2Body).toEqual({
        id: responce2Body.id,
        username: "MesmoCase",
        email: "mesmo.case@example.com",
        password: "password123",
        created_at: responce2Body.created_at,
        updated_at: responce2Body.updated_at,
      });

      expect(uuidVersion(responce2Body.id)).toBe(4);
      expect(Date.parse(responce2Body.created_at)).not.toBeNaN();
      expect(Date.parse(responce2Body.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const responce1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "Case.Diferente@example.com",
          password: "password123",
        }),
      });

      expect(responce1.status).toBe(201);

      const responce2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(responce2.status).toBe(200);

      const responce2Body = await responce2.json();

      expect(responce2Body).toEqual({
        id: responce2Body.id,
        username: "CaseDiferente",
        email: "Case.Diferente@example.com",
        password: "password123",
        created_at: responce2Body.created_at,
        updated_at: responce2Body.updated_at,
      });

      expect(uuidVersion(responce2Body.id)).toBe(4);
      expect(Date.parse(responce2Body.created_at)).not.toBeNaN();
      expect(Date.parse(responce2Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const responce = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(responce.status).toBe(404);

      const responceBody = await responce.json();

      expect(responceBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado.",
        action: "Verifique se o username informado está correto.",
        statusCode: 404,
      });
    });
  });
});
