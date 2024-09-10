export const calculateTotals = ({ price }: { price: number }) => {
  const tax = price * 0.1; // 10% tax on the subtotal
  const orderTotal = price + tax; // Total order amount

  return { tax, orderTotal };
};
