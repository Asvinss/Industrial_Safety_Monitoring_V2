'use strict';

module.exports = (sequelize, DataTypes) => {
  const DetectionModel = sequelize.define('DetectionModel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  DetectionModel.associate = function(models) {
    // Define associations here
    DetectionModel.belongsToMany(models.Camera, {
      through: 'CameraDetectionModels',
      foreignKey: 'modelId',
      as: 'cameras'
    });
  };

  return DetectionModel;
};