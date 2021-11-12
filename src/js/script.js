$(function () {
    "use strict";

    $('.js-menu').on('click', function () {
        if ($('.mobile-menu').hasClass('_active')) {
            $(this).removeClass('_active');
            $('.mobile-menu').removeClass('_active');
            $('body').removeClass('scroll-lock');
        } else {
            $(this).addClass('_active')
            $('.mobile-menu').addClass('_active')
            $('body').addClass('scroll-lock')
        }
    });

    $('[data-modal]').on('click', function () {
        $('.modal._active').each(function (i, item) {
            $(item).css({
                "opacity": "1",
            }).animate({
                opacity: 0,
            }, 200, function () {
                $(item).removeClass('_active')
            });
        });

        var modal = $(this).attr('href') || $(this).attr('data-modal');
        $(modal).addClass('_active').css({
            "opacity": "0",
        }).animate({ opacity: 1 }, 200);
        if (modal.length > 0) {
            $('body').addClass('scroll-lock')
        }
    });

    $('.js-close-modal').on('click', function (e) {
        var modal = $(this);
        if ($(e.target).hasClass('js-close-modal')) {
            if (!$(this).hasClass('modal')) {
                modal = $(this).parents('.modal');
            }
            modal.css({
                "opacity": "1",
            }).animate({
                opacity: 0,
            }, 200, function () {
                modal.removeClass('_active')
            });
            $('body').removeClass('scroll-lock')
        }
    });

    $('.js-close-card-edit').on('click', function () {
        $(this).parents('.account-settings__card-control').removeClass('_edit');
    });

    $('.js-edit-card').on('click', function (e) {
        $(this).parents('.account-settings__card-control').addClass('_edit');
    });

    $('.js-delete-card').on('click', function (e) {
        $(this).parents('.card').remove();
        e.preventDefault();
    });

    $('.js-favorite-detailed').on('click', function (e) {
        $(this).parents('.a-detailed').find('.js-favorite-detailed').toggleClass('_active');
    });

    $('.js-remove-favorite').on('click', function (e) {
        $(this).parents('.card').remove();
        e.preventDefault();
    });

    $('.js-favorite').on('click', function (e) {
        $(this).toggleClass('_active');
        e.preventDefault();
    });

    $(document).on('click', '.js-tab', function () {
        var $tabs = $(this).parents('.tabs')
        $tabs.find('.tab._active').removeClass('_active');
        $(this).addClass('_active');
        var index = $(this).index();
        var $contents = $tabs.next('.tabs-content');
        $contents.find('.tab-content._active').removeClass('_active');
        $contents.find('.tab-content').eq(index).addClass('_active');

        $('.account-settings__card-control').removeClass('_edit');
    });

    var galleryThumbs = new Swiper('.gallery-thumbs', {
        watchOverflow: true,
        spaceBetween: 15,
        slidesPerView: 4,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
    });
    var galleryTop = new Swiper('.gallery-top', {
        watchOverflow: true,
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs
        }
    });

    var swiperCard = new Swiper('.slider-card', {
        observer: true,
        observeParents: true,
        watchOverflow: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    var swiperRemember = new Swiper('.slider-remember', {
        direction: 'vertical',
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                direction: 'horizontal',
            },
            992: {
                direction: 'vertical',
            },
        }
    });

    var swiperBlog = new Swiper('.slider-blog', {
        slidesPerView: 2,
        spaceBetween: 20,
        watchOverflow: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20
            },
        }
    });

    $('.date-picker').datepicker({
        autoClose: true,
        range: false,
        multipleDatesSeparator: ' - ',
        classes: 'date-picker-style',
        language: 'ru'
    })
    $('.date-picker-range').datepicker({
        autoClose: true,
        range: true,
        multipleDatesSeparator: ' - ',
        classes: 'date-picker-style',
        language: 'ru'
    })

    var rangeSlider = document.getElementById("range-slider");
    if (rangeSlider) {
        noUiSlider.create(rangeSlider, {
            start: 0,
            step: 1,
            range: {
                'min': 0,
                'max': 100,
            },
            format: wNumb({
                suffix: 'км'
            }),
            tooltips: true,
        });
    }

    $(document).on('click', '.js-remove-img', function () {
        $(this).parents('.load-photo__item').remove();
    });
    $(".js-load-img").on("change", function (e) {
        var file = this.files[0];
        var $imagesContainer = $(this).parents('.js-load-img-list');
        if (file.type == "image/x-png" || file.type == "image/png" || file.type == "image/bmp" || file.type == "image/jpeg" || file.type == "image/jpg") {
            if (file.size < 5242880) {
                var input = this;
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $imagesContainer.prepend(
                            '<div class="load-photo__item">' +
                            '<img src="' + e.target.result + '" class="load-photo__img">' +
                            '<div class="load-photo__remove js-remove-img">' +
                            '<div class="load-photo__btn"></div>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            } else {
                alert("Размер изображения больше 5 Мб");
            }
        } else {
            alert("Неверный формат изображения");
        }
    });


    window.getYaMap = function () {
        if ($('#map-location').length > 0) {
            ymaps.ready(initMainMap);
        }
        if ($('#map-location-modal').length > 0) {
            ymaps.ready(initModalMap);
        }
    };

    $('.js-get-location').on('click', function () {
        navigator.geolocation.getCurrentPosition(addMapPlacemark);
    });
    function addMapPlacemark(position) {
        mainMap.geoObjects.removeAll();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        var myPlacemark = new ymaps.Placemark([latitude, longitude], {
            balloonContent: false
        }, {
            preset: 'islands#dotIcon',
            iconColor: '#9AB0FF'
        })
        mainMap.geoObjects.add(myPlacemark);
        mainMap.setCenter(mainMap.geoObjects.get(0).geometry.getCoordinates(), 14, { duration: 300 });
    }
    var mainMap;
    function initMainMap() {
        mainMap = new ymaps.Map('map-location', {
            center: [63.5, 92.5],
            zoom: 3,
            controls: []
        })
        mainMap.controls.add("zoomControl", {
            position: { top: 20, right: 20 }
        });
    }

    $('.js-get-location-modal').on('click', function () {
        navigator.geolocation.getCurrentPosition(addMapPlacemark);
    });
    function addMapPlacemark(position) {
        modalMap.geoObjects.removeAll();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        var myPlacemark = new ymaps.Placemark([latitude, longitude], {
            balloonContent: false
        }, {
            preset: 'islands#dotIcon',
            iconColor: '#9AB0FF'
        })
        modalMap.geoObjects.add(myPlacemark);
        modalMap.setCenter(modalMap.geoObjects.get(0).geometry.getCoordinates(), 14, { duration: 300 });
        $('.header-city__current-name').text('Москва2');
        $('.modal-content__location-current').text('Москва2');
    }


    var modalMap;
    function initModalMap() {
        modalMap = new ymaps.Map('map-location-modal', {
            center: [63.5, 92.5],
            zoom: 3,
            controls: []
        })
        modalMap.controls.add("zoomControl", {
            position: { top: 20, right: 20 }
        });
        ymaps.geolocation.get({
            provider: 'yandex',
            mapStateAutoApply: true
        }).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#dotIcon');
            modalMap.geoObjects.add(result.geoObjects);
        });

        ymaps.geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            modalMap.geoObjects.removeAll();
            result.geoObjects.options.set('preset', 'islands#dotIcon');
            modalMap.geoObjects.add(result.geoObjects);
        });

        modalMap.events.add('click', function (e) {
            var coords = e.get('coords');
            modalMap.geoObjects.removeAll();
            var myPlacemark = createPlacemark(coords);
            modalMap.geoObjects.add(myPlacemark);
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        });

        function createPlacemark(coords) {
            return new ymaps.Placemark(coords, {
                balloonContent: false
            }, {
                preset: 'islands#dotIcon',
                iconColor: '#9AB0FF',
                draggable: true
            });
        }
    }
});