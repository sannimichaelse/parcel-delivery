import authService from '../services/authService';

/**
 * @exports
 * @class userController
 */
class UserController {
/**
 * Creates a new user
 * @staticmethod
 * @param  {object} req - user object
 * @param {object} res - Response object
 * @return {json} res.json
 */
  static createUser(req, res) {
    authService
      .saveUser(req.body)
      .then(() => res.status(201).json({
        statusMessage: 'New user created successfully',
      }))
      .catch((err) => {
        if (err.rows[0].email) {
          return res.status(400).json({
            statusMessage: `User with this email ${
              err.rows[0].email
            } exists already`,
          });
        }
        return res.status(400).json({
          statusMessage: 'Could not save user',
        });
      });
  }

  /**
 * Creates a new user
 * @staticmethod
 * @param  {object} req - user object
 * @param {object} res - Response object
 * @return {json} res.json
 */
  static loginUser(req, res) {
    const { email, password } = req.body;
    authService
      .validateUserLogin(email, password)
      .then(response => res.status(200).json(response))
      .catch(err => res.status(400).json({
        responseMessage: err,
      }));
  }
}

export default UserController;