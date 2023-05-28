import { Request, Response } from "express";
import { pool } from '../Clients/pool'

interface User {
    userName: string;
    password: string;
    id: number;
}

interface AuthenticatedRequest extends Request {
    token?: string;
    user?: User;
}

const showAllTask = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
        SELECT "Tasks"."id" as "taskID", "Tasks"."task" as "task", "Tasks"."createTime" as "createTime", "Tasks"."dueTime" as "dueTime", "Tasks"."state" as "state", "Users"."userName" as "creator"
        FROM "Tasks" LEFT JOIN "Users" ON "Users"."id" = "Tasks"."userID"
    `;
    try {
       const { rows } = await pool.query(query)
    //    console.log(rows)
       return res.status(200).send(rows);
    } catch (err) {
        console.log('search creator error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const searchByCreator = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
        SELECT "Tasks"."id" as "taskID", "Tasks"."task" as "task", "Tasks"."createTime" as "createTime", "Tasks"."dueTime" as "dueTime", "Tasks"."state" as "state", "Users"."userName" as "creator"
        FROM "Tasks"
        LEFT JOIN "Users" ON "Users"."id" = "Tasks"."userID"
        WHERE "Users"."userName" LIKE '%' || $1 || '%';
    `;
    try {
       const { creator } = req.query.data as { creator: string };
       const values = [creator]
    //    console.log(creator)
       const { rows } = await pool.query(query, values)
    //    console.log(rows)
       return res.status(200).send(rows);
    } catch (err) {
        console.log('search creator error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};


const searchByTask = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
                SELECT "Tasks"."id" as "taskID", "Tasks"."task" as "task", "Tasks"."createTime" as "createTime", "Tasks"."dueTime" as "dueTime", "Tasks"."state" as "state", "Users"."userName" as "creator"
                FROM "Tasks" LEFT JOIN "Users" ON "Users"."id" = "Tasks"."userID"  
                WHERE "Tasks"."task" LIKE '%' || $1 || '%';
            `;
    try {
        const { task } = req.query.data as { task: string };
        const values = [task]
        console.log(task)
        const { rows } = await pool.query(query, values)
        console.log(rows)
        return res.status(200).send(rows);
    } catch (err) {
        console.log(' search task error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const searchByTime = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
                SELECT "Tasks"."id" as "taskID", "Tasks"."task" as "task", "Tasks"."createTime" as "createTime",
                "Tasks"."dueTime" as "dueTime", "Tasks"."state" as "state", "Users"."userName" as "creator"
                FROM "Tasks"
                LEFT JOIN "Users" ON "Users"."id" = "Tasks"."userID"
                WHERE "dueTime" >= $1::date AND "dueTime" < ($2::date + INTERVAL '1 day');
            `;
    try {
        const { start, end } = req.query.data as { start: string, end: string };
        const values = [start, end]
        const { rows } = await pool.query(query, values)
        return res.status(200).send(rows);
    } catch (err) {
        console.log(' search time error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const createTask = async (req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
        INSERT INTO "Tasks" ("task", "createTime", "dueTime", "state", "userID")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const query1 = `
        INSERT INTO "Comments" ("content", "createTime", "userID", "taskID")
        VALUES ($1, $2, $3, $4);
    `;
    try {
        const { task, createTime, dueTime } = req.body;
        const { userName, id } = req.user; // Assuming user property is set by authentication middleware
        const values = [task, new Date(createTime), new Date(dueTime), 'todo', id];
        // console.log(new Date(createTime))
        const { rows } = await pool.query(query, values);
        // console.log(rows);
        const values1 = [`${userName} created the task`, createTime, id, rows[0].id]; // Access the inserted row's ID
        await pool.query(query1, values1);
        return res.status(200).send({ id: rows[0].id});
    } catch (err) {
        console.log('create task error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};


const deleteTask = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const checkQuery = `SELECT "id" FROM "Tasks"`
    const deleteQuery = `
                DELETE FROM "Tasks"
                WHERE id = ANY($1::int[]);
            `;
    try {
        const { taskIDs } = req.body;
        const {rows} = await pool.query(checkQuery)
        const allArticles = rows.map(row => {return (row.id)})
        const valid = taskIDs.every((val: number) => allArticles.includes(val));
        if ( valid ) {
            const values = [taskIDs]
            await pool.query(deleteQuery, values)
            return res.status(200).send({message: "success"});
        } else {
            return res.status(400).send({message: "false"});
        }
    } catch (err) {
        console.log(' delete task error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const completeTask = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const checkQuery = `SELECT "id" FROM "Tasks"`
    const updateQuery = `
        UPDATE "Tasks"
        SET "state" = $1
        WHERE id = ANY($2::int[]);
        `;
    try {
        const { taskIDs } = req.body;
        const {rows} = await pool.query(checkQuery)
        const allArticles = rows.map(row => {return (row.id)})
        const valid = taskIDs.every((val: number) => allArticles.includes(val));
        if ( valid ) {
            const values = ['done', taskIDs]
            console.log(taskIDs)
            await pool.query(updateQuery, values)
            return res.status(200).send({message: "success"});
        } else {
            return res.status(400).send({message: "false"});
        }
    } catch (err) {
        console.log(' update task error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const updateTask = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const query = `
                UPDATE "Tasks"
                SET "task" = $1, "dueTime" = $2
                WHERE id=$3;
            `;
    try {
        const { task, dueTime, taskID } = req.body;
        const values = [task, new Date(dueTime), taskID]
        console.log(new Date(dueTime))
        await pool.query(query, values)
        res.status(200).send({message: "success"});
    } catch (err) {
        console.log(' update task error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

export { 
    showAllTask,
    searchByCreator, 
    searchByTask, 
    searchByTime, 
    createTask, 
    deleteTask, 
    updateTask,
    completeTask 
};
