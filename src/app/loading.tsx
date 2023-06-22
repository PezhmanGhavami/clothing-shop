import Loading from "@/components/loading/loading.component";

export const metadata = {
  title: "Loading...",
};

const RootLoading = () => {
  return (
    <div className="mx-auto mt-96 h-full grow text-3xl">
      <Loading />
    </div>
  );
};

export default RootLoading;
