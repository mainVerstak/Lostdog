let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/sass/style.sass",
        cssLib: source_folder + "/css/*.css",
        js: source_folder + "/js/script.js",
        jsLib: source_folder + "/js/*.js",
        img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp|mp4)",
        fonts: source_folder + "/fonts/*.ttf",
        fontsW: source_folder + "/fonts/*.+(woff|woff2)",
        fontsSrc: source_folder + "/fonts/",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/sass/**/*.sass",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp} ",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest, task } = require('gulp',),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    imagemin = require("gulp-imagemin"),
    svgSprite = require('gulp-svg-sprite'),
    cheerio = require("gulp-cheerio"),
    concat = require("gulp-concat");

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        /* .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js)) */
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        /* .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 3 }),
                imagemin.svgo({
                    plugins: [
                        { removeUselessStrokeAndFill: false },
                        { removeViewBox: false },
                        { cleanupIDs: false }]
                }),
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ progressive: true }),
            ])
        ) */
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                /* grid: "autoplace", */
                cascade: false,
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.src.fontsSrc))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.src.fontsSrc))
}
function cFonts() {
    return src(path.src.fontsW)
        .pipe(dest(path.build.fonts))
}

function svgSprites() {
    return gulp.src([source_folder + '/iconsprite/*.svg'])
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",
                    example: false
                }
            },
        }
        ))
        .pipe(dest(path.build.img))
}

function cLibs() {
    src(path.src.jsLib)
        .pipe(dest(path.build.js))
    return src(path.src.cssLib)
        .pipe(dest(path.build.css))
}

function libs() {
    gulp.src([source_folder + '/libs/**/*.css'])
        .pipe(clean_css())
        .pipe(concat('libs.min.css'))
        .pipe(dest(source_folder + '/css/'))
    return gulp.src([source_folder + '/libs/**/*.js'])
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
        .pipe(dest(source_folder + '/js/'))
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean() {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, svgSprites, cLibs, cFonts));
let watch = gulp.parallel(watchFiles, browserSync);

exports.cLibs = cLibs;
exports.libs = libs;
exports.svgSprites = svgSprites;
exports.cFonts = cFonts;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

