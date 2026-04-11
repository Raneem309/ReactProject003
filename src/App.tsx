import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   TYPES
========================= */

type AppView = "home" | "test" | "review" | "result" | "statistics" | "about";

type PioneerId = "atkins" | "may" | "saunderson" | "mills";

type QuestionId =
  | "machine"
  | "future"
  | "rhythm"
  | "environment"
  | "feeling"
  | "focus"
  | "musicPreference";

type AnswerValue =
  | "odyssey"
  | "tr909"
  | "tr808"
  | "tb303"
  | "moog"
  | "future"
  | "groove"
  | "soul"
  | "machine"
  | "precise"
  | "rolling"
  | "emotive"
  | "hypnotic"
  | "warehouse"
  | "club"
  | "city"
  | "system"
  | "tension"
  | "release"
  | "melody"
  | "repetition"
  | "concept"
  | "body"
  | "mind"
  | "yes"
  | "no";

type AnswerMap = Partial<Record<QuestionId, AnswerValue>>;
type ScoreMap = Record<PioneerId, number>;

interface Option {
  value: AnswerValue;
  label: string;
}

interface Question {
  id: QuestionId;
  prompt: string;
  options: Option[];
}

interface ResultData {
  id: PioneerId;
  title: string;
  description: string;
}

interface StoredEntry {
  id: number;
  createdAt: string;
  resultId: PioneerId;
  resultTitle: string;
}

/* =========================
   DATA
========================= */

const STORAGE_KEY = "detroit-techno-pioneer-results";

