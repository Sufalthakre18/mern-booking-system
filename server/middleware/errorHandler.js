export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong. Please try again.';
  res.status(status).json({ message });
};