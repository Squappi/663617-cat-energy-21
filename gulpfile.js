const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const uglify = require("gulp-uglify-es");
const svgstore = require("gulp-svgstore");
const rename = require("rename");
const del = require("del");
const { plugin } = require("postcss");

//HTML

const html = () => {
    return gulp.src("source/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("build"));
}

// Styles

const styles = () => {
    return gulp.src("source/less/style.less")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer(),
            csso()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
}

exports.styles = styles;

// Image

const images = () => {
    return gulp.src("source/img/**/*.{jpg,png,svg}")
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"))
}

exports.images = images;

// WebP

const createWebp = () => {
    return gulp.src("source/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
    return gulp.src("source/img/**/*.{svg}")
        .pipe(svgstore())
        .pipe(rename(sprite.svg))
        .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Script

const scripts = () => {
        return gulp.src("source/js/*.js")
            .pipe(uglify)
            .pipe(rename("script.min.js"))
            .pipe(gulp.dest("build/js")

            }

        exports.scripts = scripts;

        // Server

        const server = (done) => {
            sync.init({
                server: {
                    baseDir: 'build'
                },
                cors: true,
                notify: false,
                ui: false,
            });
            done();
        }

        exports.server = server;

        // Copy

        const copy = () => {
            return gulp.src([
                    "source/fonts/*.{woff2, woff}",
                    "source/img/**/*.{png,jpg,svg}",
                    "source/*.html",
                    "source/js/*.js"
                ], {
                    base: "source"
                })
                .pipe(gulp.dest("build"));
        }

        exports.copy = copy;

        // Clean

        const clean = () => {
            return del("build");
        }

        // Build

        const build = gulp.series(
            clean,
            gulp.parallel(
                styles,
                images,
                sprite,
                createWebp,
                copy,
                html
            )
        )

        exports.build = build;

        // Watcher

        const watcher = () => {
            gulp.watch("source/less/**/*.less", gulp.series("styles"));
            gulp.watch("source/*.html").on("change", sync.reload);
        }

        exports.default = gulp.series(
            clean,
            gulp.parallel(
                styles,
                images,
                sprite,
                createWebp,
                copy,
                html
            ),
            gulp.series(
                server, watcher
            )
        );