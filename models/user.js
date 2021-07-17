module.exports = (sequelize, Sequelize) => {
    const File = require("./file")(sequelize, Sequelize)
    const User = sequelize.define("user", {
        USER_ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        USER_PARENT: {
            type: Sequelize.BIGINT
        },
        NAME: {
            type: Sequelize.STRING
        },
        NIK: {
            type: Sequelize.STRING
        },
        PASSWORD: {
            type: Sequelize.STRING
        },
        STATUS: {
            type: Sequelize.CHAR
        },
        TYPE: {
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
            type: Sequelize.STRING
        },
        UPDATE_BY: {
            type: Sequelize.STRING
        },
    }, {timestamps: false});
    User.belongsTo(User, {foreignKey: 'USER_PARENT', targetKey: 'USER_ID'});
    User.hasOne(File, {foreignKey: 'PARENT', targetKey: 'USER_ID', as: 'cover'});
    User.hasOne(File, {foreignKey: 'PARENT', targetKey: 'USER_ID', as: 'diri'});
    User.hasOne(File, {foreignKey: 'PARENT', targetKey: 'USER_ID', as: 'ktp'});
    // User.belongsTo(UserInfo, {foreignKey: 'USER_ID', targetKey: 'USER_ID'});
    return User;
};