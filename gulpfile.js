let gulp = require('gulp');
let ts = require('gulp-typescript');
let tsp = ts.createProject('tsconfig.json'); //使用tsconfig.json文件配置tsc
let nodemon = require('gulp-nodemon');

//目录常量
const PATHS = {
  scripts: ['./src/**/*.ts'],
  output: './server',
};
//编译ts文件
gulp.task('build-ts', function() {
  return gulp.src('src/**/*.ts')
    .pipe(tsp())
    .pipe(gulp.dest(PATHS.output));
});
//监视ts文件变化
gulp.task('watch-ts', ['build-ts'], function() {
  gulp.watch(PATHS.scripts, ['build-ts']);
});

var nodemonConfig = {
  script: 'server/www',
  ext: 'js jade',
  ignore: [
    'node_modules/**/*',
    'resource/**/*',
    'resource_dev/**/*',
    'log/**/*',
    'src/**/*',
  ],
  env: {
    NODE_ENV: 'development'
  }
};

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon(nodemonConfig)
    .on('start', function() {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function() {
      setTimeout(function() {
        console.log('-------- 重启 --------');
      }, 1000);
    });
});
gulp.task('default', ['watch-ts', 'nodemon']);