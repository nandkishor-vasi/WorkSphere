import React from 'react';
import ActivityCard from './ActivityCard';

const ActivityList = ({ activities, refresh }) => {
  return (
    <div>
      {activities.map((act) => (
        <ActivityCard key={act.id} activity={act} refresh={refresh} />
      ))}
    </div>
  );
};

export default ActivityList;
