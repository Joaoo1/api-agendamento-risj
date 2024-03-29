import Sequelize from 'sequelize';

import dbConfig from '../config/database';
import models from '../app/models';

const Database = () => {
  const connection = new Sequelize(dbConfig);
  models.map(model => model.init(connection));
  models.map(model => model.associate && model.associate(connection.models));
};

export default Database();
