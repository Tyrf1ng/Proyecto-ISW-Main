export const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        bounce: 0.2,        
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };
  