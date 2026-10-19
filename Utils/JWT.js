import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email ,role: user.role }, // payload
    process.env.JWT_SECRET,            // secret key
    { expiresIn: "4h" }                // optional
  );
};

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ detail: 'You are not authenticated!' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


      req.user = decoded;
      next();

  } catch (error) {
    return res.status(401).json({ detail: 'Invalid authentication token' });
  }
};