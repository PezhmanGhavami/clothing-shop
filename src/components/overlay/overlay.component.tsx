function Overlay({ handleClick }: { handleClick: () => void }) {
  return (
    <div
      className="fixed inset-0 z-30 h-screen w-screen bg-black/10 dark:bg-black/50"
      onClick={handleClick}
    />
  );
}

export default Overlay;
