import { body, query, validationResult } from "express-validator";
import userModel from "../../../user-service/src/models/userModel.js";
import productModel from "../models/productModel.js";
export const createProduct = [
  query("userId")
    .notEmpty()
    .isMongoId()
    .withMessage("id do usuário inválido")
    .bail(),
  body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Preencha o campo nome corretamente")
    .bail(),
  body("price")
    .notEmpty()
    .isNumeric()
    .isFloat({ gt: 0 }) // Maior que zero
    .withMessage("Preencha o campo preço corretamente")
    .bail(),
  body("category")
    .notEmpty()
    .isArray()
    .isLength({ min: 1, max: 5 })
    .withMessage("Preencha o campo categoria corretamente")
    .bail(),
  body("stock")
    .notEmpty()
    .isNumeric()
    .isInt()
    .withMessage("Preencha o campo estoque corretamente")
    .bail(),
  body("description")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 150 })
    .withMessage("Preencha o campo descrição corretamente")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { userId } = req.query;
    const { name, price, category, stock, description } = req.body;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(400)
          .json({ error: "Não foi possível localizar o usuário" });
      }
      if (user.blocked === true) {
        return res.status(403).json({ error: "Esse usuário está bloqueado" });
      }

      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para prosseguir" });
      }

      await productModel.create({
        userId,
        name,
        price,
        category,
        stock,
        description,
      });

      res.status(201).json({ msg: "Produto criado com sucesso!" });
    } catch (error) {
      res.status(500).json({
        error: "Não foi possível criar um novo produto.",
        details: error.message,
      });
    }
  },
];
