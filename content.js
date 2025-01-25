const ICONS = {
  SPEAKER: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>`,
  LOADING: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="animate-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>`,
  WAVEFORM: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waveform"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>`,
};

function findTargetDivs() {
  const dropdownSVGs = document.querySelectorAll('svg[width="10"][height="6"]');

  dropdownSVGs.forEach((svg) => {
    const paths = svg.querySelectorAll("path");
    if (paths.length === 2) {
      const path2 = paths[1].getAttribute("d");

      if (
        path2 ===
        "M8.197 1.206L5.288 4.208c-.4.413-.484.982-.187 1.27.298.289.864.187 1.265-.227L9.274 2.25c.401-.414.485-.983.187-1.271-.297-.288-.863-.187-1.264.227z"
      ) {
        const thoughtDiv = svg.closest(config.SELECTORS.THOUGHT_DIV);

        if (
          thoughtDiv &&
          !thoughtDiv.nextElementSibling?.classList.contains(
            "audio-extract-button"
          )
        ) {
          const button = createAudioButton();
          thoughtDiv.style.position = "relative";
          thoughtDiv.appendChild(button);

          button.addEventListener("click", async () => {
            if (thoughtDiv) {
              const contentDiv = thoughtDiv.querySelector(
                config.SELECTORS.CONTENT_DIV
              );
              if (contentDiv) {
                const textContent = contentDiv.textContent.trim();
                await generateAndPlayAudio(textContent, button);
              }
            }
          });
        }
      }
    }
  });
}

function getCurrentTheme() {
  const themePreference = localStorage.getItem('__appKit_@deepseek/chat_themePreference-');
  if (themePreference) {
    try {
      const theme = JSON.parse(themePreference);
      return theme.value;
    } catch (e) {
      console.error('Error parsing theme preference:', e);
    }
  }
  return 'light'; // default theme
}

function createAudioButton() {
  const theme = getCurrentTheme().toUpperCase();
  const button = document.createElement("button");
  button.className = "audio-extract-button";
  button.innerHTML = ICONS.SPEAKER;

  Object.assign(button.style, {
    position: "absolute",
    right: "-50px",
    top: "0",
    transform: "translateY(-50%)",
    padding: config.BUTTON_SIZE.PADDING,
    backgroundColor: config.BUTTON_COLORS[theme].DEFAULT_BG,
    color: config.BUTTON_STYLES[theme].DEFAULT_COLOR,
    border: `1px solid ${config.BUTTON_STYLES[theme].DEFAULT_BORDER}`,
    borderRadius: "50%",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: config.BUTTON_SIZE.WIDTH,
    height: config.BUTTON_SIZE.HEIGHT,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  });

  button.addEventListener("mouseover", () => {
    if (
      button.dataset.state !== "loading" &&
      button.dataset.state !== "playing"
    ) {
      Object.assign(button.style, {
        backgroundColor: config.BUTTON_COLORS[theme].HOVER_BG,
        color: config.BUTTON_STYLES[theme].HOVER_COLOR,
        borderColor: config.BUTTON_STYLES[theme].HOVER_BORDER,
        transform: "translateY(-50%) scale(1.05)",
      });
    }
  });

  button.addEventListener("mouseout", () => {
    if (
      button.dataset.state !== "loading" &&
      button.dataset.state !== "playing"
    ) {
      Object.assign(button.style, {
        backgroundColor: config.BUTTON_COLORS[theme].DEFAULT_BG,
        color: config.BUTTON_STYLES[theme].DEFAULT_COLOR,
        borderColor: config.BUTTON_STYLES[theme].DEFAULT_BORDER,
        transform: "translateY(-50%) scale(1)",
      });
    }
  });

  return button;
}

const BUTTON_STATES = {
  DEFAULT: "default",
  LOADING: "loading",
  PLAYING: "playing",
};

function updateButtonState(button, state) {
  const theme = getCurrentTheme().toUpperCase();
  button.dataset.state = state;
  button.style.pointerEvents = state === BUTTON_STATES.DEFAULT ? "auto" : "none";

  const styles = {
    [BUTTON_STATES.DEFAULT]: {
      icon: ICONS.SPEAKER,
      backgroundColor: config.BUTTON_COLORS[theme].DEFAULT_BG,
      borderColor: config.BUTTON_STYLES[theme].DEFAULT_BORDER,
      color: config.BUTTON_STYLES[theme].DEFAULT_COLOR,
    },
    [BUTTON_STATES.LOADING]: {
      icon: ICONS.LOADING,
      backgroundColor: theme === 'LIGHT' ? "#e5e7eb" : "#4b5563",
      borderColor: theme === 'LIGHT' ? "#d1d5db" : "#6b7280",
      color: theme === 'LIGHT' ? "#374151" : "#e5e7eb",
    },
    [BUTTON_STATES.PLAYING]: {
      icon: ICONS.WAVEFORM,
      backgroundColor: "#4338ca",
      borderColor: "#4f46e5",
      color: "#e0e7ff",
    },
  };

  const currentStyle = styles[state];
  button.innerHTML = currentStyle.icon;
  
  Object.assign(button.style, {
    backgroundColor: currentStyle.backgroundColor,
    borderColor: currentStyle.borderColor,
    color: currentStyle.color,
    transform: "translateY(-50%) scale(1)",
  });
}

