module.exports = app => {
    const { STRING, INTEGER,TEXT } = app.Sequelize;

    const Collection = app.model.define('collection', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: STRING(50),
            allowNull: false
        },
        code: {
            type: INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Collection.associate = function (){
        app.model.Collection.belongsTo(app.model.User, {foreignKey: 'userid', targetKey: 'userid'});
    }

    return Collection;
}