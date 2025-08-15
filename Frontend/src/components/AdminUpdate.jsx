import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router-dom';

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleUpdate = (id) => {
    if (!window.confirm('Are you sure you want to update this problem?')) return;
    navigate(`/admin/update/form/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between px-6 py-4 bg-black/20 shadow-md rounded-xl mb-6 w-full flex-wrap gap-y-4">

        {/* Left Section - Navigation + Title */}
        {user?.role === 'admin' ? (
          <div>
            <NavLink
              to="/adminpage"
              className="text-base  sm:hidden font-semibold uppercase text-gray-100 hover:text-blue-600 hover:underline transition"
            >
              Admin
            </NavLink>
            <NavLink
              to="/adminpage"
              className="text-base hidden sm:block font-semibold uppercase text-gray-100 hover:text-blue-600 hover:underline transition"
            >
              Admin Panel
            </NavLink>
          </div>
        ) : (
          <NavLink
            to="/"
            className="text-base font-semibold uppercase text-gray-100 hover:text-blue-600 hover:underline transition"
          >
            Home
          </NavLink>
        )}

        <h1 className="text-xl md:text-2xl font-bold uppercase text-gray-100">
          Update Problems
        </h1>


        {/* Right Section - User Info */}
        <div className="text-right hidden sm:block">
          <h2 className="text-md md:text-lg font-semibold text-gray-100">
            Welcome, <span className="uppercase text-blue-600">{user?.firstName || 'Admin'}</span>
          </h2>
          <p className="text-sm text-gray-100">{user?.emailId || ' '}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-base-200">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-base-300 text-xs uppercase text-gray-600 dark:text-gray-400 border-b">
            <tr>
              <th className="px-4 py-3 w-1/12">#</th>
              <th className="px-4 py-3 w-4/12">Title</th>
              <th className="px-4 py-3 w-2/12">Difficulty</th>
              <th className="px-4 py-3 w-3/12">Tags</th>
              <th className="px-4 py-3 w-2/12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-base-300">
            {problems.map((problem, index) => (
              <tr key={problem._id} className="hover:bg-gray-50 dark:hover:bg-base-100 transition">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 uppercase">{problem.title}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-2xl text-xs font-medium uppercase  ${problem.difficulty === 'easy'
                    ? ' text-green-800'
                    : problem.difficulty === 'medium'
                      ? 'text-yellow-800'
                      : ' text-red-800'
                    }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className='uppercase'>
                    {problem.tags}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(problem._id)}
                      className="btn btn-sm bg-red-500 hover:bg-red-700 text-white rounded-md transition duration-150"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default AdminUpdate;