export type Money = {
  amount: number;
  currency: "NGN";
};

export function assertPositiveMoney(money: Money) {
  if (!Number.isFinite(money.amount) || money.amount <= 0) {
    throw new Error("Money amount must be a positive finite number.");
  }
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) {
    throw new Error("Cannot add money with different currencies.");
  }

  return {
    amount: left.amount + right.amount,
    currency: left.currency,
  };
}

export function subtractMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) {
    throw new Error("Cannot subtract money with different currencies.");
  }

  return {
    amount: left.amount - right.amount,
    currency: left.currency,
  };
}
