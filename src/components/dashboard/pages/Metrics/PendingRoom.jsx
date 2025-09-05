"use client";
import React from "react";

const PendingRoom = ({ evictionRoom, roomList }) => {
  return (
    <div className="w-full h-[90%] flex flex-col gap-5 p-4">
      <h1 className="text-2xl font-semibold">Pending Room</h1>

      {/* Room in Eviction Section */}
      <div className="w-full flex flex-col gap-5 rounded-[10px] p-6 bg-white shadow-sm">
        <h2 className="text-xl font-medium">Room In Eviction</h2>
        <div className="flex items-center justify-center w-full h-[100px] bg-[#FFEFEF] rounded-[10px]">
          <p className="text-lg font-semibold">
            {evictionRoom || "No Room in Eviction"}
          </p>
        </div>
      </div>

      {/* Room List Table */}
      <div className="overflow-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-[700px] w-full text-sm text-left">
          <thead className="bg-f2 text-white">
            <tr>
              <th className="p-5 font-normal">Ticket ID</th>
              <th className="p-5 font-normal">Address</th>
              <th className="p-5 font-normal">Rooms</th>
              <th className="p-5 font-normal">Days in Flip</th>
              <th className="p-5 font-normal text-center">Missed Revenue</th>
            </tr>
          </thead>
          <tbody>
            {roomList && roomList.length > 0 ? (
              roomList.map((room, index) => (
                <tr key={index} className="bg-white border-t hover:bg-gray-50">
                  <td className="p-5">{room.ticketId}</td>
                  <td className="p-5">{room.address}</td>
                  <td className="p-5">{room.roomName}</td>
                  <td className="p-5">{room.daysInFlip}</td>
                  <td className="p-5 text-center">
                    <div className="py-1 px-3 bg-[#FECDCA] text-[#B42318] rounded-md w-fit mx-auto">
                      ${room.missedRevenue}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-5">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRoom;
