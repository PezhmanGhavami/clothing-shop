import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin" />
    </div>
  );
}

export default Loading;
