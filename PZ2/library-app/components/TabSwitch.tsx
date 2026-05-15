export default function TabSwitch({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("library")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold w-[200px] cursor-pointer ${
            activeTab === "library"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          My Library
        </button>
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold w-[200px] cursor-pointer ${
            activeTab === "browse"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Browse Google Books
        </button>
      </div>
    </div>
  );
}
