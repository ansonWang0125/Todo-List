import { Sequelize, Model, DataTypes } from 'sequelize';

const defineCommentModel = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Comment = sequelize.define<Model<any>>('Comments', {
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
  }, { timestamps: false });

  return Comment;
};

export default defineCommentModel;
