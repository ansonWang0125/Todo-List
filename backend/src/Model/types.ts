import { Model, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  userName: string;
  email: string;
  password: string;
  // Add other attributes as needed
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export {
  UserAttributes,
  UserCreationAttributes,
  UserInstance
};
