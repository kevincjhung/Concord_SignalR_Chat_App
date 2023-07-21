import React from 'react';

interface SidebarProps {
  channels: string[];
}
export default function Sidebar({ channels }: SidebarProps) {
  return (
    <div className="sidebar">
      {channels.map((channel) => (
        <div key={channel}>
          <p>{`${channel}`}</p>
        </div>
      ))}
    </div>
  );
}