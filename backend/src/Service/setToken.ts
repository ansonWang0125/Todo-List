import { sign } from "jsonwebtoken";
import dotenv from "dotenv-defaults";
dotenv.config();

interface Auth {
    id: number;
    userName: string;
}

const createToken = (auth: Auth) => {
  return sign({
    id: auth.id,
    userName: auth.userName
  }, process.env.secretKey,
  {
    expiresIn: "14d"
  });
};

const generateToken = (auth: Auth) => {
  try {
    const token = createToken(auth);
    return token
  } catch (err) {
    console.log('Generate token failed')
    console.log(err)
  }
};

export {
  generateToken,
};