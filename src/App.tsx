import { useEffect, useMemo, useRef, useState } from "react";
import trackFile from "./assets/idontknow.mp3";

/* =========================
   TYPES
========================= */

type AppView = "home" | "test" | "review" | "result" | "statistics" | "about";

type PioneerId = "atkins" | "may" | "saunderson" | "mills";

type QuestionId =
  | "machine"
  | "elements"
  | "soundDesign"
  | "dreamSet"
  | "feeling"
  | "focus"
  | "label";

type AnswerValue =
  | "odyssey"
  | "tr808_909"
  | "tb303"
  | "moog"
  | "kick"
  | "bass"
  | "percussion"
  | "synth"
  | "synths"
  | "groove"
  | "bassLine"
  | "atmosphere"
  | "space"
  | "warehouse"
  | "club"
  | "sound"
  | "tension"
  | "floor"
  | "dissonance"
  | "repetition"
  | "kraftwerk"
  | "inner"
  | "ur"
  | "model500"
  | "transmat"
  | "metroplex"
  | "axis"
  | "kms";

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
      { value: "tr808_909", label: "TR-808/909" },
      { value: "tb303", label: "TB-303" },
      { value: "moog", label: "Moog" },
    ],
  },
  {
    id: "elements",
    prompt: "What is your favorite element of a track?",
    options: [
      { value: "kick", label: "Kick" },
      { value: "bass", label: "Bass" },
      { value: "percussion", label: "Percussion" },
      { value: "synth", label: "Synth" },
    ],
  },
  {
    id: "soundDesign",
    prompt: "What do you notice first in a Techno Track?",
    options: [
      { value: "synths", label: "Synths/Stabs" },
      { value: "groove", label: "Groove" },
      { value: "bassLine", label: "Bass Line" },
      { value: "atmosphere", label: "Atmosphere" },
    ],
  },
  {
    id: "dreamSet",
    prompt: "Where are you picking to play a techno set?",
    options: [
      { value: "space", label: "In Space" },
      { value: "warehouse", label: "In a warehouse" },
      { value: "club", label: "the biggest club in the world" },
      { value: "sound", label: "Sound Designed Room" },
    ],
  },
  {
    id: "feeling",
    prompt: "Which feeling keeps you stuck to the dance floor?",
    options: [
      { value: "tension", label: "Tension" },
      { value: "floor", label: "4onthefloor" },
      { value: "dissonance", label: "Dissonance" },
      { value: "repetition", label: "Repetition" },
    ],
  },
  {
    id: "focus",
    prompt: "Which group inspires your sound the most?",
    options: [
      { value: "kraftwerk", label: "Kraftwerk" },
      { value: "inner", label: "Inner City" },
      { value: "ur", label: "Underground Resistance" },
      { value: "model500", label: "Model 500" },
    ],
  },
  {
    id: "label",
    prompt: "Which label do you resonate the most with?",
    options: [
      { value: "transmat", label: "Transmat" },
      { value: "metroplex", label: "Metroplex" },
      { value: "axis", label: "Axis Records" },
      { value: "kms", label: "KMS" },
    ],
  },
];

