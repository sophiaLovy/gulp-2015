var gulp = require("gulp");
// Requires the gulp-sass plugin
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");

var gulpIf = require("gulp-if");
var useref = require("gulp-useref");
var cssnano = require("gulp-cssnano");

var gutil = require("gulp-util");

var imagemin = require("gulp-imagemin");
var runSequence = require("run-sequence");
var cache = require("gulp-cache");

gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "app",
    },
  });
});

gulp.task("sass", function () {
  return gulp
    .src("app/scss/**/*.scss") // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// gulp.task("useref", function () {
//   return (
//     gulp
//       .src("app/*.html")
//       .pipe(useref())
//       // Minifies only if it's a JavaScript file
//       .pipe(gulpIf("*.js", uglify()))
//       .on("error", function (err) {
//         gutil.log(gutil.colors.red("[Error]"), err.toString());
//       })
//       .pipe(gulp.dest("dist"))
//   );
// });

// gulp.task("useref", function () {
//   return gulp.src("app/*.html")
//   .pipe(useref())
//   .pipe(gulp.dest("dist"));
// });

gulp.task("watch", ["browserSync", "sass"], function () {
  gulp.watch("app/scss/**/*.scss", ["sass"]);
});

gulp.task("useref", function () {
  return (
    gulp
      .src("app/*.html")
      .pipe(useref())
      .pipe(gulpIf("*.js", uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf("*.css", cssnano()))
      .pipe(gulp.dest("dist"))
  );
});

// gulp.task("images", function () {
//   return gulp
//     .src("app/images/**/*.+(png|jpg|jpeg|gif|svg)")
//     .pipe(
//       imagemin({
//         // Setting interlaced to true
//         interlaced: true,
//       })
//     )
//     .pipe(gulp.dest("dist/images"));
// });

gulp.task("fonts", function () {
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("default", function (callback) {
  runSequence(["sass", "browserSync", "watch"], callback);
});

gulp.task("images", function () {
  return (
    gulp
      .src("app/images/**/*.+(png|jpg|jpeg|gif|svg)")
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true,
          })
        )
      )
      .pipe(gulp.dest("dist/images"))
  );
});
