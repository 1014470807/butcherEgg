module.exports = app => {
  const { STRING, INTEGER,TEXT } = app.Sequelize;

  const Weather = app.model.define('weather', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    avatarUrl: {
      type: STRING(255)
    },
    city: {
      type: STRING(255)
    },
    country: {
      type: STRING(255)
    },
    gender: {
      type: STRING(255)
    },
    language: {
      type: STRING(255)
    },
    nickName: {
      type: STRING(255)
    },
    openId: {
      type: STRING(255)
    },
    province: {
      type: STRING(255)
    },
    unionId: {
      type: STRING(255)
    },
    userId: {
      type: STRING(255)
    },
    weatherLocation: {
      type: STRING(255)
    }
  }, {
    timestamps: false
  });

  Weather.associate = function () {
  };

  return Weather;
};
