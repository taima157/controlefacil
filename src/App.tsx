import { useContext, useEffect, useState } from "react";
import { ControlContext } from "./contexts/control";
import AddSpentModal from "./components/AddSpentModal";
import moment from "moment";
import SpentCard from "./components/SpentCard";

const monthsTranslated: { [key: string]: string } = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
};

export default function App() {
  const currentDate = moment().format();

  const {
    monthlyIncome,
    totalExpenses,
    selectedMonth,
    monthlySpendList,
    setSelectedMonth,
    updateMonthyIncome,
  } = useContext(ControlContext);
  const [inputValue, setInputValue] = useState<number>(0);
  const [months, setMonths] = useState<Array<string> | null>(null);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function toggleModalVisible() {
    setModalVisible(!modalVisible);
  }

  function genMonths() {
    const handleMonths: Array<string> = [];

    for (let i = 0; i < 7; i++) {
      handleMonths.push(
        moment(currentDate).add(i, "month").format("MMMM YYYY")
      );
    }

    setMonths(handleMonths);
  }

  useEffect(() => {
    genMonths();
  }, []); // eslint-disable-line

  useEffect(() => {
    setInputValue(monthlyIncome);
  }, [monthlyIncome]);

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex flex-col gap-10 p-2 sm:p-5 md:p-10 bg-neutral-100 w-[95%] sm:w-11/12 xl:w-2/3 rounded-md shadow-md">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
          <h1 className="text-3xl font-bold">Lista de despesas</h1>
          <div className="flex flex-col">
            <span className="font-semibold">Ganho mensal (R$):</span>
            <div className="flex gap-5">
              <input
                type="number"
                className="p-1 rounded-sm shadow-sm outline-none"
                value={String(inputValue)}
                onChange={(e) => setInputValue(Number(e.target.value))}
              />
              <button
                onClick={() => updateMonthyIncome(inputValue)}
                disabled={inputValue === monthlyIncome}
                className="p-1 rounded-md w-20 bg-violet-600 border-violet-600 border-2 text-neutral-50 font-semibold disabled:cursor-not-allowed disabled:opacity-50 hover:bg-violet-700 transition-colors shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-10">
          <div className="overflow-auto">
            <div className="flex gap-3 py-2">
              {months !== null &&
                months.map((monthYear, index) => {
                  const [month, year] = monthYear.split(" ");
                  return (
                    <button
                      onClick={() => setSelectedMonth(monthYear)}
                      key={index}
                      className={`flex gap-2 p-2 rounded-sm ${
                        monthYear === selectedMonth
                          ? "bg-violet-500 border-violet-500 hover:border-violet-600  hover:bg-violet-600 "
                          : "border-violet-500  text-violet-500 hover:bg-violet-500 hover:text-neutral-50"
                      } border-2 text-neutral-50 text-sm font-semibold  transition-colors shadow-sm`}
                    >
                      <span>{monthsTranslated[month]}</span>
                      <span>{year}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="flex w-full h-80 overflow-y-auto">
            {monthlySpendList.length !== 0 ? (
              <div className={`grid grid-cols-1 ${monthlySpendList.length <= 6 ? "md:grid-rows-3" : ""} md:grid-cols-2 gap-3 w-full`}>
                {monthlySpendList.map((spent) => {
                  return <SpentCard key={spent.id} spent={spent} />;
                })}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span>Não há nenhuma despesa para esse mês.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full justify-between gap-5 sm:items-center">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">
              Total de despesas do mês:{" "}
              <span className="text-green-500">
                {totalExpenses.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
            <span className="font-semibold">
              Valor sobrando:{" "}
              <span
                className={
                  monthlyIncome - totalExpenses >= 0
                    ? "text-green-500"
                    : "text-red-600"
                }
              >
                {(monthlyIncome - totalExpenses).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
          </div>

          <button
            onClick={toggleModalVisible}
            className="p-2 rounded-md bg-violet-600 border-violet-600 border-2 text-neutral-50 font-semibold hover:bg-violet-700 transition-colors shadow-sm"
          >
            Adicionar gasto
          </button>
        </div>
      </div>

      <AddSpentModal visible={modalVisible} toggleModal={toggleModalVisible} />
    </div>
  );
}
