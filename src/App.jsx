import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://8hb6sk9r3l.execute-api.ap-south-1.amazonaws.com/prod";

function App() {
  const [poll, setPoll] = useState({ optionA: 0, optionB: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Fetch poll results on initial load
    fetchPollResults();
  }, []);

  const fetchPollResults = async () => {
    try {
      const response = await axios.get(`${API_BASE}/results?pollId=1`);
      console.log("Fetched poll results:", response.data); // Log response to verify structure
      // Ensure correct data structure and update poll state
      setPoll({
        optionA: response.data.optionA || 0,
        optionB: response.data.optionB || 0,
      });
    } catch (error) {
      console.error("Error fetching poll results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (option) => {
    try {
      await axios.post(`${API_BASE}/vote`, { pollId: "1", option });
      setSelectedOption(option);
      setShowResults(true);
      fetchPollResults(); // Re-fetch the updated results after voting
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
          Vote for Your Favorite Option!
        </h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading poll results...</p>
        ) : (
          <>
            <div className="flex justify-around mb-4">
              <button
                className={`w-40 py-2 px-4 font-semibold rounded-lg ${
                  selectedOption === "optionA"
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                } hover:bg-blue-600 transition`}
                disabled={!!selectedOption}
                onClick={() => handleVote("optionA")}
              >
                Option A ({poll.optionA})
              </button>
              <button
                className={`w-40 py-2 px-4 font-semibold rounded-lg ${
                  selectedOption === "optionB"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                } hover:bg-red-600 transition`}
                disabled={!!selectedOption}
                onClick={() => handleVote("optionB")}
              >
                Option B ({poll.optionB})
              </button>
            </div>
            {selectedOption && (
              <p className="text-center text-green-500 font-semibold">
                Thank you for voting!
              </p>
            )}

            {showResults && (
              <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-inner">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Current Poll Results
                </h2>
                <div className="flex justify-around text-lg">
                  <p className="font-semibold text-blue-500">
                    Option A: {poll.optionA} votes
                  </p>
                  <p className="font-semibold text-red-500">
                    Option B: {poll.optionB} votes
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
