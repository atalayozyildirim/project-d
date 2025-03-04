import jwt from "jsonwebtoken";

// atalay ozyildirim :)
const currentUser = (req, res, next) => {
  if (!req.cookies.acsess_token) {
    return res.status(401).send({ message: "Not authorized" });
  }
  try {
    const token = req.cookies.acsess_token.split(" ")[1];

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.currentUser = payload;
  } catch (err) {
    return res.status(401).send({ message: "Not authorized" });
  }
  next();
};

export { currentUser };
