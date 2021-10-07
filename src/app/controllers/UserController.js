import ShowUserService from '../services/ShowUserService';

const UserController = {
  async show(req, res) {
    const user = await ShowUserService.run({ cpf: req.params.cpf });
    return res.status(200).json(user);
  },
};

export default UserController;
