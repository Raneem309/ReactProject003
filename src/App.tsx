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

/* =========================
   QUESTIONS
========================= */

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

/* =========================
   RESULTS
========================= */

const resultsMap: Record<PioneerId, ResultData> = {
  atkins: {
    id: "atkins",
    title: "Juan Atkins",
    description: "Futuristic, conceptual, machine soul.",
  },
  may: {
    id: "may",
    title: "Derrick May",
    description: "Emotional, expressive, high-tech soul.",
  },
  saunderson: {
    id: "saunderson",
    title: "Kevin Saunderson",
    description: "Groove-driven, physical, direct.",
  },
  mills: {
    id: "mills",
    title: "Jeff Mills",
    description: "Precise, hypnotic, machine-forward.",
  },
};

/* =========================
   APP
========================= */

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  function fadeIn(audio: HTMLAudioElement) {
    if (fadeRef.current) clearInterval(fadeRef.current);

    audio.volume = 0;

    fadeRef.current = window.setInterval(() => {
      if (audio.volume < 0.7) {
        audio.volume = Math.min(audio.volume + 0.02, 0.7);
      } else {
        if (fadeRef.current) clearInterval(fadeRef.current);
      }
    }, 100);
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.play();
      fadeIn(audio);
    } else {
      audio.pause();
      audio.volume = 0;
    }

    setIsMuted(!isMuted);
  }

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src={trackFile} type="audio/mpeg" />
      </audio>

      <button onClick={toggleAudio}>
        {isMuted ? "Unmute" : "Mute"}
      </button>

      <h1>Which Detroit Techno Pioneer Are You?</h1>

      {currentQuestion && (
        <div>
          <h2>{currentQuestion.prompt}</h2>

          {currentQuestion.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setAnswers({ ...answers, [currentQuestion.id]: opt.value })
              }
            >
              {opt.label}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) => prev + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}