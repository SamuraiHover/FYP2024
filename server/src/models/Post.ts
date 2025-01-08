// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/models/Post.ts
// Description       : The model of the post.
import { DataTypes, Model } from 'sequelize';
import { sequelize } from ".";

class Post extends Model {
    id!: number;
    postTitle!: string;
    postContent!: Text;
    postDate!: Date;
    imageUrl?: string;
    userId?: number;
    clubId?: number;
    clubOnly?: boolean;
}

Post.init({
    postTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    clubId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clubs',
            key: 'id'
        }
    },
    clubOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    
    }
},
    {
        sequelize,
        modelName: 'Post',
        tableName: 'Posts',
        timestamps: false
    }
)

export default Post;
module.exports = Post;