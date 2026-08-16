export const getTimeBasedGreeting = (): string => {
    const currentHour = new Date().getHours();
  
    if (currentHour < 12) return "Gmorning";
    if (currentHour < 18) return "Gafternoon";
    return "Gevening";
  };