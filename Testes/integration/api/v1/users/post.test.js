import { version as uuidVersion } from "uuid";
import orchestrator from "@/Testes/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymos user", () => {
    test("With unique and valid data", async () => {
      const responce = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "PedroHenrique",
          email: "pedro.henrique@example.com",
          password: "password123",
        }),
      });

      expect(responce.status).toBe(201);

      const responseBody = await responce.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "PedroHenrique",
        email: "pedro.henrique@example.com",
        password: "password123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicate 'email'", async () => {
      const responce1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@example.com",
          password: "password123",
        }),
      });

      expect(responce1.status).toBe(201);

      const responce2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@example.com",
          password: "password123",
        }),
      });

      expect(responce2.status).toBe(400);

      const response2Body = await responce2.json();

      expect(response2Body).toEqual({
        name: "ValidationEmailError",
        message: "O email já está sendo utilizado por outro usuário.",
        action: "Utilize outro email para realizar o cadastro.",
        statusCode: 400,
      });
    });

    test("With duplicate 'username'", async () => {
      const responce1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameDuplicado",
          email: "Usernameduplicado@example1.com",
          password: "password123",
        }),
      });

      expect(responce1.status).toBe(201);

      const responce2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "UsernameDuplicado",
          email: "Usernameduplicado@example2.com",
          password: "password123",
        }),
      });

      expect(responce2.status).toBe(400);

      const response2Body = await responce2.json();

      expect(response2Body).toEqual({
        name: "ValidationUsernameError",
        message: "O username já está sendo utilizado por outro usuário.",
        action: "Utilize outro username para realizar o cadastro.",
        statusCode: 400,
      });
    });
  });
});
