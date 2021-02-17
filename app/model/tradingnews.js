module.exports = app => {
  const { INTEGER, STRING,TEXT } = app.Sequelize;

  const Tradingnews = app.model.define('tradingnews', {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: TEXT('long'),
      },
      desc: {
        type: TEXT('long'),
      },
      time: {
        type: STRING(30),
      },
      author: {
        type: STRING(30),
      },
      img: {
        type: TEXT('long'),
      },
      status: {
        type: STRING(10),
      }
    }, {
      timestamps: false
    }
  );

  Tradingnews.associate = function(){

  }

  return Tradingnews;
}
