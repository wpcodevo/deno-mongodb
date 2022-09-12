import type { RouterContext } from '../deps.ts';
import { User } from '../models/user.model.ts';
import omitFields from '../utils/omitfields.ts';

const getMeController = async ({ state, response }: RouterContext<string>) => {
  try {
    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = 401;
      response.body = {
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      };
      return;
    }

    response.status = 200;
    response.body = {
      status: 'success',
      user: omitFields(user, 'password', 'verified'),
     
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      status: 'success',
      message: error.message,
    };
    return;
  }
};

export default { getMeController };
