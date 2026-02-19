export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
//   android: {
//     ...config.android,
//     package: getUniqueIdentifier(),
//   },
});

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.phaitaras.outdoorer.dev';
  }

  if (IS_PREVIEW) {
    return 'com.phaitaras.outdoorer.preview';
  }

  return 'com.phaitaras.outdoorer';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'Outdoorer (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Outdoorer (Preview)';
  }

  return 'Outdoorer';
};