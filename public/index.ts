// ===Stylesheets===
require('./css/main.css');
require('./css/pnotify.custom.min.css');
require('./css/man.css');
require('./css/alien.css');
require('./css/mobile.css');

// ===Scripts===
require('./pnotify.custom.min.js');
// Semantic
require('./common/semantic/dist/semantic.min.js');

// Entrypoint
require('./main.ts');
require('./utils/navbar.ts');
const PNotify = require('./pnotify.custom.min.js');

export { PNotify };