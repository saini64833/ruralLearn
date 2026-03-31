import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageMotion from "../components/PageMotion";
import {
  BookOpen,
  FileText,
  Upload,
  Trash2,
  Edit3,
  UserCircle2,
  Loader2,
  Trophy,
  TrendingUp,
  Star,
  Medal,
  BarChart2,
  Hash,
  Percent,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) => (typeof v === "number" ? v.toFixed(1) : v ?? "—");

// ─── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex items-center gap-3 mt-4 justify-end">
    <button
      onClick={onPrev}
      disabled={page <= 1}
      className="p-1.5 rounded-lg border hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronLeft size={16} />
    </button>
    <span className="text-sm text-gray-500">
      {page} / {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={page >= totalPages}
      className="p-1.5 rounded-lg border hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ChevronRight size={16} />
    </button>
  </div>
);

// ─── Rank Badge ────────────────────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  if (rank === 1)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs">
        <Trophy size={11} /> 1st
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-bold text-xs">
        <Medal size={11} /> 2nd
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
        <Star size={11} /> 3rd
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
      <Hash size={11} /> {rank}
    </span>
  );
};

// ─── Modal Shell ───────────────────────────────────────────────────────────────
const Modal = ({ onClose, children, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    />
    <motion.div
      className={`relative z-50 w-full ${
        wide ? "max-w-2xl" : "max-w-lg"
      } bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]`}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
);

// ─── Quiz Leaderboard Modal ────────────────────────────────────────────────────
// Opened when a quiz title is clicked inside StudentDetailModal.
const QuizLeaderboardModal = ({ quizId, quizTitle, currentUserId, onClose }) => {
  const [board, setBoard] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchBoard = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/progress/${quizId}?page=${page}&limit=10`);
        const { leaderboard, pagination: pg } = res.data?.data;
        setBoard(leaderboard);
        setPagination({ page: pg.page, totalPages: pg.totalPages });
      } catch {
        toast.error("Failed to load quiz leaderboard");
      } finally {
        setLoading(false);
      }
    },
    [quizId]
  );

  useEffect(() => {
    fetchBoard(1);
  }, [fetchBoard]);

  return (
    <Modal onClose={onClose} wide>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Trophy size={18} className="text-yellow-500 shrink-0" />
          <span className="font-bold text-gray-800 truncate">{quizTitle}</span>
          <span className="text-xs text-gray-400 font-normal shrink-0">· Leaderboard</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-yellow-500" size={28} />
          </div>
        ) : board.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">
            No results yet for this quiz.
          </p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-yellow-50 text-yellow-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 text-left">Rank</th>
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-right">Score</th>
                  <th className="px-3 py-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {board.map((entry, i) => {
                  const isMe =
                    entry.studentId?.toString() === currentUserId?.toString();
                  return (
                    <motion.tr
                      key={entry.studentId ?? i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-t border-gray-50 transition ${
                        isMe ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-3 py-2.5">
                        <RankBadge rank={entry.rank} />
                      </td>
                      <td className="px-3 py-2.5 text-gray-800">
                        {entry.name}
                        {isMe && (
                          <span className="ml-1 text-xs text-indigo-500">(You)</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-indigo-700">
                        {entry.score}
                      </td>
                      <td className="px-3 py-2.5 text-right text-green-700">
                        {fmt(entry.percentage)}%
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPrev={() => fetchBoard(pagination.page - 1)}
              onNext={() => fetchBoard(pagination.page + 1)}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

// ─── Student Detail Modal ──────────────────────────────────────────────────────
// Shows all quiz results for a student. Clicking a quiz title opens QuizLeaderboardModal.
const StudentDetailModal = ({ student, currentUserId, onClose }) => {
  const [performance, setPerformance] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [quizModal, setQuizModal] = useState(null); // { quizId, quizTitle }

  const fetchPerf = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/progress/user/${student._id}?page=${page}&limit=10`
        );
        const { performance: data, pagination: pg } = res.data?.data;
        setPerformance(data);
        setPagination({ page: pg.page, totalPages: pg.totalPages });
      } catch (err) {
        if (err.response?.status === 404) {
          setPerformance([]);
        } else {
          toast.error("Failed to load student performance");
        }
      } finally {
        setLoading(false);
      }
    },
    [student._id]
  );

  useEffect(() => {
    fetchPerf(1);
  }, [fetchPerf]);

  return (
    <>
      <Modal onClose={onClose} wide>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
              {(student.name ?? student.fullName ?? "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 truncate">
                {student.name ?? student.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate">{student.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hint */}
        <div className="px-6 pt-3 pb-1 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Quiz Results · tap a quiz to see its full leaderboard
          </p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={28} />
            </div>
          ) : performance.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">
              No quiz attempts found.
            </p>
          ) : (
            <>
              <div className="space-y-3 mt-3">
                {performance.map((item, i) => (
                  <motion.button
                    key={item.quizId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() =>
                      setQuizModal({ quizId: item.quizId, quizTitle: item.quizTitle })
                    }
                    className="w-full text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-300 rounded-xl p-3.5 transition group"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-gray-800 text-sm group-hover:text-indigo-700 transition truncate max-w-[65%]">
                        {item.quizTitle}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                        <Calendar size={11} />
                        {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-4 mb-2">
                      <span className="flex items-center gap-1 text-indigo-700 font-bold text-xs">
                        <BarChart2 size={12} /> {item.score} pts
                      </span>
                      <span className="flex items-center gap-1 text-green-700 font-bold text-xs">
                        <Percent size={12} /> {fmt(item.percentage)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.percentage ?? 0, 100)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                      />
                    </div>

                    <p className="text-xs text-indigo-400 mt-1.5 group-hover:text-indigo-600 transition">
                      View quiz leaderboard →
                    </p>
                  </motion.button>
                ))}
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPrev={() => fetchPerf(pagination.page - 1)}
                onNext={() => fetchPerf(pagination.page + 1)}
              />
            </>
          )}
        </div>
      </Modal>

      {/* Nested: Quiz Leaderboard Modal */}
      <AnimatePresence>
        {quizModal && (
          <QuizLeaderboardModal
            quizId={quizModal.quizId}
            quizTitle={quizModal.quizTitle}
            currentUserId={currentUserId}
            onClose={() => setQuizModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Global Leaderboard (shared by all roles) ──────────────────────────────────
const GlobalLeaderboard = ({ currentUserId }) => {
  const [board, setBoard] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchBoard = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/progress/leaderboard?page=${page}&limit=10`);
      const { leaderboard, pagination: pg } = res.data?.data;
      setBoard(leaderboard);
      setPagination({ page: pg.page, totalPages: pg.totalPages });

      if (currentUserId) {
        const mine = leaderboard.find(
          (e) => e.studentId?.toString() === currentUserId?.toString()
        );
        if (mine) setMyRank(mine);
      }
    } catch {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard(1);
  }, []);

  return (
    <>
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-yellow-700">
            <Trophy size={22} /> Global Leaderboard
          </h3>
          {myRank && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5 text-sm">
              <Trophy size={13} className="text-yellow-500" />
              <span className="font-semibold text-yellow-700">
                Your rank: #{myRank.rank}
              </span>
              <span className="text-gray-400">· {myRank.totalScore} pts</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Click any student name to view their individual quiz scores and marks.
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-yellow-400" size={28} />
          </div>
        ) : board.length === 0 ? (
          <p className="text-gray-400 text-sm">No leaderboard data yet.</p>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-yellow-100 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-yellow-50 text-yellow-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-right">Total Score</th>
                    <th className="px-4 py-3 text-right">Avg %</th>
                    <th className="px-4 py-3 text-right">Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {board.map((entry, i) => {
                    const isMe =
                      currentUserId &&
                      entry.studentId?.toString() === currentUserId?.toString();
                    return (
                      <motion.tr
                        key={entry.studentId ?? i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-t border-yellow-50 transition ${
                          isMe ? "bg-yellow-50 font-semibold" : "hover:bg-yellow-50"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <RankBadge rank={entry.rank} />
                        </td>
                        <td className="px-4 py-3">
                          {/* Clickable name → StudentDetailModal */}
                          <button
                            onClick={() =>
                              setSelectedStudent({
                                _id: entry.studentId,
                                name: entry.name,
                                email: entry.email,
                              })
                            }
                            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition text-left"
                          >
                            {entry.name}
                          </button>
                          {isMe && (
                            <span className="ml-1.5 text-xs text-indigo-400">(You)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-indigo-700">
                          {entry.totalScore}
                        </td>
                        <td className="px-4 py-3 text-right text-green-700">
                          {fmt(entry.avgPercentage)}%
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {entry.quizzesAttempted}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPrev={() => fetchBoard(pagination.page - 1)}
              onNext={() => fetchBoard(pagination.page + 1)}
            />
          </>
        )}
      </section>

      {/* Student Detail Modal (+ nested quiz leaderboard inside it) */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            currentUserId={currentUserId}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Student Dashboard ─────────────────────────────────────────────────────────
const StudentDashboard = ({ userId }) => {
  const [performance, setPerformance] = useState([]);
  const [perfPagination, setPerfPagination] = useState({ page: 1, totalPages: 1 });
  const [perfLoading, setPerfLoading] = useState(false);

  const fetchPerformance = async (page = 1) => {
    try {
      setPerfLoading(true);
      const res = await axiosInstance.get(`/progress/user/${userId}?page=${page}&limit=10`);
      const { performance: data, pagination } = res.data?.data;
      setPerformance(data);
      setPerfPagination({ page: pagination.page, totalPages: pagination.totalPages });
    } catch (err) {
      if (err.response?.status !== 404) toast.error("Failed to fetch performance");
      setPerformance([]);
    } finally {
      setPerfLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance(1);
  }, [userId]);

  return (
    <div className="space-y-10">
      {/* My Performance */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
          <TrendingUp size={22} /> My Quiz Performance
        </h3>

        {perfLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-indigo-500" size={28} />
          </div>
        ) : performance.length === 0 ? (
          <p className="text-gray-500">You haven't attempted any quizzes yet.</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {performance.map((item, i) => (
                <motion.div
                  key={item.quizId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 truncate max-w-[70%]">
                      {item.quizTitle}
                    </h4>
                    <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Calendar size={12} />
                      {new Date(item.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1 text-indigo-700 font-semibold text-sm">
                      <BarChart2 size={14} /> Score: {item.score}
                    </span>
                    <span className="flex items-center gap-1 text-green-700 font-semibold text-sm">
                      <Percent size={14} /> {fmt(item.percentage)}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.percentage ?? 0, 100)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <Pagination
              page={perfPagination.page}
              totalPages={perfPagination.totalPages}
              onPrev={() => fetchPerformance(perfPagination.page - 1)}
              onNext={() => fetchPerformance(perfPagination.page + 1)}
            />
          </>
        )}
      </section>

      {/* Global leaderboard — student can click other names too */}
      <GlobalLeaderboard currentUserId={userId} />
    </div>
  );
};

// ─── Parent Dashboard ──────────────────────────────────────────────────────────
const ParentDashboard = () => {
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPagination, setSearchPagination] = useState({ page: 1, totalPages: 1 });
  const [lastQuery, setLastQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = async (page = 1, query = lastQuery) => {
    if (!query.trim()) return;
    try {
      setSearchLoading(true);
      setLastQuery(query);
      const res = await axiosInstance.get(
        `/progress/search?name=${encodeURIComponent(query)}&page=${page}&limit=10`
      );
      console.log(res);
      const { users, pagination } = res.data?.data;
      setSearchResults(users);
      setSearchPagination({ page: pagination.page, totalPages: pagination.totalPages });
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Search section */}
        <section>
          <h3 className="text-2xl font-semibold flex items-center gap-2 text-purple-700 mb-4">
            <Users size={22} /> Track a Student
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search student by name…"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(1, searchName)}
              className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
            />
            <button
              onClick={() => handleSearch(1, searchName)}
              disabled={searchLoading}
              className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {searchLoading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <>
              <div className="mt-4 overflow-hidden rounded-2xl border border-purple-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-purple-50 text-purple-800 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-right">Quizzes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student, i) => (
                      <motion.tr
                        key={student._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-t border-purple-50 hover:bg-purple-50 transition"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition text-left"
                          >
                            {student.fullName}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{student.email}</td>
                        <td className="px-4 py-3 text-right text-purple-700 font-semibold">
                          {student.quizzes?.length ?? 0}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={searchPagination.page}
                totalPages={searchPagination.totalPages}
                onPrev={() => handleSearch(searchPagination.page - 1)}
                onNext={() => handleSearch(searchPagination.page + 1)}
              />
            </>
          )}
        </section>

        {/* Global Leaderboard for Parent — click names from here too */}
        <GlobalLeaderboard currentUserId={null} />
      </div>

      {/* Student Detail modal from search results */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            currentUserId={null}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [userNewDetail, setUserNewDetail] = useState({});
  const [newAvatar, setNewAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        const userInfo = res.data?.data;
        setUserData(userInfo);

        if (userInfo.role === "Teacher") {
          let teacherLessons = [];
          try {
            const r = await axiosInstance.get("/lessons/get-all-lessons");
            teacherLessons = r.data?.data.filter(
              (l) => l.createdBy._id === userInfo._id
            );
          } catch (e) {
            if (e.response?.status !== 404) toast.error("Failed to fetch lessons");
          }
          setLessons(teacherLessons || []);

          let teacherQuizzes = [];
          try {
            const r = await axiosInstance.get("/quizzes/get-all-quizzes");
            teacherQuizzes = r.data?.data.filter(
              (q) =>
                q.createdBy?._id === userInfo._id || q.createdBy === userInfo._id
            );
          } catch (e) {
            if (e.response?.status !== 404) toast.error("Failed to fetch quizzes");
          }
          setQuizzes(teacherQuizzes || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Dashboard fetch failed");
      }
    };
    fetchData();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.post("/users/change-password", { oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setIsPasswordOpen(false);
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateprofile = async () => {
    try {
      const payload =
        userData.role === "Student"
          ? {
              email: userNewDetail.email,
              fullName: userNewDetail.fullName,
              grade: userNewDetail.grade,
              school: userNewDetail.school,
            }
          : { email: userNewDetail.email, fullName: userNewDetail.fullName };
      await axiosInstance.put("/users/account-detail-update", payload);
      toast.success("Profile updated successfully");
      setIsProfileDetailOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await axiosInstance.delete(`/lessons/${id}`);
      setLessons((p) => p.filter((l) => l._id !== id));
      toast.success("Lesson deleted");
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await axiosInstance.delete(`/quizzes/quize-delete/${id}`);
      setQuizzes((p) => p.filter((q) => q._id !== id));
      toast.success("Quiz deleted");
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-indigo-600 font-medium">
        Loading dashboard...
      </div>
    );
  }

  const roleBadge =
    {
      Teacher: "bg-blue-100 text-blue-700",
      Student: "bg-green-100 text-green-700",
      Parent: "bg-purple-100 text-purple-700",
    }[userData.role] ?? "bg-gray-100 text-gray-700";

  const btnCls = `mt-3 inline-block px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm hover:cursor-pointer ${roleBadge}`;

  return (
    <PageMotion>
      <motion.div
        className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-indigo-100">

          {/* ── USER INFO ── */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <div className="relative group w-28 h-28">
              <img
                src={
                  newAvatar
                    ? URL.createObjectURL(newAvatar)
                    : userData?.avatar
                    ? `${userData.avatar}?t=${Date.now()}`
                    : "https://via.placeholder.com/100"
                }
                alt="avatar"
                className={`w-28 h-28 rounded-full border-4 border-indigo-500 shadow object-cover ${
                  uploading ? "opacity-50" : ""
                }`}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              <label
                htmlFor="avatarUpload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <UserCircle2 className="text-white w-8 h-8" />
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setNewAvatar(file);
                  setUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append("avatar", file);
                    await axiosInstance.put("/users/update-avatar", fd);
                    const r = await axiosInstance.get("/users/me");
                    setUserData(r.data?.data);
                    toast.success("Avatar updated!");
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Upload failed");
                  } finally {
                    setUploading(false);
                    setNewAvatar(null);
                  }
                }}
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">{userData.fullName}</h2>
              <p className="text-gray-600">@{userData.userName}</p>
              <p className="text-gray-500">{userData.email}</p>
              <div className="flex flex-wrap gap-3">
                <span className={`mt-3 inline-block px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm ${roleBadge}`}>
                  {userData.role.toUpperCase()}
                </span>
                <button onClick={() => setIsPasswordOpen(true)} className={btnCls}>
                  Change Password
                </button>
                <button onClick={() => setIsProfileDetailOpen(true)} className={btnCls}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          {/* ── CHANGE PASSWORD MODAL ── */}
          <AnimatePresence>
            {isPasswordOpen && (
              <Modal onClose={() => setIsPasswordOpen(false)}>
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                  <h3 className="text-lg font-semibold text-indigo-700">Change Password</h3>
                  <button onClick={() => setIsPasswordOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsPasswordOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleChangePassword} disabled={loading}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* ── UPDATE PROFILE MODAL ── */}
          <AnimatePresence>
            {isProfileDetailOpen && (
              <Modal onClose={() => setIsProfileDetailOpen(false)}>
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                  <h3 className="text-lg font-semibold text-indigo-700">Update Profile</h3>
                  <button onClick={() => setIsProfileDetailOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <input type="email" placeholder="Email" value={userNewDetail.email || ""}
                    onChange={(e) => setUserNewDetail({ ...userNewDetail, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2" />
                  <input type="text" placeholder="Full Name" value={userNewDetail.fullName || ""}
                    onChange={(e) => setUserNewDetail({ ...userNewDetail, fullName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2" />
                  {userData?.role === "Student" && (
                    <>
                      <input type="text" placeholder="Grade" value={userNewDetail.grade || ""}
                        onChange={(e) => setUserNewDetail({ ...userNewDetail, grade: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2" />
                      <input type="text" placeholder="School" value={userNewDetail.school || ""}
                        onChange={(e) => setUserNewDetail({ ...userNewDetail, school: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2" />
                    </>
                  )}
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setIsProfileDetailOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleUpdateprofile} disabled={loading}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* ── ROLE CONTENT ── */}

          {userData.role === "Teacher" && (
            <>
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => navigate("/lessons/upload-lesson")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  <Upload size={18} /> Upload Lesson
                </button>
                <button
                  onClick={() => navigate("/quizzes/upload-quize")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                >
                  <FileText size={18} /> Upload Quiz
                </button>
              </div>

              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
                <BookOpen /> Your Lessons ({lessons.length})
              </h3>
              {lessons.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {lessons.map((lesson) => (
                    <motion.div
                      key={lesson._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.subject}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/lessons/update/${lesson._id}`)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {lesson.description || "No description available."}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-8">No lessons uploaded yet.</p>
              )}

              <h3 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2 text-yellow-700">
                <FileText /> Your Quizzes ({quizzes.length})
              </h3>
              {quizzes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {quizzes.map((quiz) => (
                    <motion.div
                      key={quiz._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800">{quiz.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/quizzes/update-quize/${quiz._id}`)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Questions: {quiz.questions?.length || 0}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No quizzes uploaded yet.</p>
              )}

              {/* Teachers see the global leaderboard too */}
              <GlobalLeaderboard currentUserId={userData._id} />
            </>
          )}

          {userData.role === "Student" && (
            <StudentDashboard userId={userData._id} />
          )}

          {userData.role === "Parent" && <ParentDashboard />}
        </div>
      </motion.div>
    </PageMotion>
  );
};

export default Dashboard;