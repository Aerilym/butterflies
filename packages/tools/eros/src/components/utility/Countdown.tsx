import { useState, useEffect } from 'react';

export default function Countdown({ startingTime = 10000 }) {
  const seconds = Math.floor((startingTime / 1000) % 60);
  const [counter, setCounter] = useState(seconds);
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return <>{counter}</>;
}
