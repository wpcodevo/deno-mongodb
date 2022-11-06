import { ObjectId, RouterContext } from "../deps.ts";
import { Bson } from "../deps.ts";
import type { CreateUserInput, LoginUserInput } from "../schema/user.schema.ts";
import { User } from "../models/user.model.ts";
import { comparePasswords, hashPassword } from "../utils/password.ts";
import { signJwt, verifyJwt } from "../utils/jwt.ts";
import omitFields from "../utils/omitfields.ts";
import config from "../config/default.ts";

// [...] Signup User Controller
const signUpUserController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { name, email, password }: CreateUserInput = await request.body()
      .value;

    const hashedPassword = await hashPassword(password);
    const createdAt = new Date();
    const updatedAt = createdAt;

    const userId: string | Bson.ObjectId = await User.insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      verified: true,
      createdAt,
      updatedAt,
    });

    if (!userId) {
      response.status = 500;
      response.body = { status: "error", message: "Error creating user" };
      return;
    }

    const user = await User.findOne({ _id: userId });

    response.status = 201;
    response.body = {
      status: "success",
      user: omitFields(user, "password", "verified"),
    };
  } catch (error) {
    if ((error.message as string).includes("E11000")) {
      response.status = 409;
      response.body = {
        status: "fail",
        message: "A user with that email already exists",
      };
      return;
    }
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] Signin User Controller
const loginUserController = async ({
  request,
  response,
  cookies,
}: RouterContext<string>) => {
  try {
    const { email, password }: LoginUserInput = await request.body().value;

    const message = "Invalid email or password";
    const userExists = await User.findOne({ email });
    if (
      !userExists ||
      !(await comparePasswords(password, userExists?.password))
    ) {
      response.status = 401;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    const accessTokenExpiresIn = new Date(
      Date.now() + config.accessTokenExpiresIn * 60 * 1000
    );
    const refreshTokenExpiresIn = new Date(
      Date.now() + config.refreshTokenExpiresIn * 60 * 1000
    );

    const access_token = await signJwt({
      user_id: String(userExists._id),
      base64PrivateKeyPem: "accessTokenPrivateKey",
      expiresIn: accessTokenExpiresIn,
      issuer: "codevoweb.com",
    });
    const refresh_token = await signJwt({
      user_id: String(userExists._id),
      base64PrivateKeyPem: "refreshTokenPrivateKey",
      expiresIn: refreshTokenExpiresIn,
      issuer: "codevoweb.com",
    });
    cookies.set("access_token", access_token, {
      expires: accessTokenExpiresIn,
      maxAge: config.accessTokenExpiresIn * 60,
      httpOnly: true,
      secure: false,
    });
    cookies.set("refresh_token", refresh_token, {
      expires: refreshTokenExpiresIn,
      maxAge: config.refreshTokenExpiresIn * 60,
      httpOnly: true,
      secure: false,
    });
    cookies.set("logged_in", "true", {
      expires: accessTokenExpiresIn,
      maxAge: config.accessTokenExpiresIn * 60,
      httpOnly: false,
      secure: false,
    });

    response.status = 200;
    response.body = { status: "success", access_token };
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] Refresh Token Controller
const refreshAccessTokenController = async ({
  response,
  cookies,
}: RouterContext<string>) => {
  try {
    const refresh_token = await cookies.get("refresh_token");

    const message = "Could not refresh access token";

    if (!refresh_token) {
      response.status = 403;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    // Validate refresh token
    const decoded = await verifyJwt<{ sub: string }>({
      token: refresh_token,
      base64PublicKeyPem: "refreshTokenPublicKey",
    });

    if (!decoded) {
      response.status = 403;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    // Check if user still exist
    const user = await User.findOne({ _id: new ObjectId(decoded.sub) });

    if (!user) {
      response.status = 403;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    const accessTokenExpiresIn = new Date(
      Date.now() + config.accessTokenExpiresIn * 60 * 1000
    );

    // Sign new access token
    const access_token = await signJwt({
      user_id: String(user._id),
      issuer: "codevoweb.com",
      base64PrivateKeyPem: "accessTokenPrivateKey",
      expiresIn: accessTokenExpiresIn,
    });

    // 4. Add Cookies
    cookies.set("access_token", access_token, {
      expires: accessTokenExpiresIn,
      maxAge: config.accessTokenExpiresIn * 60,
      httpOnly: true,
      secure: false,
    });
    cookies.set("logged_in", "true", {
      expires: new Date(Date.now() + config.accessTokenExpiresIn * 60 * 1000),
      maxAge: config.accessTokenExpiresIn * 60,
      httpOnly: false,
      secure: false,
    });

    // 5. Send response
    response.status = 200;
    response.body = { status: "success", access_token };
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

// [...] Logout User Controller
const logoutController = ({ response, cookies }: RouterContext<string>) => {
  cookies.set("access_token", "", {
    httpOnly: true,
    secure: false,
    maxAge: -1,
  });
  cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: false,
    maxAge: -1,
  });
  cookies.set("logged_in", "", {
    httpOnly: true,
    secure: false,
    maxAge: -1,
  });

  response.status = 200;
  response.body = { status: "success" };
};
export default {
  signUpUserController,
  loginUserController,
  logoutController,
  refreshAccessTokenController,
};
