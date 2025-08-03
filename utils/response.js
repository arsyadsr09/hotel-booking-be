exports.success = (data, message = 'OK') => ({
  data,
  status: 'success',
  message
});

exports.error = (message = 'Error', code = 500) => ({
  data: null,
  status: 'error',
  message,
  code
});
