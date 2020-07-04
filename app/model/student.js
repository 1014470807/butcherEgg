module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;

    const Student = app.model.define('student', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: STRING,
            allowNull: false,
        },
        password: {
            type: STRING(32),
            allowNull: false
        },
        classId: {
            type: INTEGER,
            allowNull: false
        }
    });

    Student.associate = function (){
        // 与Info存在一对多关系，所以是hasOne()
        app.model.Student.hasOne(app.model.Info, {foreignKey: 'studentId'});
        // 与Classes存在多对一关系，所以使用belongsTo()
        app.model.Student.belongsTo(app.model.Classes, {foreignKey: 'classId', targetKey: 'id'});
        // 与Lessison存在多对多关系，使用belongsToMany()
        app.model.Student.belongsToMany(app.model.Lession, {
            through: app.model.LessionStudent,
            foreignKey: 'studentId',
            otherKey: 'lessionId'
        });
    }

    return Student;
}
