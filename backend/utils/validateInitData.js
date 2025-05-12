import crypto from 'crypto';

export function validateInitData(initData, botToken) {
  try {
    const params = Object.fromEntries(new URLSearchParams(initData));
    const hash = params.hash;
    delete params.hash;

    const dataCheckString = Object.keys(params)
      .filter(key => key !== 'hash')
      .map(key => `${key}=${params[key]}`)
      .sort()
      .join('\n');

    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return false;
    }

    return JSON.parse(params.user);
  } catch (error) {
    console.error('Error validating initData:', error);
    return false;
  }
}