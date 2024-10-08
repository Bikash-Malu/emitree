import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/gameSlice'; // Import the action to fetch leaderboard
import { Table } from 'flowbite-react'; // Import Table component from Flowbite

const Leaderboard = () => {
  const dispatch = useDispatch();
  const leaderboard = useSelector((state) => state.game.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 mt-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Leaderboard</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <Table hoverable={true} className="bg-gray-50">
          <Table.Head className="bg-gray-800 text-black text-center">
            <Table.HeadCell>Rank</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Points</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-gray-200">
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => (
                <Table.Row key={index} className="hover:bg-gray-100 transition duration-200">
                  <Table.Cell className="text-center text-gray-800">{index + 1}</Table.Cell>
                  <Table.Cell className="text-center text-gray-800">{player.username}</Table.Cell>
                  <Table.Cell className="text-center text-gray-800">{` 😎👌🔥`}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={3} className="text-center text-gray-500">
                  No players found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
