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

const getAllIssuesIntoDB = async (query: any) => {
  const {
    sort = "newest",
    type,
    status,
  } = query;

  const conditions: string[] = [];
  const values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  let sql = `
    SELECT *
    FROM issues
  `;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(sql, values);

  const issues = issuesResult.rows;

  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id)),
  ];

  let reportersMap: any = {};

  if (reporterIds.length > 0) {
    const reportersResult = await pool.query(
      `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
      `,
      [reporterIds]
    );

    reportersMap = reportersResult.rows.reduce(
      (acc: any, reporter: any) => {
        acc[reporter.id] = reporter;
        return acc;
      },
      {}
    );
  }

  const finalData = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reportersMap[issue.reporter_id] || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return finalData;
};

const getSingleIssueIntoDB = async (id: number) => {

  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id]
  );

  const reporter = reporterResult.rows[0];

  const finalData = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter || null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return finalData;
};

const updateIssueIntoDB = async (
  id: number,
  payload: any,
  user: any
) => {

  const { title, description, type } = payload;

  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id]
  );

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  if (user.role === "contributor") {

    if (issue.reporter_id !== user.id) {
      throw new Error(
        "You are not authorized to update this issue"
      );
    }

    if (issue.status !== "open") {
      throw new Error(
        "You can only update open issues"
      );
    }
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (title) {
    values.push(title);
    updates.push(`title = $${values.length}`);
  }

  if (description) {
    values.push(description);
    updates.push(`description = $${values.length}`);
  }

  if (type) {
    values.push(type);
    updates.push(`type = $${values.length}`);
  }

  updates.push(`updated_at = NOW()`);

  if (values.length === 0) {
    throw new Error("No data provided for update");
  }

  values.push(id);

  const query = `
    UPDATE issues
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const updatedIssue = await pool.query(query, values);

  return updatedIssue.rows[0];
};

const deleteIssueIntoDB = async (id: number) => {

  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id=$1`,
    [id]
  );

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  await pool.query(
    `DELETE FROM issues WHERE id=$1`,
    [id]
  );

  return true;
};


export const issueService = {
  createIssueIntoDB,
  getAllIssuesIntoDB,
  getSingleIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueIntoDB
};