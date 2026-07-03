export type Currency = {
  code: string;
  symbol: string;
  label: string;
};

export const CURRENCIES: Currency[] = [
  { code: "PHP", symbol: "₱", label: "Philippine Peso" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "KRW", symbol: "₩", label: "Korean Won" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
];

export function formatPrice(
  phpAmount: number,
  currencyCode: string,
  rates: Record<string, number>
): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) return `₱${phpAmount}`;

  const rate = rates[currencyCode] ?? 1;
  const converted = phpAmount * rate;

  const decimals = ["JPY", "KRW"].includes(currencyCode) ? 0 : 2;

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}