module.exports = app => {
    const { INTEGER, STRING,TEXT } = app.Sequelize;

    const Tarticle = app.model.define('t_article', {
        id: {
            type: STRING(255),
            primaryKey: true
        },
        article_title: {
            type: STRING(255),
        },
        article_content: {
            type: TEXT('long'),
        },
        createtime: {
            type: STRING(255),
        },
        article_time: {
            type: STRING(255),
        },
        article_tag: {
            type: STRING(255),
        }
    }, {
        timestamps: false
    }
    );

    Tarticle.associate = function(){

    }

    return Tarticle;
}
