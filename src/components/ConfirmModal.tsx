type PropsType = {
  visible: boolean;
  toggleModal: () => void;
  confirmAction: () => void;
};

export default function ConfirmModal({
  visible,
  toggleModal,
  confirmAction,
}: PropsType) {
  if (!visible) {
    return <></>;
  }

  return (
    <div className="absolute inset-0 z-10 h-screen w-screen flex items-center justify-center shadow-lg">
      <div
        className="w-full h-full bg-neutral-900/50 absolute"
        onClick={toggleModal}
      />
      <div className="z-20 bg-neutral-100 p-5 rounded-md w-11/12 md:w-2/3 xl:w-1/2 flex flex-col gap-10">
        <h1 className="text-2xl font-bold">Deseja mesmo excluir o gasto?</h1>
        <div className="flex justify-between">
          <button
            onClick={toggleModal}
            className="p-2 rounded-md w-1/3 border-violet-600 border-2 text-violet-600 font-semibold hover:bg-neutral-50 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={confirmAction}
            className="p-2 rounded-md w-1/3 bg-violet-600 border-violet-600 border-2 text-neutral-50 font-semibold hover:bg-violet-700 transition-colors shadow-sm"
          >
            Cofirmar
          </button>
        </div>
      </div>
    </div>
  );
}
