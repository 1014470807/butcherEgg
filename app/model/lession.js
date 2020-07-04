module.exports = app => {
    const { INTEGER, STRING } = app.Sequelize;

    const Lession = app.model.define('lession', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: STRING,
            allowNull: false
        }
    });

    Lession.associate = function(){
        // 与student表是多对多关系
        app.model.Lession.belongsToMany(app.model.Student, {
            through: app.model.LessionStudent,
            foreignKey: 'lessionId',
            otherKey: 'studentId'
        });
    }

    return Lession;
}
