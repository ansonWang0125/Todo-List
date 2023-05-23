import { Sequelize, Model, DataTypes } from 'sequelize';

const defineUserModel = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const User = sequelize.define<Model<any>>('Users', {
    userName: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  }, { timestamps: true });

  return User;
};

export default defineUserModel;
