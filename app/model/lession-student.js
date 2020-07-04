module.exports = app => {
    const { INTEGER } = app.Sequelize;

    const LessionStudent = app.model.define('lession_student', {
        lessionId: {
            type: INTEGER,
            primaryKey: true
        },
        studentId: {
            type: INTEGER,
            primaryKey: true
        }
    });

    LessionStudent.associate = function(){

    }

    return LessionStudent;
}
