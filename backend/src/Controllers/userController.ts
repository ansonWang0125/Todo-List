import db from "../Model";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserInstance } from "../Model/types";
import { generateToken } from "../Service/setToken";

const User = db.users;
const sequelize = db.sequelize;

const login = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        console.log(req.body);
        const { name, password } = req.body;
        const user: UserInstance | null = await User.findOne({
            where: {
                userName: name
            }
        });

        console.log(user)

        if (user !== null) {
            if (user.password !== '') {
                const isSame: boolean = await bcrypt.compare(password, user.password);
                if (isSame) {
                    const auth = {
                        id: user.id,
                        userName: user.email
                    };
                    const token = generateToken(auth)
                    res.setHeader('x-auth-token', token);
                    return res.status(200).send({ name: name });
                } else {
                    console.log("diff")
                    return res.status(400).send({ message: 'Password incorrect' });
                }
            } else if (password !== "") {
                const hashedPassword = await bcrypt.hash(password, 10);
                const data = {
                    password: hashedPassword,
                };
                await User.update( data, { where: { id: user.id }})
                return res.status(200).send({ name: name });
            } else {
                return res.status(200).send({ name: name });
            }
        } else {
            if (password !== "") {
                const hashedPassword = await bcrypt.hash(password, 10);
                const data = {
                    userName: name,
                    password: hashedPassword,
                };
                const newuser = await User.create( data )
                const auth = {
                    id: newuser.id,
                    userName: newuser.email
                };
                const token = generateToken(auth)
                res.setHeader('x-auth-token', token);
                return res.status(200).send({ name: name });
            } else {
                const data = {
                    userName: name
                };
                await User.create( data )
                return res.status(200).send({ name: name });
            }
        }
    } catch (err) {
        console.log('login error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const allUsers = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const users = await User.findAll({
            attributes: [
                'id',
                [sequelize.literal('"userName"'), 'display']
            ]
        })
        console.log(users)
        res.status(200).send({users});
    } catch (err) {
        console.log(' get user error');
        console.log(err);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

export { 
    login,
    allUsers
};
