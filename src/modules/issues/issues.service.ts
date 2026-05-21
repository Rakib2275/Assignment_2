import { pool } from "../../db";

const createIssueIntoDB = async (
  payload: {
    title: string;
    description: string;
    type: string;
  },
  reporter_id: number
) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues
    (
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
    RETURNING *
    `,
    [title, description, type, "open", reporter_id]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
};