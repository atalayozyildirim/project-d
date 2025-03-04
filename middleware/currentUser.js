import jwt from "jsonwebtoken";

const currentUser = (req, res, next) => {
  console.log(req.cookies.acsess_token);
  if (!req.cookies.acsess_token) {
    return res.status(401).send({ message: "Not authorized" });
  }
  try {
    const token = req.cookies.acsess_token.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = payload;
  } catch {
    return res.status(401).send({ message: "Not authorized" });
  }
  next();
};

export { currentUser };
