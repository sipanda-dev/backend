module.exports = (sequelize, Sequelize) => {
    const User = require("./user.js")(sequelize, Sequelize)
    const File = require("./file.js")(sequelize, Sequelize)
    const Finance = require("./finance.js")(sequelize, Sequelize)
    const Project = sequelize.define("project", {
        PROJECT_ID : {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        USER_ID  : {
            type: Sequelize.BIGINT
        },
        TITLE : {
            type: Sequelize.STRING
        },
        DESCRIPTION : {
            type: Sequelize.TEXT
        },
        LOCATION : {
            type: Sequelize.TEXT
        },
        STATUS : {
            type: Sequelize.CHAR
        },
        CREATE_DATE: {
            type: Sequelize.DATE
        },
        UPDATE_DATE: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        CREATE_BY: {
            type: Sequelize.BIGINT
        },
        UPDATE_BY: {
            type: Sequelize.STRING
        },
    }, {timestamps: false});
    Project.belongsTo(User, {foreignKey: 'USER_ID', targetKey: 'USER_ID'});
    Project.belongsTo(User, {foreignKey: 'CREATE_BY', as:'createdby', targetKey: 'USER_ID'});
    Project.hasMany(File, {foreignKey: 'PARENT', targetKey: 'PROJECT_ID'});
    Project.hasMany(Finance, {foreignKey: 'PARENT', targetKey: 'PROJECT_ID'});
    return Project;
};