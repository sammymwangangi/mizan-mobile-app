#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running custom postinstall hook...');

try {
  // Path to the react-native-wheel-picker build.gradle file
  const buildGradlePath = path.join(
    process.cwd(),
    'node_modules',
    'react-native-wheel-picker',
    'android',
    'build.gradle'
  );

  // Check if the file exists
  if (fs.existsSync(buildGradlePath)) {
    console.log('Fixing react-native-wheel-picker build.gradle...');

    // Content to replace the build.gradle file with
    const newBuildGradle = `apply plugin: 'com.android.library'

def safeExtGet(prop, fallback) {
    rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
}

android {
    compileSdkVersion safeExtGet('compileSdkVersion', 33)
    buildToolsVersion safeExtGet('buildToolsVersion', '33.0.0')

    defaultConfig {
        minSdkVersion safeExtGet('minSdkVersion', 21)
        targetSdkVersion safeExtGet('targetSdkVersion', 33)
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
}

repositories {
    mavenCentral()
    google()
    jcenter()
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation "cn.aigestudio.wheelpicker:WheelPicker:1.0.3"
    implementation 'com.facebook.react:react-native:+'
}`;

    // Write the new content to the file
    fs.writeFileSync(buildGradlePath, newBuildGradle);
    console.log('Successfully fixed react-native-wheel-picker build.gradle');
  } else {
    console.log('react-native-wheel-picker build.gradle not found, skipping fix');
  }

  // Apply patches if they exist
  if (fs.existsSync(path.join(process.cwd(), 'patches'))) {
    console.log('Applying patches...');
    try {
      execSync('npx patch-package', { stdio: 'inherit' });
      console.log('Successfully applied patches');
    } catch (patchError) {
      console.error('Error applying patches:', patchError.message);
      // Continue execution even if patch-package fails
    }
  } else {
    console.log('No patches directory found, skipping patch-package');
  }

  console.log('Custom postinstall hook completed successfully');
} catch (error) {
  console.error('Error in postinstall hook:', error.message);
  // Don't exit with error to allow the build to continue
  console.log('Continuing build despite errors in postinstall hook');
}
