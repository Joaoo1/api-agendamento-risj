import Sequelize from 'sequelize';

import dbConfig from '../config/database';

import User from '../app/models/User';
import AdminUser from '../app/models/AdminUser';
import Appointment from '../app/models/Appointment';
import Schedule from '../app/models/Schedule';
import Holiday from '../app/models/Holiday';

const models = [User, Appointment, Schedule, AdminUser, Holiday];

const Database = () => {
  const connection = new Sequelize(dbConfig);
  models.map((model) => model.init(connection));
  models.map((model) => model.associate && model.associate(connection.models));
};

export default Database();
