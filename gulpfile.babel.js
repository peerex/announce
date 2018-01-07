import gulp from 'gulp'
import browserSync from 'browser-sync'
import concat from 'gulp-concat'
import pug from 'gulp-pug'
import sass from 'gulp-sass'
import csso from 'gulp-csso'
import autoprefixer from 'gulp-autoprefixer'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'

// Browser Sync

gulp.task('browserSync', () =>
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    open: false
  })
)

// Pug

gulp.task('pug', () =>
  gulp.src('src/*.pug')
    .pipe(pug({
      locals: {
        twitter_url: 'https://twitter.com/mrpeerex',
        telegram_channel_url: 'https://t.me/peerex',
        github_url: 'https://github.com/peerex'
      }
    }))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

// SASS

gulp.task('sass', () =>
  gulp.src('src/styles/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('app.css'))
    .pipe(csso())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

// JS

gulp.task('js', () =>
  browserify({
    entries: './src/scripts/app.js',
    debug: false
  })
    .transform(babelify, {
      presets: ['env']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

// Static assets

gulp.task('assets', () =>
  gulp.src('static/**/*')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({
      stream: true
    }))
)

gulp.task('build', ['pug', 'sass', 'js', 'assets'])

gulp.task('watch', ['browserSync', 'build'], () => {
  gulp.watch('src/*.pug', ['pug'])
  gulp.watch('src/styles/**/*.sass', ['sass'])
  gulp.watch('src/scripts/**/*.js', ['js'])
  gulp.watch('static/**/*', ['assets'])
})

gulp.task('default', ['build'])
