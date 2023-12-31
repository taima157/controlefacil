import { ReactNode, createContext, useEffect, useState } from "react";
import { ControlContextType, Spent } from "../types/control";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import useStorage from "../hooks/useStorage";

type ProviderProps = {
  children: ReactNode;
};

type LocalStorageType = {
  monthlyIncome: number;
  spendList: Array<Spent>;
};

export const ControlContext = createContext<ControlContextType>({
  monthlyIncome: 0,
  selectedMonth: "",
  setSelectedMonth: () => {},
  monthlySpendList: [],
  totalExpenses: 0,
  addSpent: () => {},
  removeSpent: () => {},
  updateMonthyIncome: () => {},
});

export function ControleProvider({ children }: ProviderProps) {
  const storage = useStorage();

  const currentMonth = moment().format("MMMM YYYY");

  const [monthlyIncome, setMonthyIncome] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [monthlySpendList, setMonthlySpendList] = useState<Array<Spent>>([]);

  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  function addSpent(
    spent: Spent,
    initialInstallmentDate?: string,
    numberOfInstallment?: number
  ) {
    const data = storage.get<LocalStorageType>("data");

    if (data) {
      let spentId = uuidv4();

      if (spent.always) {
        spent.id = spentId;

        data.spendList.push(spent);
        storage.add("data", data);
        updateMonthlySpendList();

        return;
      }

      if (spent.type === "debit") {
        spent.id = spentId;
        spent.date = moment(new Date()).format();

        data.spendList.push(spent);
      } else {
        if (initialInstallmentDate && numberOfInstallment) {
          const installmentPrice = spent.price / numberOfInstallment;

          for (let i = 0; i < numberOfInstallment; i++) {
            const handleSpent = { ...spent };
            spentId = uuidv4();
            handleSpent.id = spentId;
            handleSpent.price = installmentPrice;

            if (i === 0) {
              handleSpent.date = moment(initialInstallmentDate).format();
              data.spendList.push(handleSpent);
            } else {
              handleSpent.date = moment(initialInstallmentDate)
                .add(i, "month")
                .format();
              data.spendList.push(handleSpent);
            }
          }
        }
      }

      storage.add("data", data);
      updateMonthlySpendList();
    }
  }

  function removeSpent(id: string) {
    const data = storage.get<LocalStorageType>("data");

    if (data) {
      const filteredSpendList = data.spendList.filter((spent) => {
        if (spent.id !== id) {
          return spent;
        }
      });

      data.spendList = filteredSpendList;
      storage.add("data", data);
      updateMonthlySpendList();
    }
  }

  function updateMonthyIncome(value: number) {
    const data = storage.get<LocalStorageType>("data");

    if (data) {
      data.monthlyIncome = value;

      setMonthyIncome(value);
      storage.add("data", data);
    }
  }

  function updateMonthlySpendList() {
    const data = storage.get<LocalStorageType>("data");

    if (data) {
      let handleTotalExpenses = 0;

      const filteredSpendList = data.spendList.filter((spent) => {
        const spentMonth = moment(spent.date).format("MMMM YYYY");

        if (spentMonth === selectedMonth || spent.always) {
          handleTotalExpenses += spent.price;
          return spent;
        }
      });

      setMonthlySpendList(filteredSpendList);
      setTotalExpenses(handleTotalExpenses);
    }
  }

  function getStorageData() {
    const data = storage.get<LocalStorageType>("data");

    if (data) {
      setMonthyIncome(data.monthlyIncome);
    } else {
      storage.add("data", {
        monthlyIncome: 0,
        spendList: [],
      });
    }
  }

  useEffect(() => {
    getStorageData();
  }, []); // eslint-disable-line

  useEffect(() => {
    updateMonthlySpendList();
  }, [selectedMonth]); // eslint-disable-line

  return (
    <ControlContext.Provider
      value={{
        monthlyIncome,
        selectedMonth,
        setSelectedMonth,
        monthlySpendList,
        totalExpenses,
        addSpent,
        removeSpent,
        updateMonthyIncome,
      }}
    >
      {children}
    </ControlContext.Provider>
  );
}
