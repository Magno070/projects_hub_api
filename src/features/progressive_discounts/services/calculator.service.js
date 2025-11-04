const CalculationLog = require("../models/CalculationLog");
const Partner = require("../models/Partner");
const DiscountTable = require("../models/DiscountTable");

const {
  BadRequestError,
  ConflictError,
  NotFoundError,
} = require("../../../utils/apiError");

const { isValidObjectId } = require("../../../utils/validation");

const calculatePartnerDiscounts = async (partnerId, discountTableId) => {
  if (!isValidObjectId(partnerId))
    throw new BadRequestError("Invalid partner ID");
  if (!isValidObjectId(discountTableId))
    throw new BadRequestError("Invalid discount table ID");

  const partner = await Partner.findById(partnerId);
  if (!partner) throw new NotFoundError("Partner not found");
  const discountTable = await DiscountTable.findById(discountTableId);
  if (!discountTable) throw new NotFoundError("Discount table not found");

  const discountRanges = discountTable.ranges;
  const partnerDailyPrice = partner.dailyPrice;
  const partnerClientsAmount = partner.clientsAmount;

  // Ordena as faixas por initialRange para garantir cálculo progressivo
  const sortedRanges = [...discountRanges].sort(
    (a, b) => a.initialRange - b.initialRange
  );

  let finalValue = 0;
  const details = [];

  // Itera sobre cada faixa de desconto
  for (const range of sortedRanges) {
    // Se a quantidade total de clientes for menor que o início desta faixa,
    // nenhuma diária desta faixa (ou das próximas) será calculada
    if (partnerClientsAmount < range.initialRange) {
      break;
    }

    let itemsInThisRange = 0;

    // Verifica se a quantidade total de clientes ultrapassa ou preenche esta faixa
    if (partnerClientsAmount >= range.finalRange) {
      // Faixa completa: calcula quantos clientes estão nela
      // Ex: Faixa 1-100. (100 - 1 + 1) = 100 clientes
      itemsInThisRange = range.finalRange - range.initialRange + 1;
    } else {
      // Faixa parcial: A quantidade total termina aqui
      // Ex: Faixa 101-200, QtdClientes=150. (150 - 101 + 1) = 50 clientes
      itemsInThisRange = partnerClientsAmount - range.initialRange + 1;
    }

    // Se, por algum motivo (ex: faixas sobrepostas), o cálculo for negativo, pula
    if (itemsInThisRange <= 0) {
      continue;
    }

    // Calcula o valor para esta faixa específica
    // 1. Multiplicador (Ex: 10% de desconto = 0.9)
    const discountMultiplier = 1 - parseFloat(range.discount) / 100;
    // 2. Valor base dos clientes desta faixa (sem desconto)
    const rangeTotalPrice = itemsInThisRange * partnerDailyPrice;
    // 3. Valor com desconto aplicado
    const rangeTotalPriceAfterDiscount = rangeTotalPrice * discountMultiplier;
    // 4. Total de desconto aplicado nesta faixa
    const rangeTotalDiscount = rangeTotalPrice - rangeTotalPriceAfterDiscount;

    // Soma o valor desta faixa (com desconto) ao total
    finalValue += rangeTotalPriceAfterDiscount;

    // Adiciona detalhes desta faixa para o log
    details.push({
      initialRange: range.initialRange,
      finalRange: range.finalRange,
      discount: range.discount,
      rangeTotalClientsAmount: itemsInThisRange,
      rangeTotalPrice: rangeTotalPrice,
      rangeTotalDiscount: rangeTotalDiscount,
      rangeTotalPriceAfterDiscount: rangeTotalPriceAfterDiscount,
    });
  }

  // Calcula totais finais
  const totalPriceResult = partnerClientsAmount * partnerDailyPrice;
  const totalDiscountResult = totalPriceResult - finalValue;
  const totalPriceAfterDiscountResult = finalValue;

  // Cria o log da cálculo
  const calculationLog = new CalculationLog({
    partnerId: partnerId,
    partnerDailyPriceStamp: Number(partnerDailyPrice),
    partnerClientsAmountStamp: Number(partnerClientsAmount),
    discountTableId: discountTableId,
    tableNicknameStamp: discountTable.nickname,
    discountRangesStamp: discountRanges.map((range) => ({
      initialRange: Number(range.initialRange),
      finalRange: Number(range.finalRange),
      discount: Number(range.discount),
    })),
    details: details.map((detail) => ({
      initialRange: Number(detail.initialRange),
      finalRange: Number(detail.finalRange),
      discount: Number(detail.discount),
      rangeTotalClientsAmount: Number(detail.rangeTotalClientsAmount),
      rangeTotalPrice: Number(detail.rangeTotalPrice),
      rangeTotalDiscount: Number(detail.rangeTotalDiscount),
      rangeTotalPriceAfterDiscount: Number(detail.rangeTotalPriceAfterDiscount),
    })),
    totalPriceResult: Number(totalPriceResult),
    totalDiscountResult: Number(totalDiscountResult),
    totalPriceAfterDiscountResult: Number(totalPriceAfterDiscountResult),
  });

  // Salva o log no banco de dados
  await calculationLog.save();

  return calculationLog;
};

module.exports = {
  calculatePartnerDiscounts,
};
