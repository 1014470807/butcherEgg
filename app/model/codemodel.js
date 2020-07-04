module.exports = app => {
    const { INTEGER, STRING,TEXT } = app.Sequelize;

    const codemodel = app.model.define('codemodel', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: STRING(6),
        },
        codeName: {
            type: STRING(30),
        },
        continuityDay: {
            type: STRING(4),
        },
        industry: {
            type: STRING(30),
        },
        type: {
            type: STRING(10),
        }
    }, {
        timestamps: false
    }
    );

    codemodel.associate = function(){

    }

    return codemodel;
}