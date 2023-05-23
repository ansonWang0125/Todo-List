import { Sequelize, Model, DataTypes } from 'sequelize';

const defineCommentModel = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const User = sequelize.define<Model<any>>('comments', {
    content: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: false,
      defaultValue: ''
    },
    createTime: {
        type: dataTypes.DATE,
        allowNull: true,
        unique: false,
      },
    updateTime: {
      type: dataTypes.DATE,
      allowNull: true,
      unique: false,
    },
  }, { timestamps: false });

  return User;
};

export default defineCommentModel;
