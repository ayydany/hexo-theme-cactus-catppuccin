import { deleteAsync } from "del";
import fs from "fs";
import gulp from "gulp";
import path from "path";
import stylint from "gulp-stylint";
import stylelintFormatter from "stylelint-formatter-pretty";
import jshint from "gulp-jshint";
import jshintFormatter from "jshint-stylish";
import yaml from "js-yaml";

gulp.task("lib:clean", function () {
  return deleteAsync(["./source/lib/*"]);
});

gulp.task("lib:fontAwesome", function () {
  return gulp
    .src(
      [
        "node_modules/@fortawesome/fontawesome-free/webfonts/*",
        "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
      ],
      { base: "node_modules/@fortawesome/fontawesome-free" }
    )
    .pipe(gulp.dest("./source/lib/font-awesome"));
});

gulp.task("lib:vazirFont", function () {
  return gulp
    .src(["node_modules/vazir-font/dist/*"], {
      base: "node_modules/vazir-font/dist",
    })
    .pipe(gulp.dest("./source/lib/vazir-font"));
});

gulp.task("lib:justifiedGallery", function () {
  return gulp
    .src(
      [
        "node_modules/justifiedGallery/dist/css/*.min.css",
        "node_modules/justifiedGallery/dist/js/*.min.js",
      ],
      { base: "node_modules/justifiedGallery/dist" }
    )
    .pipe(gulp.dest("./source/lib/justified-gallery"));
});

gulp.task("lib:jQuery", function () {
  return gulp
    .src(["node_modules/jquery/dist/jquery.min.js"])
    .pipe(gulp.dest("./source/lib/jquery"));
});

gulp.task("lib:clipboard", function () {
  return gulp
    .src(["node_modules/clipboard/dist/clipboard.min.js"])
    .pipe(gulp.dest("./source/lib/clipboard"));
});

gulp.task("lint:js", function () {
  return gulp
    .src(["./source/js/**/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter(jshintFormatter));
});

gulp.task("lint:stylus", function () {
  return gulp
    .src([
      "./source/css/*.styl",
      "./source/css/_partial/*.styl",
      "./source/css/_colors/*.styl",
    ])
    .pipe(
      stylint({
        config: ".stylintrc",
        reporters: [{ formatter: stylelintFormatter, console: true }],
      })
    );
});

gulp.task("validate:config", function (cb) {
  var themeConfig = fs.readFileSync(path.join(path.resolve(), "_config.yml"));

  try {
    yaml.load(themeConfig);
    cb();
  } catch (error) {
    cb(new Error(error));
  }
});

gulp.task("validate:languages", function (cb) {
  var languagesPath = path.join(path.resolve(), "languages");
  var languages = fs.readdirSync(languagesPath);
  var errors = [];
  for (var i in languages) {
    var languagePath = path.join(languagesPath, languages[i]);
    try {
      yaml.load(fs.readFileSync(languagePath), {
        filename: path.relative(path.resolve(), languagePath),
      });
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length == 0) {
    cb();
  } else {
    cb(errors);
  }
});

gulp.task(
  "lib",
  gulp.series(
    "lib:clean",
    "lib:jQuery",
    "lib:clipboard",
    "lib:fontAwesome",
    "lib:vazirFont",
    "lib:justifiedGallery"
  )
);
gulp.task("lint", gulp.parallel("lint:js", "lint:stylus"));
gulp.task("validate", gulp.parallel("validate:config", "validate:languages"));
gulp.task("default", gulp.parallel("lint", "validate"));
