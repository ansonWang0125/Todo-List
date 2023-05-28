import { Request, Response } from "express";
import { pool } from '../Clients/pool'

interface Comment {
    content: string;
    createTime: Date;
    user: string;
  }

const searchComment = async (taskID: number): Promise<Comment []> => {
    const query = `
                SELECT "Comments"."content" as "comment", "Comments"."createTime" as "createdtime", "Users"."userName" as "username"
                FROM "Comments" 
                LEFT JOIN "Users" ON "Users"."id" = "Comments"."userID" 
                WHERE "Comments"."taskID" = $1;
            `;
    try {
        const values = [taskID]
        // console.log(taskID)
        const { rows } = await pool.query(query, values)
        // console.log(rows)
        return rows
    } catch (err) {
        console.log('search comment error');
        console.log(err);
    }
};

const addComment = async ( content: string, createTime: string, userID: number, taskID: number ): Promise<void>=> {
    const query = `
                INSERT INTO "Comments" ("content", "createTime", "userID", "taskID")
                VALUES ($1, $2, $3, $4);
            `;
    try {
        const values = [content, createTime, userID, taskID]
        await pool.query(query, values)
    } catch (err) {
        console.log('add comment error');
        console.log(err);
    }
};

export { 
    addComment,
    searchComment
};
