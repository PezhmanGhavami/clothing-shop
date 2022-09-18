import Logo from "../logo/logo.component";

interface IAuthLayout {
  children: React.ReactNode;
}

function AuthLayout({ children }: IAuthLayout) {
  return (
    <>
      <div className="flex flex-col justify-start items-center h-screen bg-slate-900 text-slate-100">
        <Logo />
        {children}
      </div>
    </>
  );
}

export default AuthLayout;
