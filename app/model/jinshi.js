module.exports = app => {
    const { INTEGER, STRING,TEXT } = app.Sequelize;

    const Jinshi = app.model.define('jinshi', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: TEXT('long'),
        },
        time: {
            type: STRING(30),
        },
        createTime: {
            type: STRING(30),
        }
    }, {
        timestamps: false
    }
    );

    Jinshi.associate = function(){

    }

    return Jinshi;
}
