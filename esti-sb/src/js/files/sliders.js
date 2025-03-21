import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

// Стили Swiper
import "../../scss/base/swiper.scss";

// Инициализация слайдеров
function initSliders() {
	if (document.querySelector('.sale__body')) {
		new Swiper('.sale__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,

			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.sale-btn-prev',
				nextEl: '.sale-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 1.6,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1268: {
					slidesPerView: 3,
				},
			},

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.team__body')) {
		new Swiper('.team__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,

			// Пагинация
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.team-btn-prev',
				nextEl: '.team-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 1.6,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1268: {
					slidesPerView: 4,
				},
			},

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.equipment__body')) {
		new Swiper('.equipment__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,
			// Пагинация
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.equipment-btn-prev',
				nextEl: '.equipment-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 1.6,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1268: {
					slidesPerView: 4,
				},
			},

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.licenses__body')) {
		new Swiper('.licenses__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,
			// Пагинация

			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.licenses-btn-prev',
				nextEl: '.licenses-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 1.6,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1268: {
					slidesPerView: 4,
				},
			},

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.reviews__body')) {
		new Swiper('.reviews__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.reviews-btn-prev',
				nextEl: '.reviews-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},
				480: {
					slidesPerView: 1.6,
				},
				768: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 2.6,
				},
				1268: {
					slidesPerView: 3,
				},
			},

			// События
			on: {

			}
		});
	}
	if (document.querySelector('.before-after__body')) {
		new Swiper('.before-after__body', {
			modules: [Navigation, Pagination],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 800,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			// Кнопки "влево/вправо"
			navigation: {
				prevEl: '.before-after-btn-prev',
				nextEl: '.before-after-btn-next',
			},

			// Брейкпоинты
			breakpoints: {
				320: {
					slidesPerView: 1,
					autoHeight: true,
				},

				768: {
					slidesPerView: 1,
				},

				1268: {
					slidesPerView: 2,
				},
			},

			// События
			on: {

			}
		});
	}
}

window.addEventListener("load", function (e) {
	initSliders();
});
