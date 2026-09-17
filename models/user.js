import database from "@/infra/database.js";
import {
  ValidationEmailError,
  ValidationUsernameError,
  NotFoundError,
} from "@/infra/errors.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
          SELECT
            *
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT
            1
          ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado.",
        action: "Verifique se o username informado está correto.",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
          SELECT
            email
          FROM
            users
          WHERE
            LOWER(email) = LOWER($1)
          ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationEmailError({
        message: "O email já está sendo utilizado por outro usuário.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
          SELECT
            username
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationUsernameError({
        message: "O username já está sendo utilizado por outro usuário.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
          INSERT INTO 
            users (username, email, password)
          VALUES 
            ($1, $2, $3)
          RETURNING
            *
          ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
