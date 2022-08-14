import { InputHTMLAttributes } from "react";

interface IAllInputOptions
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface IFormInputProps {
  allInputOptions: IAllInputOptions;
}

const FormInput = ({
  allInputOptions,
}: IFormInputProps) => {
  const { label, ...inputOptions } = allInputOptions;
  return (
    <div className="pb-4">
      <label className="block pb-1 " htmlFor={inputOptions.id}>{label}</label>
      <input className="w-full h-8 rounded-md" {...inputOptions} />
    </div>
  );
};

export default FormInput;
