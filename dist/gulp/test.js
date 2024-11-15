import gulp from 'gulp';
import { blue, red } from '../index.js';
import gulpJest from 'gulp-jest';
const jest = gulpJest.default;
export function test() {
    return () => {
        return gulp.src([
            'typescript/backend/**/*.spec.ts',
        ])
            .pipe(jest({
            verbose: true,
            extensionsToTreatAsEsm: ['.ts'],
            transform: {
                '^.+\\.tsx?$': [
                    'ts-jest',
                    {
                        tsconfig: './typescript/tsconfig.json',
                        usESM: true,
                    },
                ],
            },
            preset: 'ts-jest',
            setupFilesAfterEnv: [],
            testEnvironment: 'node',
            collectCoverage: true,
            coverageDirectory: '../coverage',
            coverageReporters: ['clover', 'json', 'lcov', 'text'],
            rootDir: './typescript',
            testMatch: ['**/*.spec.ts'],
            passWithNoTests: true,
            moduleNameMapper: {
                'public/(.*)': '<rootDir>/public/$1'
            }
        }))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Tests failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Test succeeded!'));
        });
    };
}
export function testLib() {
    return () => {
        return gulp.src([
            'lib/backend/**/*.spec.ts',
        ])
            .pipe(jest({
            verbose: true,
            extensionsToTreatAsEsm: ['.ts'],
            transform: {
                '^.+\\.tsx?$': [
                    'ts-jest',
                    {
                        tsconfig: './lib/tsconfig.json',
                        usESM: true,
                    },
                ],
            },
            preset: 'ts-jest',
            setupFilesAfterEnv: [],
            testEnvironment: 'node',
            collectCoverage: true,
            passWithNoTests: true,
            coverageDirectory: './coverage',
            coverageReporters: ['clover', 'json', 'lcov', 'text'],
            rootDir: './lib',
            testMatch: ['**/*.spec.ts'],
            moduleNameMapper: {
                'public/(.*)': '<rootDir>/public/$1'
            }
        }))
            .on('error', function () {
            console.log("💩" + red.underline.bold(' => Test (LIB) failed!'));
            this.emit('end');
        })
            .on('end', function () {
            console.log("🐶" + blue.underline(' => Test (LIB) succeeded!'));
        });
    };
}
