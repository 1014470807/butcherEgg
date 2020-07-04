module.exports = app => {
    const { STRING, INTEGER,TEXT } = app.Sequelize;

    const User = app.model.define('user', {
        userid: {
            type: STRING(50),
            primaryKey: true
        },
        account: {
            type: STRING(30),
            allowNull: false,
        },
        password: {
            type: STRING(50),
            allowNull: false,
        },
        username: {
            type: STRING(14),
            allowNull: false,
        },
        phone: {
            type: INTEGER,
            allowNull: false
        },
        experience: {
            type: INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    User.associate = function (){
        app.model.User.hasMany(app.model.Collection, {foreignKey: 'userid'});
    }

    return User;
}