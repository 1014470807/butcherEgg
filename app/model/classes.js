module.exports = app => {
    const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

    const Classes = app.model.define('classes', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: STRING(50),
            allowNull: false,
        }
    });

    Classes.associate = function (){
        // classes与student是一对多关系，所以这里使用hasMany()
        app.model.Classes.hasMany(app.model.Student, {foreignKey: 'classId', targetKey: 'id'});
    }

    return Classes;
}
