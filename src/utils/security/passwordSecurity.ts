
/**
 * Password strength evaluation
 */
export const evaluatePasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password is too short");
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Variety check
  const charTypes = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const typesPresent = charTypes.filter(regex => regex.test(password)).length;
  
  if (typesPresent < 3) {
    feedback.push("Use a mix of letters, numbers, and symbols");
  }
  
  // Common patterns check
  if (/^123|abc|qwerty|password|admin|welcome|[0-9]{4}$/i.test(password)) {
    score -= 1;
    feedback.push("Avoid common patterns");
  }
  
  return {
    score: Math.max(0, Math.min(5, score)), // Scale 0-5
    feedback: feedback.join(". ")
  };
};
