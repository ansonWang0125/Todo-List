import { Sequelize, Model, DataTypes } from 'sequelize';

const defineTaskModel = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const User = sequelize.define<Model<any>>('Tasks', {
    task: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    createTime: {
        type: dataTypes.DATE,
        allowNull: true,
        unique: false,
      },
    dueTime: {
      type: dataTypes.DATE,
      allowNull: true,
      unique: false,
    },
  }, { timestamps: false });

  return User;
};

export default defineTaskModel;
