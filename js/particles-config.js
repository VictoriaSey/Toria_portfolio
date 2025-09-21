// Configuration for tsParticles - New "Floating Up" Effect
const particleConfig = {
  particles: {
    number: {
      value: 60, // A few less particles for a cleaner look
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: "#03dac6" // Accent color for dark mode
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: { min: 0.1, max: 0.6 } // Random opacity for a twinkling effect
    },
    size: {
      value: { min: 1, max: 3 } // Small, varied particle sizes
    },
    line_linked: {
      enable: false // This disables the connecting lines
    },
    move: {
      enable: true,
      speed: 1, // A gentle upward speed
      direction: "top",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble" // Change interaction to bubble on hover
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 250,
        size: 5,
        duration: 2,
        opacity: 0.8
      },
      push: {
        quantity: 4
      }
    }
  },
  retina_detect: true
};

const lightParticleConfig = {
  ...particleConfig, // Inherit all settings from the dark mode config
  particles: {
    ...particleConfig.particles,
    color: {
      value: "#6200ea" // Change particle color for light mode
    }
  }
};
