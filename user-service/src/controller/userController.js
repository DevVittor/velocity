import userModel from "../models/userModel.js";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
export const createUser = [
  body("username")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 32 })
    .withMessage("Preencha o campo username corretamente")
    .bail(),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Preencha o campo email corretamente")
    .bail(),
  body("password")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage("Preencha o campo senha corretamente")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(403).json({ error: "Esse email já foi cadastrado" });
      }
      const createPasswordWithHash = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        username,
        email,
        password: createPasswordWithHash,
      });

      const payload = {
        _id: newUser._id,
        role: newUser.role,
      };

      const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
      });

      const sevenDays = 1000 * 60 * 60 * 24 * 7;

      const cookieOptions = {
        httpOnly: true,
        maxAge: sevenDays,
        secure: false,
      };

      res
        .status(201)
        .cookie("access_token", `Bearer ${token}`, cookieOptions)
        .json({ msg: "Usuário criado", token });
    } catch (error) {
      res.status(500).json({
        error: "Não foi possível criar a conta",
        details: error.message,
      });
    }
  },
];

export const loginUser = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Preencha o campo email corretamente")
    .bail(),
  body("password")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 6, max: 16 })
    .withMessage("Preencha o campo senha corretamente")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Não foi possível localizar o usuário" });
      }
      if (user.blocked === true) {
        return res.status(403).json({ error: "Usuário bloqueado" });
      }

      const verifyPasswordWithHash = await bcrypt.compare(
        password,
        user.password
      );
      if (!verifyPasswordWithHash) {
        return res.status(403).json({ error: "Senha inválida" });
      }

      const payload = {
        _id: user._id,
        role: user.role,
      };

      const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
      });

      const sevenDays = 1000 * 60 * 60 * 24 * 7;

      const cookieOptions = {
        httpOnly: true,
        maxAge: sevenDays,
        secure: false,
      };

      res
        .status(200)
        .cookie("access_token", `Bearer ${token}`, cookieOptions)
        .json({ msg: "Login foi feito", token });
    } catch (error) {
      res.status(500).json({
        error: "Não foi possível fazer o login no momento.",
        details: error.message,
      });
    }
  },
];