async function makeInitialRequest(text) {
  const response = await fetch(
    "https://queue.fal.run/fal-ai/playai/tts/dialog",
    {
      method: "POST",
      headers: {
        Authorization: `Key ${config.FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: config.env === "dev" ? "Hello, world!" : text,
        voices: [
          {
            voice: "Jennifer (English (US)/American)",
            turn_prefix: "Speaker 1: ",
          },
        ],
      }),
    }
  );
  const data = await response.json();
  return data.request_id;
}

async function pollForCompletion(requestId) {
  let status = "IN_QUEUE";
  
  while (status === "IN_QUEUE" || status === "IN_PROGRESS") {
    const statusResponse = await fetch(
      `https://queue.fal.run/fal-ai/playai/requests/${requestId}/status`,
      {
        headers: { Authorization: `Key ${config.FAL_API_KEY}` },
      }
    );
    const statusData = await statusResponse.json();
    status = statusData.status;
    
    if (status === "COMPLETED") {
      return true;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  return false;
}

async function getAndPlayAudio(requestId, button) {
  const resultResponse = await fetch(
    `https://queue.fal.run/fal-ai/playai/requests/${requestId}`,
    {
      headers: { Authorization: `Key ${config.FAL_API_KEY}` },
    }
  );
  const resultData = await resultResponse.json();

  if (resultData.audio && resultData.audio.url) {
    const audio = new Audio(resultData.audio.url);
    
    updateButtonState(button, BUTTON_STATES.PLAYING);

    audio.addEventListener("ended", () => {
      updateButtonState(button, BUTTON_STATES.DEFAULT);
    });

    audio.addEventListener("pause", () => {
      updateButtonState(button, BUTTON_STATES.DEFAULT);
    });

    try {
      await audio.play();
      return true;
    } catch (error) {
      console.error("Error playing audio:", error);
      updateButtonState(button, BUTTON_STATES.DEFAULT);
      return false;
    }
  }
  return false;
}

async function generateAndPlayAudio(text, button) {
  let audio = null;

  try {
    updateButtonState(button, BUTTON_STATES.LOADING);
    const requestId = await makeInitialRequest(text);
    
    let status = "IN_QUEUE";
    while (status === "IN_QUEUE" || status === "IN_PROGRESS") {
      const statusResponse = await fetch(
        `https://queue.fal.run/fal-ai/playai/requests/${requestId}/status`,
        {
          headers: { Authorization: `Key ${config.FAL_API_KEY}` },
        }
      );
      const statusData = await statusResponse.json();
      status = statusData.status;
      
      if (status === "COMPLETED") {
        break;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (status !== "COMPLETED") {
      throw new Error("Failed to generate audio");
    }

    const resultResponse = await fetch(
      `https://queue.fal.run/fal-ai/playai/requests/${requestId}`,
      {
        headers: { Authorization: `Key ${config.FAL_API_KEY}` },
      }
    );
    const resultData = await resultResponse.json();

    if (!resultData.audio?.url) {
      throw new Error("No audio URL received");
    }

    audio = new Audio(resultData.audio.url);

    await audio.play();
    return true;
  } catch (error) {
    console.error("Error in audio generation process:", error);
    updateButtonState(button, BUTTON_STATES.DEFAULT);
    return false;
  } finally {
    updateButtonState(button, BUTTON_STATES.DEFAULT);
  }
}

findTargetDivs();

setInterval(findTargetDivs, 2000);

const themeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      const buttons = document.querySelectorAll('.audio-extract-button');
      buttons.forEach(button => {
        if (button.dataset.state === BUTTON_STATES.DEFAULT) {
          const theme = getCurrentTheme().toUpperCase();
          Object.assign(button.style, {
            backgroundColor: config.BUTTON_COLORS[theme].DEFAULT_BG,
            color: config.BUTTON_STYLES[theme].DEFAULT_COLOR,
            borderColor: config.BUTTON_STYLES[theme].DEFAULT_BORDER,
          });
        }
      });
    }
  });
});

themeObserver.observe(document.documentElement, {
  childList: true,
  characterData: true,
  subtree: true
});
