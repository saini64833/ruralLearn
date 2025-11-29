import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";



const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); 
  const [markedForReview, setMarkedForReview] = useState({}); 
  const [visited, setVisited] = useState({}); 

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const timeIntervalRef = useRef(null);

  // UI
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // LocalStorage keys (per quiz)
  const STORAGE_KEYS = {
    start: `quiz-${id}-startTime`,
    answers: `quiz-${id}-answers`,
    marked: `quiz-${id}-marked`,
    visited: `quiz-${id}-visited`,
  };

  // Load quiz and restore state
  useEffect(() => {
    let mounted = true;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/quizzes/quize/${id}`);
        const quizData = res.data.data;

        if (!mounted) return;
        setQuiz(quizData);

        // restore saved answers/marked/visited
        const savedAnswers = JSON.parse(localStorage.getItem(STORAGE_KEYS.answers) || "{}");
        const savedMarked = JSON.parse(localStorage.getItem(STORAGE_KEYS.marked) || "{}");
        const savedVisited = JSON.parse(localStorage.getItem(STORAGE_KEYS.visited) || "{}");

        setSelectedAnswers(savedAnswers);
        setMarkedForReview(savedMarked);
        setVisited(savedVisited);

        // timer start/restore
        const totalSec = quizData.duration * 60;
        let start = localStorage.getItem(STORAGE_KEYS.start);
        if (!start) {
          start = Date.now();
          localStorage.setItem(STORAGE_KEYS.start, start);
        }
        const elapsed = Math.floor((Date.now() - Number(start)) / 1000);
        const remaining = totalSec - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          // time already up (maybe user reloaded after exam end)
          handleAutoSubmit(savedAnswers, true);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadQuiz();

    return () => {
      mounted = false;
    };

  }, [id]);

  // Timer ticking
  useEffect(() => {
    if (timeLeft === null) return;

    // if time up, auto-submit once
    if (timeLeft <= 0) {
      // ensure auto submit only once
      if (!timeUp) {
        handleAutoSubmit(selectedAnswers, false);
      }
      return;
    }

    // start interval
    timeIntervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      clearInterval(timeIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Persist answers/marked/visited on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(selectedAnswers));
  }, [selectedAnswers]); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.marked, JSON.stringify(markedForReview));
  }, [markedForReview]); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.visited, JSON.stringify(visited));
  }, [visited]); // eslint-disable-line

  // Tab change detection (lightweight)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // left tab
      } else {
        // returned to tab
        setTabSwitchCount((c) => c + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Helpers
  const totalQuestions = quiz?.questions?.length || 0;
  const fullTime = quiz?.duration ? quiz.duration * 60 : 1;
  const progressPercentage = timeLeft !== null ? Math.max(0, (timeLeft / fullTime) * 100) : 0;

  const unansweredCount = (() => {
    if (!quiz) return 0;
    let cnt = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const sel = selectedAnswers[i];
      if (!sel || sel.length === 0) cnt++;
    }
    return cnt;
  })();

  // format MM:SS
  const formatTime = (sec) => {
    if (sec === null) return "--:--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // Navigation handlers
  const goTo = (index) => {
    setCurrentIndex(index);
    setVisited((v) => ({ ...v, [index]: true }));
  };

  const next = () => {
    const nextIndex = Math.min(totalQuestions - 1, currentIndex + 1);
    goTo(nextIndex);
  };

  const prev = () => {
    const prevIndex = Math.max(0, currentIndex - 1);
    goTo(prevIndex);
  };

  const saveAndNext = () => {
    next();
  };

  // answer select (supports multiple selection)
  const handleOptionToggle = (qIndex, optIndex) => {
    setSelectedAnswers((prev) => {
      const selected = prev[qIndex] || [];
      const exists = selected.includes(optIndex);
      const newSel = exists ? selected.filter((x) => x !== optIndex) : [...selected, optIndex];
      return { ...prev, [qIndex]: newSel };
    });
    setVisited((v) => ({ ...v, [qIndex]: true }));
  };

  // toggle mark for review
  const toggleMark = (qIndex) => {
    setMarkedForReview((m) => ({ ...m, [qIndex]: !m[qIndex] }));
    setVisited((v) => ({ ...v, [qIndex]: true }));
  };

  // Manual submit (from confirm modal)
  const handleSubmit = async () => {
    setConfirmOpen(false);
    try {
      await axiosInstance.post(`/quizzes/submit`, {
        quizId: id,
        answers: selectedAnswers,
      });
      // cleanup local storage
      localStorage.removeItem(STORAGE_KEYS.start);
      localStorage.removeItem(STORAGE_KEYS.answers);
      localStorage.removeItem(STORAGE_KEYS.marked);
      localStorage.removeItem(STORAGE_KEYS.visited);

      // navigate to result page
      navigate(`/quizzes/result/${id}`);
    } catch (err) {
      console.error("Submit Error:", err);
      // still try to navigate or inform user
    }
  };

  // Auto submit when time ends (show timeUp screen afterwards)
  const handleAutoSubmit = async (answersSnapshot = {}, alreadySubmittedFlag = false) => {
    // stop timer
    clearInterval(timeIntervalRef.current);
    setTimeUp(true);

    try {
      // if alreadySubmittedFlag true, backend likely already has it; attempt anyways is safe
      await axiosInstance.post(`/quizzes/submit`, {
        quizId: id,
        answers: answersSnapshot || selectedAnswers,
      });
    } catch (err) {
      console.error("Auto submit failed:", err);
    } finally {
      // remove stored start time but keep answers if user wants to reattempt
      localStorage.removeItem(STORAGE_KEYS.start);
    }
  };

  // Reattempt quiz: clears local state and resets start time, then reloads component state
  const handleReattempt = () => {
    // clear saved state
    localStorage.removeItem(STORAGE_KEYS.start);
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.marked);
    localStorage.removeItem(STORAGE_KEYS.visited);
    // reload page route to re-init the component (or programmatic navigate)
    navigate(`/quizzes/attempt/${id}`, { replace: true });
    window.location.reload(); // simple and reliable for full reset
  };

  // If loading
  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading quiz...
      </div>
    );
  }

  // TIME UP screen (auto-submitted)
  if (timeUp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl p-8 shadow text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">⏳ Time's Up</h1>
          <p className="text-gray-700 mb-6">
            Your answers have been automatically submitted. You can view results or reattempt the quiz.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/quizzes/result/${id}`)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              View Results
            </button>

            <button
              onClick={handleReattempt}
              className="px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
            >
              Reattempt Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current question
  const q = quiz.questions[currentIndex];
  const currentSelected = selectedAnswers[currentIndex] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold">{quiz.title}</h1>
          <div className="text-sm text-gray-600">{quiz.description || ""}</div>
        </div>

        <div className="flex items-center gap-4">
          {/* Unanswered / marked summary (small) */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="text-sm text-gray-600">Time Left</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12">
                <CircularProgressbar
                  value={Math.max(0, progressPercentage)}
                  text={formatTime(timeLeft)}
                  styles={buildStyles({
                    textSize: "2rem",
                    textColor: timeLeft <= 60 ? "#dc2626" : "#374151",
                    pathColor: timeLeft <= 60 ? "#dc2626" : "#4f46e5",
                    trailColor: "#e5e7eb",
                    strokeLinecap: "round",
                  })}
                />
              </div>

              <div className="text-sm text-gray-700">
                <div>
                  <span className="font-semibold">{unansweredCount}</span>{" "}
                  unanswered
                </div>
                <div className="text-xs text-gray-500">
                  Marked: {Object.keys(markedForReview).filter((k) => markedForReview[k]).length}
                </div>
              </div>
            </div>
          </div>

          {/* small timer for mobile */}
          <div className="sm:hidden">
            <div className={`px-3 py-2 rounded-md font-semibold ${timeLeft <= 60 ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-700"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      {/* Body: Left question, Right palette (responsive) */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question column (main) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base md:text-lg font-medium">
                  Q{currentIndex + 1}. {q.questionText}
                </h2>
                {q.explanation && <div className="text-sm text-gray-500 mt-2">{q.explanation}</div>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMark(currentIndex)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium border ${markedForReview[currentIndex] ? "bg-yellow-50 border-yellow-400" : "bg-gray-50 border-gray-200"}`}
                >
                  {markedForReview[currentIndex] ? "Marked" : "Mark for review"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="mt-5 space-y-3">
              {q.options.map((opt, i) => {
                const checked = currentSelected.includes(i);
                return (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition ${checked ? "bg-indigo-50 border-indigo-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 accent-indigo-600"
                      checked={checked}
                      onChange={() => handleOptionToggle(currentIndex, i)}
                    />
                    <div className="text-sm leading-6">{opt}</div>
                  </label>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Previous
                </button>

                <button
                  onClick={saveAndNext}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save & Next
                </button>

                <button
                  onClick={() => goTo(0)}
                  className="px-4 py-2 bg-white border rounded-lg text-sm text-gray-700"
                >
                  First
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600 hidden md:block">
                  Visited: {Object.keys(visited).length}/{totalQuestions}
                </div>

                <button
                  onClick={() => setConfirmOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: palette and summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Palette card */}
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Question Palette</h3>
                <div className="text-xs text-gray-500">Tap to jump</div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, idx) => {
                  const isVisited = !!visited[idx];
                  const isAnswered = (selectedAnswers[idx] || []).length > 0;
                  const isMarked = !!markedForReview[idx];

                  let bg = "bg-gray-100";
                  let text = "text-gray-700";

                  if (isMarked) {
                    bg = "bg-yellow-300";
                    text = "text-black";
                  } else if (isAnswered) {
                    bg = "bg-indigo-600";
                    text = "text-white";
                  } else if (isVisited) {
                    bg = "bg-white border border-gray-200";
                    text = "text-gray-700";
                  } else {
                    bg = "bg-gray-50 border border-gray-100 text-gray-500";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${bg} ${text} hover:scale-105 transition`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* legend */}
              <div className="mt-4 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-indigo-600 inline-block rounded-sm" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-200 inline-block rounded-sm border" />
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-300 inline-block rounded-sm" />
                  <span>Marked for review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-50 inline-block rounded-sm border" />
                  <span>Not visited</span>
                </div>
              </div>
            </div>

            {/* summary card */}
            <div className="bg-white rounded-2xl p-4 shadow text-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>Total</div>
                <div className="font-semibold">{totalQuestions}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>Answered</div>
                <div className="font-semibold">{totalQuestions - unansweredCount}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>Unanswered</div>
                <div className="font-semibold">{unansweredCount}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>Marked</div>
                <div className="font-semibold">{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    // quick jump to first unanswered
                    const firstUnanswered = quiz.questions.findIndex((_, idx) => !(selectedAnswers[idx] && selectedAnswers[idx].length > 0));
                    if (firstUnanswered === -1) goTo(0);
                    else goTo(firstUnanswered);
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Next Unanswered
                </button>
              </div>
            </div>

            {/* small hints */}
            <div className="bg-white rounded-2xl p-3 shadow text-xs text-gray-600">
              <div>Tab switches: {tabSwitchCount}</div>
              <div className="mt-2">Tip: Use palette to jump between questions fast.</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating bottom-right submit (compact & responsive) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm md:text-base shadow-lg flex items-center gap-2"
          title="Submit Quiz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Submit
        </button>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Submit Quiz?</h3>
            <p className="text-sm text-gray-600 mb-4">Once you submit, you won't be able to change your answers. Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-red-600 text-white">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;