const questions: Question[] = [
  {
    id: "machine",
    prompt: "Which machine would you pick?",
    options: [
      { value: "odyssey", label: "ARP Odyssey" },
      { value: "tr909", label: "TR-909" },
      { value: "tr808", label: "TR-808" },
      { value: "tb303", label: "TB-303" },
      { value: "moog", label: "Moog" },
    ],
  },
  {
    id: "future",
    prompt: "What is your favorite element of a track?",
    options: [
      { value: "future", label: "The future" },
      { value: "groove", label: "The groove" },
      { value: "soul", label: "The soul" },
      { value: "machine", label: "The machine" },
    ],
  },
  {
    id: "rhythm",
    prompt: "What is the most important part of a techno track?",
    options: [
      { value: "precise", label: "Tight and precise" },
      { value: "rolling", label: "Rolling and physical" },
      { value: "emotive", label: "Warm and emotional" },
      { value: "hypnotic", label: "Repetitive and hypnotic" },
    ],
  },
  {
    id: "environment",
    prompt: "Which world would you rather score?",
    options: [
      { value: "city", label: "A city in the future" },
      { value: "warehouse", label: "A warehouse at 4 AM" },
      { value: "club", label: "A soulful club room" },
      { value: "system", label: "A room built around the sound system" },
    ],
  },
  {
    id: "feeling",
    prompt: "Which feeling keeps you coming back?",
    options: [
      { value: "tension", label: "Tension" },
      { value: "release", label: "Release" },
      { value: "melody", label: "Melody" },
      { value: "repetition", label: "Repetition" },
    ],
  },
  {
    id: "focus",
    prompt: "What do you focus on first?",
    options: [
      { value: "concept", label: "Concept" },
      { value: "body", label: "Body movement" },
      { value: "mind", label: "Structure and detail" },
      { value: "soul", label: "Emotion" },
    ],
  },
  {
    id: "musicPreference",
    prompt: "Do you want music to play in the background while you take this?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

const resultsMap: Record<PioneerId, ResultData> = {
  atkins: {
    id: "atkins",
    title: "Juan Atkins",
    description:
      "You lean futuristic, conceptual, and sleek. You are drawn to techno as an idea as much as a physical experience.",
  },
  may: {
    id: "may",
    title: "Derrick May",
    description:
      "You connect to emotion, movement, and high-tech soul. You like techno that feels dramatic, human, and alive.",
  },
  saunderson: {
    id: "saunderson",
    title: "Kevin Saunderson",
    description:
      "You respond to groove, directness, and body energy. You like techno that moves people immediately and powerfully.",
  },
  mills: {
    id: "mills",
    title: "Jeff Mills",
    description:
      "You are drawn to precision, tension, and machine-forward futurism. You like techno that feels stripped, sharp, and cosmic.",
  },
};

/* =========================
   HELPERS
========================= */

function createEmptyScores(): ScoreMap {
  return {
    atkins: 0,
    may: 0,
    saunderson: 0,
    mills: 0,
  };
}

function calculateResult(answers: AnswerMap) {
  const scores = createEmptyScores();

  const answerToPioneer: Partial<Record<AnswerValue, PioneerId>> = {
    odyssey: "atkins",
    tr909: "mills",
    tr808: "saunderson",
    tb303: "mills",
    moog: "may",

    future: "atkins",
    groove: "saunderson",
    soul: "may",
    machine: "mills",

    precise: "mills",
    rolling: "saunderson",
    emotive: "may",
    hypnotic: "atkins",

    city: "atkins",
    warehouse: "mills",
    club: "may",
    system: "saunderson",

    tension: "mills",
    release: "may",
    melody: "may",
    repetition: "atkins",

    concept: "atkins",
    body: "saunderson",
    mind: "mills",
  };

  Object.values(answers).forEach((answer) => {
    if (!answer) return;
    const pioneer = answerToPioneer[answer];
    if (pioneer) {
      scores[pioneer] += 1;
    }
  });

  const winner = (
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "atkins"
  ) as PioneerId;

  return {
    result: resultsMap[winner],
    scores,
  };
}

function loadEntries(): StoredEntry[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StoredEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: StoredEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getStatistics(entries: StoredEntry[]) {
  const counts: Record<PioneerId, number> = {
    atkins: 0,
    may: 0,
    saunderson: 0,
    mills: 0,
  };

  entries.forEach((entry) => {
    counts[entry.resultId] += 1;
  });

  return counts;
}

/* =========================
   UI
========================= */

interface TabsProps {
  currentView: AppView;
  onGoHome: () => void;
  onGoStatistics: () => void;
  onGoAbout: () => void;
}

function Tabs({ currentView, onGoHome, onGoStatistics, onGoAbout }: TabsProps) {
  const homeActive =
    currentView === "home" ||
    currentView === "test" ||
    currentView === "review" ||
    currentView === "result";

  return (
    <nav className="top-tabs" aria-label="Primary navigation">
      <button
        type="button"
        className={`top-tab ${homeActive ? "is-active" : ""}`}
        onClick={onGoHome}
      >
        Home
      </button>

      <button
        type="button"
        className={`top-tab ${currentView === "statistics" ? "is-active" : ""}`}
        onClick={onGoStatistics}
      >
        Statistics
      </button>

      <button
        type="button"
        className={`top-tab ${currentView === "about" ? "is-active" : ""}`}
        onClick={onGoAbout}
      >
        About
      </button>
    </nav>
  );
}

interface PersistentTitleProps {
  titleVisible: boolean;
  titlePinned: boolean;
}

function PersistentTitle({ titleVisible, titlePinned }: PersistentTitleProps) {
  return (
    <h1
      className={[
        "welcome-title",
        titleVisible ? "is-visible" : "",
        titlePinned ? "move-down" : "",
      ].join(" ")}
    >
      Which Detroit Techno Pioneer
      <br />
      Are You?
    </h1>
  );
}

interface HomeStartScreenProps {
  showStartButton: boolean;
  startLeaving: boolean;
  onStartClick: () => void;
}

function HomeStartScreen({
  showStartButton,
  startLeaving,
  onStartClick,
}: HomeStartScreenProps) {
  return (
    <div className="welcome-container">
      {showStartButton && (
        <button
          type="button"
          className={`start-button ${startLeaving ? "is-hidden" : ""}`}
          onClick={onStartClick}
          disabled={startLeaving}
        >
          Start Test
        </button>
      )}
    </div>
  );
}

interface QuestionSectionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedValue?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  onNext: () => void;
  canGoNext: boolean;
}

function QuestionSection({
  question,
  questionNumber,
  totalQuestions,
  selectedValue,
  onSelect,
  onNext,
  canGoNext,
}: QuestionSectionProps) {
  return (
    <div className="page-shell fade-in-screen">
      <div className="header-row">
        <div className="header-step">
          Question {questionNumber} of {totalQuestions}
        </div>
      </div>

      <section className="question-shell">
        <div className="question-copy">
          <span className="question-label">Q{questionNumber}</span>
          <h2 className="question-title">{question.prompt}</h2>
        </div>

        <div className="question-options">
          {question.options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`question-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="bottom-actions">
        <button
          type="button"
          className="primary-pill"
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ReviewSection({ onShowResult }: { onShowResult: () => void }) {
  return (
    <div className="page-shell fade-in-screen center-screen">
      <div className="review-block">
        <div className="review-kicker">Review</div>
        <h2 className="review-title">Ready to see your result?</h2>
        <p className="review-description">
          Your answers are in. View the Detroit techno pioneer your choices align with most.
        </p>
        <button type="button" className="primary-pill" onClick={onShowResult}>
          Show Result
        </button>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  description,
  scores,
  onRestart,
}: {
  title: string;
  description: string;
  scores: ScoreMap;
  onRestart: () => void;
}) {
  return (
    <div className="page-shell fade-in-screen center-screen">
      <div className="results-block">
        <div className="review-kicker">Your result</div>
        <h1 className="results-title">{title}</h1>
        <p className="review-description">{description}</p>

        <div className="results-stats">
          <div className="results-stat">
            <span className="results-stat-label">Juan Atkins</span>
            <span className="results-stat-value">{scores.atkins}</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-label">Derrick May</span>
            <span className="results-stat-value">{scores.may}</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-label">Kevin Saunderson</span>
            <span className="results-stat-value">{scores.saunderson}</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-label">Jeff Mills</span>
            <span className="results-stat-value">{scores.mills}</span>
          </div>
        </div>

        <div className="results-actions">
          <button type="button" className="primary-pill" onClick={onRestart}>
            Restart Test
          </button>
        </div>
      </div>
    </div>
  );
}

function StatisticsSection({ entries }: { entries: StoredEntry[] }) {
  const counts = getStatistics(entries);

  const bars = [
    { label: "Juan Atkins", value: counts.atkins },
    { label: "Derrick May", value: counts.may },
    { label: "Kevin Saunderson", value: counts.saunderson },
    { label: "Jeff Mills", value: counts.mills },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="page-shell fade-in-screen center-screen">
      <div className="stats-block">
        <div className="review-kicker">Statistics</div>
        <h2 className="review-title">Anonymous results so far</h2>
        <p className="review-description">
          A minimal live view of saved results from this browser.
        </p>

        <div className="stats-graph">
          {bars.map((bar) => (
            <div key={bar.label} className="stats-row">
              <div className="stats-label">{bar.label}</div>
              <div className="stats-bar-track">
                <div
                  className="stats-bar-fill"
                  style={{ width: `${(bar.value / maxValue) * 100}%` }}
                />
              </div>
              <div className="stats-value">{bar.value}</div>
            </div>
          ))}
        </div>

        <div className="stats-total">Total entries: {entries.length}</div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="page-shell fade-in-screen center-screen">
      <div className="about-block">
        <div className="review-kicker">About</div>
        <h2 className="review-title">About this test</h2>
        <p className="review-description">
          This is a React + TypeScript personality test built around historically inspired
          Detroit techno archetypes.
        </p>
        <p className="review-description">
          It demonstrates typed state, multi-step UI flow, event handling, conditional
          rendering, local persistence, and lightweight analytics.
        </p>
        <p className="review-description">
          You can expand this section later with more project context, references, or your
          GitHub for issues and questions.
        </p>
      </div>
    </div>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [savedEntries, setSavedEntries] = useState<StoredEntry[]>([]);

  const [titleVisible, setTitleVisible] = useState(false);
  const [titlePinned, setTitlePinned] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [startLeaving, setStartLeaving] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canGoNext = Boolean(currentAnswer);
  const resultData = useMemo(() => calculateResult(answers), [answers]);

  useEffect(() => {
    setSavedEntries(loadEntries());

    const titleTimer = window.setTimeout(() => {
      setTitleVisible(true);
    }, 250);

    const pinTimer = window.setTimeout(() => {
      setTitlePinned(true);
    }, 3500);

    const buttonTimer = window.setTimeout(() => {
      setShowStartButton(true);
    }, 2200);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(pinTimer);
      window.clearTimeout(buttonTimer);
    };
  }, []);

  function goHome() {
    setCurrentView("home");
    setShowStartButton(true);
    setStartLeaving(false);
    setTitlePinned(true);
  }

  function goStatistics() {
    setCurrentView("statistics");
    setShowStartButton(false);
    setTitlePinned(true);
  }

  function goAbout() {
    setCurrentView("about");
    setShowStartButton(false);
    setTitlePinned(true);
  }

  function handleStartClick() {
    setStartLeaving(true);

    window.setTimeout(() => {
      setShowStartButton(false);
      setTitlePinned(true);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentView("test");
      setStartLeaving(false);
    }, 1200);
  }

  function handleSelectAnswer(value: AnswerValue) {
    if (!currentQuestion) return;

    const nextAnswers: AnswerMap = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);

    if (currentQuestion.id === "musicPreference") {
      const audio = audioRef.current;

      if (audio) {
        if (value === "yes") {
          void audio.play().catch(() => {});
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }
  }

  function handleNextQuestion() {
    if (!canGoNext) return;

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      setCurrentView("review");
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  function handleShowResult() {
    const entry: StoredEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      resultId: resultData.result.id,
      resultTitle: resultData.result.title,
    };

    const updatedEntries = [entry, ...savedEntries];
    setSavedEntries(updatedEntries);
    saveEntries(updatedEntries);
    setCurrentView("result");
  }

  function handleRestartTest() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentView("home");
    setShowStartButton(true);
    setStartLeaving(false);
    setTitlePinned(true);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return (
    <div className="app-shell">
      <audio ref={audioRef} loop>
        <source src="/RAH - Carnage (Master).wav" type="audio/wav" />
      </audio>

      <Tabs
        currentView={currentView}
        onGoHome={goHome}
        onGoStatistics={goStatistics}
        onGoAbout={goAbout}
      />

      <PersistentTitle titleVisible={titleVisible} titlePinned={titlePinned} />

      {currentView === "home" && (
        <HomeStartScreen
          showStartButton={showStartButton}
          startLeaving={startLeaving}
          onStartClick={handleStartClick}
        />
      )}

      {currentView === "test" && currentQuestion && (
        <QuestionSection
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedValue={currentAnswer}
          onSelect={handleSelectAnswer}
          onNext={handleNextQuestion}
          canGoNext={canGoNext}
        />
      )}

      {currentView === "review" && <ReviewSection onShowResult={handleShowResult} />}

      {currentView === "result" && (
        <ResultSection
          title={resultData.result.title}
          description={resultData.result.description}
          scores={resultData.scores}
          onRestart={handleRestartTest}
        />
      )}

      {currentView === "statistics" && <StatisticsSection entries={savedEntries} />}

      {currentView === "about" && <AboutSection />}
    </div>
  );
}