import type { ISourceOptions } from "@tsparticles/engine";

export const subscribeButtonParticleOptions: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 15,
      density: {
        enable: false,
      },
    },
    color: {
      value: [
        "#7c3aed",
        "#bae6fd",
        "#a78bfa",
        "#93c5fd",
        "#0284c7",
        "#38bdf8",
      ],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 3 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 50,
        y: 50,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 50,
        y: 50,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 3,
        delay: 0.5,
      },
      position: {
        x: 50,
        y: 50,
      },
    },
  ],
};