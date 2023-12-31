import { FormEvent, useContext, useState } from "react";
import { Spent } from "../types/control";
import { ControlContext } from "../contexts/control";

type PropsType = {
  visible: boolean;
  toggleModal: () => void;
};

const initialSpentValues: Spent = {
  id: "",
  title: "",
  always: false,
  date: "",
  price: 0,
  type: "debit",
};

export default function AddSpentModal({ visible, toggleModal }: PropsType) {
  const { addSpent } = useContext(ControlContext);

  const [spent, setSpent] = useState<Spent>(initialSpentValues);
  const [initialInstallmentDate, setInitialInstallmentDate] =
    useState<string>("");
  const [numberOfInstallment, setNumberOfInstallment] = useState<number>(0);
  const [priceValue, setPriceValue] = useState<string>("");

  function resetInputs() {
    setSpent(initialSpentValues);
    setInitialInstallmentDate("");
    setNumberOfInstallment(0);
    setPriceValue("");
  }

  function handleToggleModal() {
    resetInputs();
    toggleModal();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    spent.price = Number(priceValue);

    if (spent.type === "debit") {
      addSpent(spent);
    } else {
      addSpent(spent, initialInstallmentDate, numberOfInstallment);
    }

    resetInputs();
  }

  if (!visible) {
    return <></>;
  }

  return (
    <div className="absolute inset-0 h-screen w-screen flex items-center justify-center shadow-lg">
      <div
        className="w-full h-full bg-neutral-900/50 absolute"
        onClick={handleToggleModal}
      />
      <div className="z-10 bg-neutral-100 p-5 rounded-md w-11/12 md:w-2/3 xl:w-1/2 flex flex-col gap-10">
        <h1 className="text-2xl font-bold">Adicionar gasto</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col md:flex-row w-full gap-5">
              <div className="w-full md:w-1/2 flex flex-col gap-1">
                <label htmlFor="title" className="font-semibold">
                  Gasto:
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-sm shadow-sm outline-none"
                  id="title"
                  placeholder="Ex: Conta de luz"
                  value={spent.title}
                  onChange={(e) =>
                    setSpent({ ...spent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-1">
                <label htmlFor="price" className="font-semibold">
                  Preço (R$):
                </label>
                <input
                  type="number"
                  className="w-full p-2 rounded-sm shadow-sm outline-none"
                  id="price"
                  placeholder="Ex: 99.99"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  min={1}
                  step={0.01}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="type" className="font-semibold">
                Tipo do gasto:
              </label>
              <select
                id="type"
                className="p-2 rounded-sm shadow-sm outline-none cursor-pointer"
                value={spent.type}
                onChange={(e) =>
                  setSpent({
                    ...spent,
                    type: e.target.value as "debit" | "credit",
                  })
                }
              >
                <option value="debit">Débito</option>
                <option value="credit">Crédito</option>
              </select>
            </div>
            <div className="w-full flex items-center gap-2">
              <label htmlFor="always" className="font-semibold cursor-pointer">
                Gasto fixo?
              </label>
              <input
                id="always"
                type="checkbox"
                checked={spent.always}
                onChange={(e) => {
                  if (e.target.checked) {
                    setInitialInstallmentDate("");
                    setNumberOfInstallment(1);
                  }

                  setSpent({ ...spent, always: e.target.checked });
                }}
                className="w-4 cursor-pointer accent-violet-600"
              />
            </div>
            {spent.type === "credit" && (
              <div className="flex flex-col md:flex-row w-full gap-5">
                <div className="w-full md:w-1/2 flex flex-col gap-1">
                  <label
                    htmlFor="initialInstallmentDate"
                    className={`font-semibold ${
                      spent.always ? "text-neutral-400" : ""
                    } transition-colors`}
                  >
                    Data da primeira parcela:
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 rounded-sm shadow-sm outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
                    id="initialInstallmentDate"
                    placeholder="Ex: Conta de luz"
                    value={initialInstallmentDate}
                    onChange={(e) => setInitialInstallmentDate(e.target.value)}
                    disabled={spent.always}
                    required={spent.type !== "credit" || !spent.always}
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-1">
                  <label
                    htmlFor="numberOfInstallment"
                    className={`font-semibold ${
                      spent.always ? "text-neutral-400" : ""
                    } transition-colors`}
                  >
                    Quantidade de parcelas:
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 rounded-sm shadow-sm outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
                    id="numberOfInstallment"
                    value={String(numberOfInstallment)}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setNumberOfInstallment(Number(e.target.value));
                      }
                    }}
                    min={1}
                    disabled={spent.always}
                    required={spent.type !== "credit" || !spent.always}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="reset"
              onClick={handleToggleModal}
              className="p-2 rounded-md w-1/3 border-violet-600 border-2 text-violet-600 font-semibold hover:bg-neutral-50 transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="p-2 rounded-md w-1/3 bg-violet-600 border-violet-600 border-2 text-neutral-50 font-semibold hover:bg-violet-700 transition-colors shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
