import { Dispatch, SetStateAction } from "react";

export type Spent = {
  id: string;
  title: string;
  price: number;
  date: string;
  type: "credit" | "debit";
  always: boolean;
};

export type ControlContextType = {
  monthlyIncome: number;
  selectedMonth: string;
  setSelectedMonth: Dispatch<SetStateAction<string>>;
  monthlySpendList: Array<Spent>;
  totalExpenses: number;
  addSpent: (
    spent: Spent,
    initialInstallmentDate?: string,
    numberOfInstallment?: number
  ) => void;
  removeSpent: (id: string) => void;
  updateMonthyIncome: (value: number) => void;
};
