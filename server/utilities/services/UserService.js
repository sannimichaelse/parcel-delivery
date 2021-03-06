/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import config from '../../config/index';
import passwordValidator from '../../utilities/ComparePassword';
import queryProvider from '../../utilities/queries';

/**
 * @exports
 * @class UserService
 */
class UserService {
  /**
   * Find user by email
   * @staticmethod
   * @param  {string} email - Request object
   * @return {string} res
   */
  static findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      queryProvider
        .findUserByEmailQuery(email)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
  /**
   * Find user by id
   * @staticmethod
   * @param  {string} id - Request object
   * @return {string} res
   */
  static findUserById(id) {
    return new Promise((resolve, reject) => {
      queryProvider
        .findUserByIdQuery(id)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  /**
   * save new user
   * @staticmethod
   * @param  {string} body - Request object
   * @return {string} res
   */
  static saveUser(body) {
    return new Promise((resolve, reject) => {
      queryProvider
        .saveUserQuery(body)
        .then((response) => {
          const { id, is_admin } = response[0];
          const token = jwt.sign({ user_id: id, is_admin }, config.jwtSecretKey, {
            expiresIn: 86400,
          });
          const data = {
            status: 201,
            message: 'New user created successfully',
            token,
          };
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }
  /**
   * updatePasswordByToken
   * @staticmethod
   * @param  {string} email - newpassword
   *  @param  {string} userpassword - token
   * @return {string} res
   */
  static validateUserLogin(email, userpassword) {
    return new Promise((resolve, reject) => {
      this.findUserByEmail(email)
        .then((res) => {
          const { password, id, is_admin } = res.rows[0];
          passwordValidator
            .compare(userpassword, password)
            .then(() => {
              const token = jwt.sign({ user_id: id, is_admin }, config.jwtSecretKey, {
                expiresIn: 86400,
              });
              const object = {
                firstname: res.rows[0].firstname,
                email: res.rows[0].email,
                username: res.rows[0].username,
              };
              const data = {
                status: 200,
                message: 'Authentication Successful',
                data: object,
                token,
              };
              resolve(data);
            })
            .catch((err) => {
              const response = 'Wrong Password and Email Combination';
              reject(response);
            });
        })
        .catch((err) => {
          const response = 'Wrong Email and Password Combination. Please Check your credentials';
          reject(response);
        });
    });
  }
}

export default UserService;
