import React from "react";

const OverviewNav = ({ overviewCounts }) => {
  return (
    <div className="overview-task-counts">
      <div className="overview-task-count todo">
        Todo: <span>{overviewCounts.todo}</span>
      </div>
      <div className="overview-task-count inProgress">
        In Progress: <span>{overviewCounts.inProgress}</span>
      </div>
      <div className="overview-task-count done">
        Done: <span>{overviewCounts.done}</span>
      </div>
    </div>
  );
};

export default OverviewNav;
