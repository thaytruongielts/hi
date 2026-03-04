import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, Trophy, BookOpen, Clock } from 'lucide-react';
import { questions, Question } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const currentQuestions = useMemo(() => {
    const start = currentPage * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  }, [currentPage]);

  const handleAnswer = (questionId: number, answer: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    return (10 * correctCount) / questions.length;
  };

  const correctCount = useMemo(() => {
    let count = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        count++;
      }
    });
    return count;
  }, [userAnswers]);

  const resetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
    setShowResults(false);
    setCurrentPage(0);
  };

  const isPageComplete = currentQuestions.every(q => userAnswers[q.id]);
  const isQuizComplete = questions.every(q => userAnswers[q.id]);

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-indigo-600 p-8 text-center text-white">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-3xl font-bold mb-2">Kết quả bài tập</h1>
              <p className="text-indigo-100">Chúc mừng bạn đã hoàn thành 100 câu Phrasal Verbs!</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-stone-50 p-6 rounded-2xl text-center border border-stone-200">
                  <span className="block text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Điểm số</span>
                  <span className="text-5xl font-bold text-indigo-600">{score.toFixed(1)}</span>
                  <span className="text-stone-400 font-medium">/ 10</span>
                </div>
                <div className="bg-stone-50 p-6 rounded-2xl text-center border border-stone-200">
                  <span className="block text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Số câu đúng</span>
                  <span className="text-5xl font-bold text-emerald-600">{correctCount}</span>
                  <span className="text-stone-400 font-medium">/ 100</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Xem lại đáp án chi tiết
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full py-4 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Làm lại từ đầu
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-stone-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">100 Phrasal Verbs Challenge</h1>
            <p className="text-stone-500 mt-1">Luyện tập cụm động từ tiếng Anh - Phần {currentPage + 1}/{totalPages}</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-stone-500">
                {Object.keys(userAnswers).length}/100
              </span>
            </div>
          </div>
        </header>

        {/* Questions List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {currentQuestions.map((q, index) => {
                const isCorrect = userAnswers[q.id] === q.correctAnswer;
                const isSelected = !!userAnswers[q.id];
                
                return (
                  <div 
                    key={q.id} 
                    id={`question-${q.id}`}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                      submitted && isSelected
                        ? isCorrect 
                          ? 'border-emerald-200 bg-emerald-50/30' 
                          : 'border-rose-200 bg-rose-50/30'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold text-stone-500">
                        {q.id}
                      </span>
                      <div className="flex-grow">
                        <p className="text-lg font-medium leading-relaxed mb-4">
                          {q.text.split('________').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="inline-block min-w-[80px] border-b-2 border-stone-300 mx-1 text-center font-bold text-indigo-600">
                                  {userAnswers[q.id] ? q.options[userAnswers[q.id].charCodeAt(0) - 65] : '...'}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((option, optIdx) => {
                            const letter = String.fromCharCode(65 + optIdx);
                            const isOptionSelected = userAnswers[q.id] === letter;
                            const isOptionCorrect = q.correctAnswer === letter;

                            let buttonClass = "flex items-center gap-3 p-3 rounded-xl border text-left transition-all ";
                            
                            if (submitted) {
                              if (isOptionCorrect) {
                                buttonClass += "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200";
                              } else if (isOptionSelected && !isCorrect) {
                                buttonClass += "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200";
                              } else {
                                buttonClass += "bg-white border-stone-200 text-stone-400 opacity-60";
                              }
                            } else {
                              if (isOptionSelected) {
                                buttonClass += "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200";
                              } else {
                                buttonClass += "bg-white border-stone-200 text-stone-700 hover:border-indigo-300 hover:bg-indigo-50/50";
                              }
                            }

                            return (
                              <button
                                key={letter}
                                onClick={() => handleAnswer(q.id, letter)}
                                disabled={submitted}
                                className={buttonClass}
                              >
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  isOptionSelected || (submitted && isOptionCorrect) ? 'bg-white/20' : 'bg-stone-100'
                                }`}>
                                  {letter}
                                </span>
                                <span className="font-medium">{option}</span>
                                {submitted && isOptionCorrect && (
                                  <CheckCircle2 className="w-5 h-5 ml-auto" />
                                )}
                                {submitted && isOptionSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        
                        {submitted && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`mt-4 text-sm font-bold flex items-center gap-2 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}
                          >
                            {isCorrect ? (
                              <><CheckCircle2 className="w-4 h-4" /> Câu này đúng!</>
                            ) : (
                              <><XCircle className="w-4 h-4" /> Câu này sai. Đáp án đúng là {q.correctAnswer}</>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Actions */}
        <footer className="mt-12 pb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === i 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!isQuizComplete}
                  className={`flex-grow sm:flex-grow-0 px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isQuizComplete
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Nộp bài
                </button>
              ) : (
                <button
                  onClick={() => setShowResults(true)}
                  className="flex-grow sm:flex-grow-0 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  <Trophy className="w-5 h-5" />
                  Xem điểm số
                </button>
              )}
            </div>
          </div>
          
          {!isQuizComplete && !submitted && (
            <p className="text-center text-stone-400 text-sm mt-4 font-medium italic">
              * Bạn cần hoàn thành tất cả 100 câu để nộp bài
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
