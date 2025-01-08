// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/PostLiked.ts
// Description       : The model of the post liked join table.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";


class PostLiked extends Model {
    userId!: number;
    postId!: number;
}

PostLiked.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Posts',
            key: 'id'
        }
    }
},
    {
        sequelize,
        modelName: 'PostLiked',
        tableName: 'PostLiked',
        timestamps: false
    }
)

export default PostLiked;
module.exports = PostLiked;