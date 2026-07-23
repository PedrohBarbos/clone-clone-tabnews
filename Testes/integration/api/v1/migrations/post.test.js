import database from "infra/database.js";
import orchestrator from "Testes/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const responce1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(responce1.status).toBe(201);

  const response1Body = await responce1.json();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const responce2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(responce2.status).toBe(200);

  const response2Body = await responce2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);
});
