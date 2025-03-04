import jwt from "jsonwebtoken";

const generateJWT = async (id) => {
  if (!id) return null;

  const payload = {
    user: {
      id,
    },
  };

  return await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

const verifyJWT = async (token) => {
  if (!token) return null;

  try {
    return await jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const refreshToken = async (token) => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  const payload = {
    user: {
      id: decoded.user.id,
    },
  };

  return await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
};

export { generateJWT, verifyJWT, refreshToken };
