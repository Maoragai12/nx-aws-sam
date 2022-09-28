/* eslint-disable */
export default {
  displayName: 'test-service',
  preset: '../../jest.preset.js',
  globals: {
    
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/services/test-service'
};
