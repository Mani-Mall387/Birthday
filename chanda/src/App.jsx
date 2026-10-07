import { useState, useEffect, useRef } from "react";
import "./App.css";

/*
  Only two photos needed. Put them in public/images/ and set the paths here.
  position = which part of the photo stays visible inside the frame.
*/
const PHOTOS = {
  portrait: { src: "/chandaImg1.png", position: "50% 22%" },
  full: { src: "/chandaImg2.png", position: "50% 12%" },
};

function Photo({ photo, alt }) {
  const p = PHOTOS[photo];
  return (
    <div className="photo arch">
      <img src={p.src} alt={alt} style={{ objectPosition: p.position }} />
    </div>
  );
}

const pages = [
  { type: "cover" },

  {
    type: "photo",
    photo: "portrait",
    title: "Happy Birthday! 🎂",
    text: "To a cousin who is family, however far apart we are.",
  },

  {
    type: "message",
    title: "Hey Cousin... 💙",
    text: `We haven't met much since we were kids, and I wish we had.

But distance never changes family, and I'm really glad you're my sister.

Today is all about you.`,
  },

  {
    type: "photo",
    photo: "full",
    title: "Keep Singing 🎶",
    text: "Your voice is a real gift. Never stop using it.",
  },

  {
    type: "wishes",
    title: "Wishes For Your Year 💙",
    items: [
      ["🎤", "More songs, and bigger stages"],
      ["🌊", "Days as calm and blue as your favourite colour"],
      ["🫶", "More family time, so we meet a lot more"],
    ],
  },

  {
    type: "final",
    title: "Happy Birthday, Cousin! 🥳",
    text: `Keep smiling.
Keep singing.
Keep being you.

And next time we meet...

You owe me a song. 🎤💙`,
  },
];

const notes = ["♪", "♫", "♪", "♬", "♫", "♪", "♬", "♫", "♪"].map((n, i) => ({
  n,
  left: `${6 + i * 10.5}%`,
  delay: `${(i % 5) * 0.9}s`,
  duration: `${6 + (i % 4)}s`,
}));

function App() {
  const [page, setPage] = useState(0);
  const touchStart = useRef(null);
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const [audioError, setAudioError] = useState(false);

const startMusic = () => {
  const a = audioRef.current;
  if (!a || musicOn) return;
  a.currentTime = 0;   // <- start from the beginning
  a.volume = 0.45;
  a.play().then(() => setMusicOn(true)).catch(() => setAudioError(true));
};
const restartCard = () => {
  const a = audioRef.current;
  if (a) a.currentTime = 0;
  setPage(0);
};

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.play().then(() => setMusicOn(true)).catch(() => setAudioError(true));
    }
  };

  const openCard = () => {
    startMusic();
    nextPage();
  };

  const nextPage = () => setPage((p) => Math.min(p + 1, pages.length - 1));
  const previousPage = () => setPage((p) => Math.max(p - 1, 0));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") previousPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // swipe left = next, swipe right = back (phones)
  const onTouchStart = (e) => {
    touchStart.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) nextPage();
    else previousPage();
  };

  const current = pages[page];
  const isLast = page === pages.length - 1;
  useEffect(() => {
  const a = audioRef.current;
  if (!a) return;
  a.volume = 0.45;
  a.currentTime = 0;

  const events = ["click", "touchend", "keydown"];
  const stopListening = () =>
    events.forEach((e) => window.removeEventListener(e, onFirstTap));

  // runs on her first tap, click or key press anywhere
  function onFirstTap() {
    a.play()
      .then(() => {
        setMusicOn(true);
        stopListening();
      })
      .catch(() => {});
  }

  // 1. try straight away (works only if the browser allows it)
  a.play()
    .then(() => setMusicOn(true))
    .catch(() => {
      // 2. blocked: wait for the first tap
      events.forEach((e) => window.addEventListener(e, onFirstTap));
    });

  return stopListening;
}, []);
  return (
    <div className="birthday-app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <div className="header">
        <span>For my cousin 💙</span>
        <div className="header-right">
          <div className="dots" aria-label={`Page ${page + 1} of ${pages.length}`}>
            {pages.map((_, i) => (
              <span key={i} className={i === page ? "dot active" : "dot"} />
            ))}
          </div>

          {page !== 0 && (
            <button
              className="music-btn"
              onClick={toggleMusic}
              aria-label={musicOn ? "Pause music" : "Play music"}
            >
              {musicOn ? "🔊" : "🔇"}
            </button>
          )}
        </div>
      </div>

      {/* Put your song at public/music/song.mp3 */}
      <audio
        ref={audioRef}
        src="/music/song.mp3"
        loop
        preload="auto"
        onError={() => setAudioError(true)}
      />

      <main
        className="card-container"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={page}
          className={`birthday-card ${current.type}-card`}
          onClick={current.type === "cover" ? openCard : undefined}
        >
          {/* COVER */}
          {current.type === "cover" && (
            <div className="card-content cover">
              <div className="staff" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <span className="note">♫</span>
              </div>

              <p className="small-text">Open me</p>

              <h1>
                Happy
                <br />
                Birthday
              </h1>

              <p className="subtitle">A little song-sized gift, from your cousin</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCard();
                }}
              >
                Open 💌
              </button>
            </div>
          )}

          {/* PHOTO */}
          {current.type === "photo" && (
            <div className="card-content">
              <Photo photo={current.photo} alt="Birthday portrait" />
              <h2>{current.title}</h2>
              <p className="caption">{current.text}</p>
            </div>
          )}

          {/* MESSAGE */}
          {current.type === "message" && (
            <div className="card-content message">
              <div className="big-heart">💙</div>
              <h2>{current.title}</h2>
              <p className="message-text">{current.text}</p>
            </div>
          )}

          {/* WISHES */}
          {current.type === "wishes" && (
            <div className="card-content wishes">
              <h2>{current.title}</h2>
              <ul className="wish-list">
                {current.items.map(([icon, text]) => (
                  <li key={text}>
                    <span className="wish-icon">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FINAL */}
          {current.type === "final" && (
            <div className="card-content final">
              <div className="notes" aria-hidden="true">
                {notes.map((n, i) => (
                  <span
                    key={i}
                    style={{
                      left: n.left,
                      animationDelay: n.delay,
                      animationDuration: n.duration,
                    }}
                  >
                    {n.n}
                  </span>
                ))}
              </div>

              <div className="cake">🎂</div>
              <h1>{current.title}</h1>
              <p className="final-message">{current.text}</p>

            
              <button className="ghost" onClick={restartCard}>
  Read again
</button>
            </div>
          )}
        </div>
      </main>

      <div className="controls">
        <button
          className="nav-button"
          onClick={previousPage}
          disabled={page === 0}
          aria-label="Previous page"
        >
          ←
        </button>

        {page !== 0 && !isLast && (
          <span className="hint">Tap next or swipe 💙</span>
        )}

        {page !== 0 && !isLast && (
          <button className="nav-button" onClick={nextPage} aria-label="Next page">
            →
          </button>
        )}
      </div>

      {audioError && (
        <p className="music-error">
          Music file not found. Add it at public/music/song.mp3
        </p>
      )}

      <div className="footer">Made with 💙 just for you</div>
    </div>
  );
}

export default App;