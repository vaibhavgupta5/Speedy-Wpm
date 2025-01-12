"use client";
import React, { useEffect, useState } from "react";

function Page() {
  const [sent, setsent] = useState(
    "Please Wait, Generating a random sentence for you..."
  );
  const [sentence, setSentence] = useState("");
  const [esentLength, setEsentLength] = useState(0);
  const [err, setErr] = useState(0);
  const [time, setTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeOver, setTimeOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [errIndices, setErrIndices] = useState<number[]>([]);

  const subjects = [
    "The cat",
    "A programmer",
    "My teacher",
    "An astronaut",
    "A random stranger",
  ];
  const verbs = ["jumps over", "codes", "teaches", "explores", "observes"];
  const objects = [
    "the moon",
    "a new framework",
    "a curious student",
    "the universe",
    "a butterfly",
  ];
  const adverbs = [
    "quickly",
    "intensely",
    "gracefully",
    "silently",
    "enthusiastically",
  ];
  const extras = [
    "while thinking about life",
    "under the starry sky",
    "with great precision",
    "despite the challenges",
    "in an inspiring manner",
  ];

  function generateRandomLongSentence() {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    const adverb = adverbs[Math.floor(Math.random() * adverbs.length)];
    const extra = extras[Math.floor(Math.random() * extras.length)];
    return `${subject} ${verb} ${object} ${adverb}, ${extra}, creating a memorable scene filled with imagination, creativity, and wonder, captivating everyone who witnesses it and sparking conversations that resonate deeply.`;
  }

  useEffect(() => {
    setsent(generateRandomLongSentence());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (started && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && started) {
      setTimeOver(true);
      checkError();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [started, timeLeft]);

  const startCheck = () => {
    setTimeLeft(time || 10);
    setStarted(true);
    setSentence(""); // Reset the typed sentence
    setErr(0); // Reset errors
    setErrIndices([]); // Reset error indices
    setTimeOver(false); // Reset timer
  };

  const checkError = () => {
    const errors: number[] = [];
    let errorCount = 0;

    for (let i = 0; i < sent.length; i++) {
      if (sent[i] !== sentence[i]) {
        errors.push(i);
        errorCount++;
      }
    }

    setErr(errorCount);
    setErrIndices(errors);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (timeOver || !started) return;

    if (event.key.length === 1) {
      setSentence((prev) => {
        const newSentence = prev + event.key;
        checkError();
        console.log(newSentence)
        return newSentence;
      });
    } else if (event.key === "Backspace") {
      setSentence((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [started, sentence, timeOver]);

  const renderSentence = () => {
    return sent.split("").map((char, index) => (
      <span
        key={index}
        style={{
          color: errIndices.includes(index) ? "red" : "white",
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="max-w-xl w-full text-center">
        <p className="text-lg font-semibold mb-4">{renderSentence()}</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <label htmlFor="timeSelect" className="text-sm font-medium">
            Select Time:
          </label>
          <select
            id="timeSelect"
            className="text-black rounded-md px-3 py-2 focus:ring focus:ring-indigo-500"
            onChange={(e) => setTime(parseInt(e.target.value))}
          >
            <option value="">Select</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Time Left: <span className="font-medium text-white">{timeLeft}</span>{" "}
          seconds
        </p>
        <div className="flex flex-col items-center gap-4 relative">
          <button
            className={`px-6 py-2 absolute top-[40%] ${
              started && "hidden"
            } bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            onClick={startCheck}
          >
            Start
          </button>
        </div>
        {timeOver && (
          <p className="text-red-500 mt-3">Time is over! Check your score.</p>
        )}
        <p className="text-lg mt-6 font-semibold">
          WPM:{" "}
          <span className="text-indigo-500">
            {(esentLength - err) / 5 / (time / 60)}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Page;
