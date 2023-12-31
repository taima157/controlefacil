import { useContext, useState } from "react";
import { Spent } from "../types/control";
import { ControlContext } from "../contexts/control";
import ConfirmModal from "./ConfirmModal";

type PropsType = {
  spent: Spent;
};

const typeSpent = {
  credit: "Crédito",
  debit: "Débito",
};

export default function SpentCard({ spent }: PropsType) {
  const { removeSpent } = useContext(ControlContext);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function toggleModalVisible() {
    setModalVisible(!modalVisible);
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-sm p-2 shadow-sm drop-shadow-md bg-neutral-200 ">
        <div className="flex flex-1 flex-col gap-2 ">
          <h3 className="text-xl font-semibold text-violet-600">
            {spent.title}
          </h3>
          <div className="flex flex-col w-full">
            <span className="w-full font-semibold">
              Tipo da despesa:{" "}
              <span className="font-normal">{typeSpent[spent.type]}</span>
            </span>
            <span className="font-semibold">
              Preço:{" "}
              <span className="text-violet-600">
                {spent.price.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={toggleModalVisible}
          className="px-2 py-1 rounded-md bg-violet-600 border-violet-600 border-2 text-neutral-50 font-semibold hover:bg-violet-700 transition-colors shadow-sm"
        >
          Excluir
        </button>
      </div>

      <ConfirmModal
        visible={modalVisible}
        toggleModal={toggleModalVisible}
        confirmAction={() => removeSpent(spent.id)}
      />
    </>
  );
}
