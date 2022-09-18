import Logo from "../logo/logo.component";

interface IAuthLayout {
  children: React.ReactNode;
}

function AuthLayout({ children }: IAuthLayout) {
  return (
    <>
      <div className="flex flex-col justify-start items-center h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
        <Logo />
        {children}
      </div>
    </>
  );
}

export default AuthLayout;
