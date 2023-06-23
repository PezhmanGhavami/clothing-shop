import { FormLink } from "../form/form.components";

const OtherAuthOption = ({
  pText,
  linkText,
  linkHref,
  tabIndex,
}: {
  pText: string;
  linkText: string;
  linkHref: string;
  tabIndex: number;
}) => {
  return (
    <div
      className={`mt-4 flex h-12 w-3/4 items-center justify-around rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 md:w-80`}
    >
      <p>
        {pText}
        <FormLink href={linkHref} tabIndex={tabIndex}>
          {" "}
          {linkText}
        </FormLink>
        {"."}
      </p>
    </div>
  );
};

export default OtherAuthOption;
