import Link from "next/link";
//This is different than navbar logo
function Logo() {
  return (
    <div className="uppercase text-2xl tracking-wide font-medium pt-8 pb-6 lg:p-4">
      <Link href={"/"}>Clothing Shop</Link>
    </div>
  );
}

export default Logo;
