// src/components/ParticleBackground.jsx
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: false, // Disable full screen
        },
        particles: {
          number: {
            value: 100, // Number of particles
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff", // Particle color
          },
          shape: {
            type: "circle", // Shape of particles
          },
          opacity: {
            value: 0.5, // Opacity of particles
            random: false,
            anim: {
              enable: false,
            },
          },
          size: {
            value: 5, // Size of particles
            random: true,
            anim: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "bounce" },
            bounce: false,
            attract: {
              enable: false,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, // Ensure particles are behind other content
      }}
    />
  );
};

export default ParticleBackground;