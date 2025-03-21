import { isMobile, bodyLockStatus, bodyLock, bodyUnlock, bodyLockToggle, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

// Клас Popup
class Popup {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			// Для кнопок
			attributeOpenButton: 'data-popup', // Атрибут для кнопки, которая открывает попап
			attributeCloseButton: 'data-close', // Атрибут для кнопки, которая закрывает попап
			// Для фиксированных элементов
			fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (которые фиксированные)
			// Для объекта попапа
			youtubeAttribute: 'data-popup-youtube', // Атрибут для кода youtube
			youtubePlaceAttribute: 'data-popup-youtube-place', // Атрибут для места вставки ролика youtube
			setAutoplayYoutube: true,
			// Изменение классов
			classes: {
				popup: 'popup',
				popupContent: 'popup__content',
				popupActive: 'popup_show', // Класс, добавляемый при открытии попапа
				bodyActive: 'popup-show', // Класс, добавляемый к body при открытом попапе
			},
			focusCatch: true, // Фокус зацикливается внутри попапа
			closeEsc: true, // Закрытие по клавише ESC
			bodyLock: true, // Блокировка прокрутки страницы при открытии попапа
			hashSettings: {
				location: true, // Использовать хеш в URL
				goHash: true, // Переход по хешу в URL
			},
			on: { // События для открытия и закрытия
				beforeOpen: function () { },
				afterOpen: function () { },
				beforeClose: function () { },
				afterClose: function () { },
			},
		};
		// Основные параметры
		this.youTubeCode; // Код YouTube видео
		this.isOpen = false; // Флаг, открыт ли попап
		this.targetOpen = { selector: false, element: false }; // Текущий попап
		this.previousOpen = { selector: false, element: false }; // Предыдущий попап
		this.lastClosed = { selector: false, element: false }; // Последний закрытый попап
		this._dataValue = false; // Значение атрибута кнопки
		this.hash = false; // Хеш из URL

		// Промежуточные состояния
		this._reopen = false; // Флаг для повторного открытия
		this._selectorOpen = false; // Флаг для открытия селектора
		this.lastFocusEl = false; // Последний элемент, имевший фокус

		// Элементы, которые могут быть в фокусе внутри попапа
		this._focusEl = [
			'a[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			'button:not([disabled]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])',
			'textarea:not([disabled]):not([aria-hidden])', 'area[href]', 'iframe', 'object',
			'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'
		];

		// Настройки, передаваемые через options
		this.options = {
			...config,
			...options,
			classes: { ...config.classes, ...options?.classes },
			hashSettings: { ...config.hashSettings, ...options?.hashSettings },
			on: { ...config.on, ...options?.on },
		};

		this.bodyLock = false; // Флаг для блокировки скролла
		this.options.init ? this.initPopups() : null; // Инициализация попапа, если включена
	}

	// Инициализация попапов
	initPopups() {
		this.eventsPopup();
	}

	// Обработчики событий для попапов
	eventsPopup() {
		document.addEventListener("click", function (e) {
			// Открытие попапа по кнопке
			const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
			if (buttonOpen) {
				e.preventDefault();
				this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) || 'error';
				this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) || null;
				if (this._dataValue !== 'error') {
					if (!this.isOpen) this.lastFocusEl = buttonOpen; // Сохраняем элемент, на котором был фокус
					this.targetOpen.selector = `${this._dataValue}`;
					this._selectorOpen = true;
					this.open(); // Открываем попап
					return;
				}
				return;
			}

			// Закрытие попапа по кнопке закрытия
			const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
			if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
				e.preventDefault();
				this.close(); // Закрываем попап
				return;
			}
		}.bind(this));

		// Закрытие попапа по клавише ESC
		document.addEventListener("keydown", function (e) {
			if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
				e.preventDefault();
				this.close(); // Закрываем попап при нажатии ESC
				return;
			}
			// Переключение фокуса внутри попапа
			if (this.options.focusCatch && e.which == 9 && this.isOpen) {
				this._focusCatch(e);
				return;
			}
		}.bind(this));

		// Открытие попапа по хешу
		if (this.options.hashSettings.goHash) {
			window.addEventListener('hashchange', function () {
				if (window.location.hash) {
					this._openToHash(); // Открываем попап по хешу
				} else {
					this.close(this.targetOpen.selector); // Закрываем попап при отсутствии хеша
				}
			}.bind(this));

			window.addEventListener('load', function () {
				if (window.location.hash) {
					this._openToHash(); // Открываем попап по хешу при загрузке страницы
				}
			}.bind(this));
		}
	}

	// Функция для открытия попапа
	open(selectorValue) {
		if (bodyLockStatus) {
			this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;

			// Проверка и установка селектора для открытия
			if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
				this.targetOpen.selector = selectorValue;
				this._selectorOpen = true;
			}
			if (this.isOpen) {
				this._reopen = true;
				this.close(); // Закрытие для повторного открытия
			}
			if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
			if (!this._reopen) this.previousActiveElement = document.activeElement;

			this.targetOpen.element = document.querySelector(this.targetOpen.selector);

			if (this.targetOpen.element) {
				if (this.youTubeCode) this._loadYouTube(); // Загрузка YouTube видео

				if (this.options.hashSettings.location) {
					this._getHash(); // Получаем хеш
					this._setHash(); // Устанавливаем хеш в URL
				}

				this.options.on.beforeOpen(this); // Событие перед открытием
				document.dispatchEvent(new CustomEvent("beforePopupOpen", { detail: { popup: this } }));

				this.targetOpen.element.classList.add(this.options.classes.popupActive); // Добавляем класс активного попапа
				document.documentElement.classList.add(this.options.classes.bodyActive); // Добавляем класс к body

				if (!this._reopen) {
					!this.bodyLock ? bodyLock() : null; // Блокировка скролла
				} else this._reopen = false;

				this.targetOpen.element.setAttribute('aria-hidden', 'false');

				this.previousOpen.selector = this.targetOpen.selector;
				this.previousOpen.element = this.targetOpen.element;

				this._selectorOpen = false;

				this.isOpen = true;

				setTimeout(() => {
					this._focusTrap(); // Перехват фокуса в попапе
				}, 50);

				this.options.on.afterOpen(this); // Событие после открытия
				document.dispatchEvent(new CustomEvent("afterPopupOpen", { detail: { popup: this } }));
			}
		}
	}

	// Функция для закрытия попапа
	close(selectorValue) {
		if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
			this.previousOpen.selector = selectorValue;
		}
		if (!this.isOpen || !bodyLockStatus) {
			return;
		}

		this.options.on.beforeClose(this); // Событие перед закрытием
		document.dispatchEvent(new CustomEvent("beforePopupClose", { detail: { popup: this } }));

		// Удаление YouTube видео при закрытии
		if (this.youTubeCode) {
			const videoElem = this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`);
			if (videoElem) videoElem.innerHTML = '';
		}

		this.previousOpen.element.classList.remove(this.options.classes.popupActive); // Убираем класс активного попапа
		this.previousOpen.element.setAttribute('aria-hidden', 'true');

		if (!this._reopen) {
			document.documentElement.classList.remove(this.options.classes.bodyActive); // Убираем класс с body
			!this.bodyLock ? bodyUnlock() : null;
			this.isOpen = false;
		}

		this._removeHash(); // Убираем хеш из URL
		this.lastClosed.selector = this.previousOpen.selector;
		this.lastClosed.element = this.previousOpen.element;

		this.options.on.afterClose(this); // Событие после закрытия
		document.dispatchEvent(new CustomEvent("afterPopupClose", { detail: { popup: this } }));

		setTimeout(() => {
			this._focusTrap(); // Перехват фокуса после закрытия
		}, 50);
	}

	// Открытие попапа по хешу
	_openToHash() {
		const classInHash = window.location.hash.replace('#', '');
		const popupElement = document.querySelector(`#${classInHash}`) || document.querySelector(`.${classInHash}`);

		if (popupElement) {
			this.open(`#${classInHash}`);
		}
	}

	// Получение хеша для попапа
	_getHash() {
		this.hash = this.targetOpen.selector.includes('#') ? this.targetOpen.selector : this.targetOpen.selector.replace('.', '#');
	}

	// Установка хеша в адресную строку
	_setHash() {
		history.pushState('', '', this.hash);
	}

	// Удаление хеша из адресной строки
	_removeHash() {
		history.pushState('', '', window.location.href.split('#')[0]);
	}

	// Фокусировка внутри попапа (ловим фокус)
	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}

	// Установка фокуса в попапе
	_focusTrap() {
		if (!this.previousOpen.element) return;
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (focusable.length > 0) {
			if (!this.isOpen && this.lastFocusEl) {
				this.lastFocusEl.focus();
			} else {
				focusable[0].focus();
			}
		}
	}

	// Загрузка YouTube видео в попап
	_loadYouTube() {
		const codeVideo = this.youTubeCode;
		const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
		const iframe = document.createElement('iframe');
		iframe.setAttribute('allowfullscreen', '');

		const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
		iframe.setAttribute('allow', `${autoplay} encrypted-media`);
		iframe.setAttribute('src', urlVideo);

		const youtubePlace = this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`);
		if (youtubePlace) {
			youtubePlace.innerHTML = '';
			youtubePlace.appendChild(iframe);
		}
	}
}

// Запуск и добавление в объект модулей
flsModules.popup = new Popup({});

