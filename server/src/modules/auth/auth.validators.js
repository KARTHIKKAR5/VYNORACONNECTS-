export function validateRegister(body) {
  const errors = [];
  if (!body.firstName || !body.firstName.trim()) errors.push('First name is required.');
  if (!body.email || !body.email.trim()) errors.push('Email is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) errors.push('Invalid email address.');
  if (!body.password) errors.push('Password is required.');
  else if (body.password.length < 8) errors.push('Password must be at least 8 characters.');
  if (body.password !== body.confirmPassword) errors.push('Passwords do not match.');
  return errors;
}

export function validateLogin(body) {
  const errors = [];
  if (!body.email || !body.email.trim()) errors.push('Email is required.');
  if (!body.password) errors.push('Password is required.');
  return errors;
}