const resultsMap: Record<PioneerId, ResultData> = {
  atkins: {
    id: "atkins",
    title: "Juan Atkins",
    description:
      "You lean futuristic, conceptual, and forward thinking. You are drawn to techno as an idea as much as a feeling, and your choices point to sleek vision, innovation, and machine soul.",
  },
  may: {
    id: "may",
    title: "Derrick May",
    description:
      "You connect most with tension, atmosphere, and emotional impact. Your sound feels expressive, dramatic, and alive, balancing movement with feeling in a way that keeps techno human.",
  },
  saunderson: {
    id: "saunderson",
    title: "Kevin Saunderson",
    description:
      "You respond to groove, directness, and body energy. Your choices show a love for rhythm, drive, and immediate connection, the kind of techno that locks people into motion fast.",
  },
  mills: {
    id: "mills",
    title: "Jeff Mills",
    description:
      "You are drawn to precision, repetition, tension, and stripped machine energy. Your instincts point toward focused, disciplined, high impact techno with a sharp futuristic edge.",
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

  const answerToPioneer: Record<AnswerValue, PioneerId> = {
    odyssey: "atkins",
    tr808_909: "mills",
    tb303: "mills",
    moog: "may",

    kick: "mills",
    bass: "saunderson",
    percussion: "saunderson",
    synth: "atkins",

    synths: "atkins",
    groove: "saunderson",
    bassLine: "may",
    atmosphere: "may",

    space: "atkins",
    warehouse: "mills",
    club: "saunderson",
    sound: "mills",

    tension: "may",
    floor: "saunderson",
    dissonance: "mills",
    repetition: "mills",

    kraftwerk: "atkins",
    inner: "saunderson",
    ur: "mills",
    model500: "atkins",

    transmat: "may",
    metroplex: "atkins",
    axis: "mills",
    kms: "saunderson",
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

interface AudioStatusProps {
  isMuted: boolean;
  isPlaying: boolean;
  onToggleMute: () => void;
}

function AudioStatus({ isMuted, isPlaying, onToggleMute }: AudioStatusProps) {
  return (
    <div className="audio-status">
      <div className="audio-status-light" aria-hidden="true" />
      <span className="audio-status-text">
        {isMuted ? "Audio muted" : isPlaying ? "Audio on" : "Audio ready"}
      </span>
      <button type="button" className="audio-toggle" onClick={onToggleMute}>
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}

interface PersistentTitleProps {
  titleVisible: boolean;
  isHomeCentered: boolean;
}

function PersistentTitle({
  titleVisible,
  isHomeCentered,
}: PersistentTitleProps) {
  return (
    <h1
      id={isHomeCentered ? "welcome-title-home" : "welcome-title-footer"}
      className={[
        "welcome-title",
        titleVisible ? "is-visible" : "",
        isHomeCentered ? "is-home" : "is-footer",
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
          This is a React and TypeScript personality test built around Detroit techno pioneers.
        </p>
        <p className="review-description">
          The questions route your answers toward Juan Atkins, Derrick May, Kevin Saunderson,
          or Jeff Mills based on your instincts around sound, groove, tension, machines, and
          labels.
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
  const [showStartButton, setShowStartButton] = useState(false);
  const [startLeaving, setStartLeaving] = useState(false);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const canGoNext = Boolean(currentAnswer);
  const resultData = useMemo(() => calculateResult(answers), [answers]);

  const isHomeCentered = currentView === "home";

  function clearFadeInterval() {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }

  function fadeInAudio(
    audio: HTMLAudioElement,
    targetVolume = 0.7,
    duration = 4000
  ) {
    clearFadeInterval();
    audio.volume = 0;

    const intervalTime = 100;
    const steps = Math.max(1, Math.floor(duration / intervalTime));
    const volumeStep = targetVolume / steps;

    fadeIntervalRef.current = window.setInterval(() => {
      const nextVolume = Math.min(audio.volume + volumeStep, targetVolume);
      audio.volume = nextVolume;

      if (nextVolume >= targetVolume) {
        clearFadeInterval();
      }
    }, intervalTime);
  }

  async function startAudioWithFade() {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    try {
      audio.muted = false;
      await audio.play();
      fadeInAudio(audio, 0.7, 4000);
    } catch {
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    setSavedEntries(loadEntries());

    const titleTimer = window.setTimeout(() => {
      setTitleVisible(true);
    }, 250);

    const buttonTimer = window.setTimeout(() => {
      setShowStartButton(true);
    }, 2200);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(buttonTimer);
      clearFadeInterval();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      clearFadeInterval();
      audio.pause();
      audio.muted = true;
      audio.volume = 0;
      setIsPlaying(false);
      return;
    }

    audio.muted = false;
    void startAudioWithFade();
  }, [isMuted]);

  function handleToggleMute() {
    setIsMuted((prev) => !prev);
  }

  function goHome() {
    setCurrentView("home");
    setShowStartButton(true);
    setStartLeaving(false);
  }

  function goStatistics() {
    setCurrentView("statistics");
    setShowStartButton(false);
    setStartLeaving(false);
  }

  function goAbout() {
    setCurrentView("about");
    setShowStartButton(false);
    setStartLeaving(false);
  }

  function handleStartClick() {
    setStartLeaving(true);

    if (isMuted) {
      setIsMuted(false);
    }

    window.setTimeout(() => {
      setShowStartButton(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentView("test");
      setStartLeaving(false);
    }, 500);
  }

  function handleSelectAnswer(value: AnswerValue) {
    if (!currentQuestion) return;

    const nextAnswers: AnswerMap = {
      ...answers,
      [currentQuestion.id]: value,
    };

    setAnswers(nextAnswers);
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
  }

  return (
    <div className="app-shell">
      <audio ref={audioRef} loop preload="auto">
        <source src={trackFile} type="audio/mpeg" />
      </audio>

      <AudioStatus
        isMuted={isMuted}
        isPlaying={isPlaying}
        onToggleMute={handleToggleMute}
      />

      <Tabs
        currentView={currentView}
        onGoHome={goHome}
        onGoStatistics={goStatistics}
        onGoAbout={goAbout}
      />

      <PersistentTitle
        titleVisible={titleVisible}
        isHomeCentered={isHomeCentered}
      />

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