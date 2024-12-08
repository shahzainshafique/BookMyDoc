import DocDashStats from "./DocDashStats";
import DocTodayApp from "./DocTodayApp";

const DocCenterContent = () => {
  return (
    <div className="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5">
      <DocDashStats />
      <DocTodayApp />
    </div>
  );
};

export default DocCenterContent;
