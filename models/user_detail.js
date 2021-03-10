module.exports = (sequelize, DataTypes) => {
    const user_detail = sequelize.define('user_detail', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        contact_number: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        create_date_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    return user_detail;
}