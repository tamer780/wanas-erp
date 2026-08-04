/** Shared entrance motion helpers for list pages. */

export const cardEntrance = (index, animateEntrance, reduceMotion) => {
  if (!animateEntrance) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.01 },
    };
  }

  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.22,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const rowEntrance = (index, animateEntrance, reduceMotion) => {
  if (!animateEntrance) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.01 },
    };
  }

  return {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.2,
      delay: Math.min(index, 7) * 0.02,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};
