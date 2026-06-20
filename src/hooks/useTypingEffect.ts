import { useState, useEffect } from 'react';

export function useTypingEffect(
  words: string[],
  typingSpeed: number = 100,
  deletingSpeed: number = 50,
  delayBetweenWords: number = 2000
): string {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullWord = words[currentWordIndex];

    if (isDeleting) {
      // Deleting text
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      // Typing text
      timer = setTimeout(() => {
        setCurrentText((prev) => currentFullWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    // If word is completely typed, pause before deleting
    if (!isDeleting && currentText === currentFullWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenWords);
    }

    // If word is completely deleted, move to the next word
    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return currentText;
}
