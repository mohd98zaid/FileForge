const fs = require('fs');
const path = require('path');

const poseDir = path.join(__dirname, '..', 'node_modules', '@mediapipe', 'pose');
const poseJs = path.join(poseDir, 'pose.js');
const poseEsm = path.join(poseDir, 'pose-esm.js');

const stub = `// Stub: @mediapipe/pose is not compatible with Next.js/Webpack ESM builds.
// Only MoveNet is used by pose-detection, which does not need this package.
module.exports = { Pose: {}, POSE_CONNECTIONS: [], POSE_LANDMARKS: {} };
module.exports.__esModule = true;
exports.Pose = {};
exports.POSE_CONNECTIONS = [];
exports.POSE_LANDMARKS = {};
exports.POSE_LANDMARKS_LEFT = {};
exports.POSE_LANDMARKS_RIGHT = {};
exports.POSE_LANDMARKS_NEUTRAL = {};
exports.VERSION = 'stub';
exports.default = { Pose: {} };
`;

if (fs.existsSync(poseDir)) {
  fs.writeFileSync(poseJs, stub);
  fs.writeFileSync(poseEsm, stub);
  console.log('Patched @mediapipe/pose for Next.js compatibility');
} else {
  console.log('@mediapipe/pose not found, skipping patch');
}
