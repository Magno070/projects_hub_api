const mongoose = require("mongoose");
const Partner = require("../models/Partner");
const DiscountTable = require("../models/DiscountTable"); // <-- 1. Importar o modelo para verificação
const { isValidObjectId } = require("../../../utils/validation");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

/**
 * Create a new partner
 * @param {string} name - The name of the partner
 * @param {number} dailyPrice - The daily price of the partner
 * @param {number} clientsAmount - The number of clients of the partner
 * @param {string} discountType - The type of discount of the partner
 * @param {string} discountsTableId - The id of the discounts table of the partner
 * @returns {Promise<Partner>}
 */
const createPartner = async ({
  name,
  dailyPrice,
  clientsAmount,
  discountType,
  discountsTableId,
}) => {
  // Validações rápidas (fora da transação)
  if (!isValidObjectId(discountsTableId)) {
    throw new BadRequestError("Invalid discounts table ID");
  }
  if (typeof dailyPrice !== "number" || dailyPrice <= 0) {
    throw new BadRequestError("Daily price must be a positive number");
  }
  if (typeof clientsAmount !== "number" || clientsAmount <= 0) {
    throw new BadRequestError("Clients amount must be a positive number");
  }
  if (discountType !== "base" && discountType !== "personal") {
    throw new BadRequestError("Discount type must be 'base' or 'personal'");
  }

  // 2. Iniciar a sessão do Mongoose para a transação
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Verificar se a tabela de desconto existe (PONTO 3)
    //    Usamos .session(session) para incluir esta leitura na transação
    const discountTable = await DiscountTable.findById(
      discountsTableId
    ).session(session);
    if (!discountTable) {
      // Usamos NotFoundError, seguindo o padrão do seu discountTable.service
      throw new NotFoundError(
        `Discounts table with ID ${discountsTableId} not found`
      );
    }

    // 4. Verificar parceiro existente (dentro da transação para evitar race conditions)
    const existingPartner = await Partner.findOne({ name }).session(session);
    if (existingPartner) {
      throw new ConflictError(`Partner with name ${name} already exists`);
    }

    // 5. Criar o novo parceiro
    const partner = new Partner({
      name,
      dailyPrice,
      clientsAmount,
      discountType,
      discountsTableId,
    });

    // Usamos .save({ session }) para incluir esta escrita na transação
    await partner.save({ session });

    // 6. Se tudo deu certo, "comitar" a transação
    await session.commitTransaction();
    return partner;
  } catch (error) {
    // 7. Se algo falhou, reverter (abortar) a transação
    await session.abortTransaction();
    throw error; // Re-lança o erro para o errorMiddleware capturar
  } finally {
    // 8. Encerrar a sessão em qualquer cenário (sucesso ou falha)
    session.endSession();
  }
};

module.exports = {
  createPartner,
};
