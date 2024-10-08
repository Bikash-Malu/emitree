import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/gameSlice'; 
import { Table } from 'flowbite-react';
import ClipLoader from 'react-spinners/ClipLoader';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const leaderboard = useSelector((state) => state.game.leaderboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); 
      await dispatch(fetchLeaderboard());
      setLoading(false); 
    };

    loadData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <ClipLoader size={80} color={"#3b82f6"} loading={loading} />
        <p className="mt-2 text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-8 bg-gradient-to-r from-yellow-400 to-red-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Leaderboard</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
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
                  <Table.Cell className="text-center text-gray-800">{`${player.points} ✅`}</Table.Cell>
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
