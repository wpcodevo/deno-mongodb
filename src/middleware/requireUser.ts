import { User } from "../models/user.model.ts";
import { ObjectId } from "../deps.ts";
import type { Context } from "../deps.ts";
import { verifyJwt } from "../utils/jwt.ts";

const requireUser = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");
    const cookieToken = await ctx.cookies.get("access_token");
    let access_token;

    if (authorization) {
      access_token = authorization.split(" ")[1];
    } else if (cookieToken) {
      access_token = cookieToken;
    }

    if (!access_token) {
      ctx.response.status = 401;
      ctx.response.body = {
        status: "fail",
        message: "You are not logged in",
      };
      return;
    }

    const decoded = await verifyJwt<{ sub: string }>({
      token: access_token,
      base64PublicKeyPem: "accessTokenPublicKey",
    });

    if (!decoded) {
      ctx.response.status = 401;
      ctx.response.body = {
        status: "fail",
        message: "Token is invalid or session has expired",
      };
      return;
    }

    const userExists = await User.findOne({ _id: new ObjectId(decoded?.sub) });

    if (!userExists) {
      ctx.response.status = 401;
      ctx.response.body = {
        status: "fail",
        message: "The user belonging to this token no longer exists",
      };
      return;
    }

    ctx.state["userId"] = userExists._id;
    await next();
    delete ctx.state.userId;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      status: "fail",
      message: error.message,
    };
  }
};

export default requireUser;
