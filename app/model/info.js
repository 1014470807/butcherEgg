module.exports = app => {
    const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

    const Info = app.model.define('info', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: STRING(50),
            allowNull: false,
        },
        age: {
            type: INTEGER,
            allowNull: false
        },
        sex: {
            type: BOOLEAN,
            allowNull: false,
            get() {
                if (this.getDataValue('sex') ){
                    return '男';
                }else {
                    return '女';
                }
            }
        },
        studentId: {
            type: INTEGER,
            allowNull: false
        }
    });

    Info.associate = function (){
        app.model.Info.belongsTo(app.model.Student, {foreignKey: 'studentId', targetKey: 'id'});
    }

    return Info;
}
