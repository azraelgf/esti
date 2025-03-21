import { isMobile, _slideUp, _slideToggle } from "../files/functions.js";
import { flsModules } from "../files/modules.js";
import { formValidate } from "../files/forms/forms.js";

// Константы событий
const SELECT_EVENTS = {
	CLICK: 'click',
	FOCUSIN: 'focusin',
	FOCUSOUT: 'focusout',
	KEYDOWN: 'keydown'
};

/**
 * Debounce utility function to limit the rate of function execution.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - Debounced function.
 */
function debounce(func, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), delay);
	};
}

/**
 * Custom Select Constructor
 */
class SelectConstructor {
	constructor(props = {}) {
		const defaultConfig = {
			init: true,
			logging: true,
			speed: 150,
			classNames: {
				select: "select",
				selectBody: "select__body",
				selectTitle: "select__title",
				selectValue: "select__value",
				selectLabel: "select__label",
				selectInput: "select__input",
				selectText: "select__text",
				selectLink: "select__link",
				selectOptions: "select__options",
				selectOptionsScroll: "select__scroll",
				selectOption: "select__option",
				selectContent: "select__content",
				selectRow: "select__row",
				selectData: "select__asset",
				selectDisabled: "_select-disabled",
				selectTag: "_select-tag",
				selectOpen: "_select-open",
				selectActive: "_select-active",
				selectFocus: "_select-focus",
				selectMultiple: "_select-multiple",
				selectCheckBox: "_select-checkbox",
				selectOptionSelected: "_select-selected",
				selectPseudoLabel: "_select-pseudo-label"
			}
		};

		this.config = { ...defaultConfig, ...props };
		this.selectClasses = this.config.classNames;
		this._this = this;

		if (this.config.init) {
			const selectItems = props.data ? document.querySelectorAll(props.data) : document.querySelectorAll('select');
			if (selectItems.length) {
				this.selectsInit(selectItems);
			}
		}
	}

	getSelectClass(className) { return `.${className}`; }
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector('select'),
			selectElement: selectItem.querySelector(this.getSelectClass(className)),
		};
	}

	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => this.selectInit(originalSelect, index + 1));
		this.bindEvent(SELECT_EVENTS.CLICK, this.selectsActions.bind(this));
		this.bindEvent(SELECT_EVENTS.KEYDOWN, this.selectsActions.bind(this));
		this.bindEvent(SELECT_EVENTS.FOCUSIN, this.selectsActions.bind(this));
		this.bindEvent(SELECT_EVENTS.FOCUSOUT, this.selectsActions.bind(this));
	}

	bindEvent(eventType, handler) { document.addEventListener(eventType, handler); }

	selectInit(originalSelect, index) {
		try {
			const selectItem = document.createElement("div");
			selectItem.classList.add(this.selectClasses.select);
			originalSelect.parentNode.insertBefore(selectItem, originalSelect);
			selectItem.appendChild(originalSelect);
			originalSelect.hidden = true;
			if (index) originalSelect.dataset.id = index;

			this.setupPlaceholder(selectItem, originalSelect);
			this.buildSelectStructure(selectItem);
			this.configureSelect(originalSelect, selectItem);
			this.log(`Select initialized with ID: ${index}`);
		} catch (error) {
			this.log(`Error in selectInit: ${error.message}`, 'error');
		}
	}

	setupPlaceholder(selectItem, originalSelect) {
		const placeholder = this.getSelectPlaceholder(originalSelect);
		if (placeholder) {
			originalSelect.dataset.placeholder = placeholder.value;
			if (placeholder.label.show) {
				const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.selectTitle).selectElement;
				selectItemTitle.insertAdjacentHTML(
					'afterbegin',
					`<span class="${this.selectClasses.selectLabel}">${placeholder.label.text || placeholder.value}</span>`
				);
			}
		}
	}

	buildSelectStructure(selectItem) {
		selectItem.insertAdjacentHTML(
			'beforeend',
			`<div class="${this.selectClasses.selectBody}"><div hidden class="${this.selectClasses.selectOptions}"></div></div>`
		);
	}

	configureSelect(originalSelect, selectItem) {
		originalSelect.dataset.speed = originalSelect.dataset.speed || this.config.speed;
		this.config.speed = +originalSelect.dataset.speed;
		originalSelect.addEventListener('change', (e) => this.selectChange(e));
		this.selectBuild(originalSelect);
	}

	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		selectItem.dataset.id = originalSelect.dataset.id;
		if (originalSelect.dataset.classModif) selectItem.classList.add(`select_${originalSelect.dataset.classModif}`);
		originalSelect.multiple ? selectItem.classList.add(this.selectClasses.selectMultiple) : selectItem.classList.remove(this.selectClasses.selectMultiple);
		if (originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple) selectItem.classList.add(this.selectClasses.selectCheckBox);
		this.setSelectTitleValue(selectItem, originalSelect);
		this.setOptions(selectItem, originalSelect);
		if (originalSelect.hasAttribute('data-search')) this.searchActions(selectItem);
		if (originalSelect.hasAttribute('data-open')) this.selectAction(selectItem);
		this.selectDisabled(selectItem, originalSelect);
	}

	selectsActions(e) {
		const targetElement = e.target;
		const targetType = e.type;
		const selectItem = this.getClosestSelect(targetElement);

		if (selectItem) {
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			if (targetType === SELECT_EVENTS.CLICK && !originalSelect.disabled) {
				this.handleClick(targetElement, selectItem, originalSelect);
			} else if (targetType === SELECT_EVENTS.FOCUSIN || targetType === SELECT_EVENTS.FOCUSOUT) {
				this.handleFocus(selectItem, targetType);
			} else if (targetType === SELECT_EVENTS.KEYDOWN && e.code === 'Escape') {
				this.selectsClose();
			}
		} else {
			this.selectsClose();
		}
	}

	getClosestSelect(targetElement) {
		return targetElement.closest(this.getSelectClass(this.selectClasses.select)) ||
			(targetElement.closest(this.getSelectClass(this.selectClasses.selectTag)) &&
				document.querySelector(`.${this.selectClasses.select}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.selectTag)).dataset.selectId}"]`));
	}

	handleClick(targetElement, selectItem, originalSelect) {
		if (targetElement.closest(this.getSelectClass(this.selectClasses.selectTag))) {
			const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.selectTag));
			const optionItem = selectItem.querySelector(`.${this.selectClasses.selectOption}[data-value="${targetTag.dataset.value}"]`);
			this.optionAction(selectItem, originalSelect, optionItem);
		} else if (targetElement.closest(this.getSelectClass(this.selectClasses.selectTitle))) {
			this.selectAction(selectItem);
		} else if (targetElement.closest(this.getSelectClass(this.selectClasses.selectOption))) {
			const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.selectOption));
			this.optionAction(selectItem, originalSelect, optionItem);
		}
	}

	handleFocus(selectItem, targetType) {
		if (targetType === SELECT_EVENTS.FOCUSIN) {
			selectItem.classList.add(this.selectClasses.selectFocus);
		} else {
			selectItem.classList.remove(this.selectClasses.selectFocus);
		}
	}

	selectsClose(selectOneGroup) {
		const selectsGroup = selectOneGroup || document;
		const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.select)}${this.getSelectClass(this.selectClasses.selectOpen)}`);
		selectActiveItems.forEach(selectActiveItem => this.selectClose(selectActiveItem));
	}

	selectClose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.selectOptions).selectElement;
		if (!selectOptions.classList.contains('_slide')) {
			selectItem.classList.remove(this.selectClasses.selectOpen);
			_slideUp(selectOptions, originalSelect.dataset.speed);
			setTimeout(() => selectItem.style.zIndex = '', originalSelect.dataset.speed);
		}
	}

	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.selectOptions).selectElement;
		const selectOpenzIndex = originalSelect.dataset.zIndex || 3;

		this.setOptionsPosition(selectItem);
		if (originalSelect.closest('[data-one-select]')) {
			this.selectsClose(originalSelect.closest('[data-one-select]'));
		}

		const isMobileDevice = typeof isMobile === 'function' ? isMobile() : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		if (isMobileDevice && originalSelect.dataset.mobilePopup) {
			this.showMobilePopup(selectItem, selectOptions);
		} else {
			this.toggleDesktopSelect(selectItem, selectOptions, selectOpenzIndex);
		}
	}

	showMobilePopup(selectItem, selectOptions) {
		const popup = document.createElement('dialog');
		popup.classList.add('select-popup');
		popup.innerHTML = selectOptions.outerHTML;
		document.body.appendChild(popup);
		popup.showModal();
		popup.addEventListener('close', () => popup.remove());
	}

	toggleDesktopSelect(selectItem, selectOptions, zIndex) {
		if (!selectOptions.classList.contains('_slide')) {
			selectItem.classList.toggle(this.selectClasses.selectOpen);
			_slideToggle(selectOptions, this.config.speed);
			selectItem.style.zIndex = selectItem.classList.contains(this.selectClasses.selectOpen) ? zIndex : '';
		}
	}

	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.selectBody).selectElement;
		const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.selectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
		if (originalSelect.hasAttribute('data-search')) this.searchActions(selectItem);
	}

	getSelectTitleValue(selectItem, originalSelect) {
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect).elements
				.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="${this.selectClasses.selectTag}">${this.getSelectElementContent(option)}</span>`)
				.join('');
			if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
				document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
			}
		}
		selectTitleValue = selectTitleValue.length ? selectTitleValue : (originalSelect.dataset.placeholder || '');
		const pseudoAttribute = originalSelect.hasAttribute('data-pseudo-label') ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel || 'Fill attribute'}"` : '';
		const pseudoAttributeClass = pseudoAttribute ? ` ${this.selectClasses.selectPseudoLabel}` : '';
		this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.selectActive) : selectItem.classList.remove(this.selectClasses.selectActive);

		if (originalSelect.hasAttribute('data-search')) {
			return `<div class="${this.selectClasses.selectTitle}"><span${pseudoAttribute} class="${this.selectClasses.selectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.selectInput}"></span></div>`;
		}
		const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';
		return `<button type="button" class="${this.selectClasses.selectTitle}"><span${pseudoAttribute} class="${this.selectClasses.selectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.selectContent}${customClass}">${selectTitleValue}</span></span></button>`;
	}

	getSelectElementContent(selectOption) {
		const selectOptionData = selectOption.dataset.asset || '';
		const selectOptionDataHTML = selectOptionData.includes('img') ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.selectRow}">` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.selectData}">` : '';
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.selectText}">` : '';
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		return selectOptionContentHTML;
	}

	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
		if (selectPlaceholder) {
			return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute("data-show"),
				label: {
					show: selectPlaceholder.hasAttribute("data-label"),
					text: selectPlaceholder.dataset.label
				}
			};
		}
	}

	getSelectedOptionsData(originalSelect, type) {
		let selectedOptions = originalSelect.multiple
			? Array.from(originalSelect.options).filter(option => option.value && option.selected)
			: [originalSelect.options[originalSelect.selectedIndex]];
		return {
			elements: selectedOptions,
			values: selectedOptions.filter(option => option.value).map(option => option.value),
			html: selectedOptions.map(option => this.getSelectElementContent(option)).join('')
		};
	}

	getOptions(originalSelect) {
		const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
		const customMaxHeightValue = originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : '';
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length) {
			let selectOptionsHTML = '';
			if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
				selectOptions = selectOptions.filter(option => option.value);
			}
			selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}"` : ''} class="${this.selectClasses.selectOptionsScroll}">`;
			selectOptions.forEach(selectOption => selectOptionsHTML += this.getOption(selectOption, originalSelect));
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
		return '';
	}

	getOption(selectOption, originalSelect) {
		const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.selectOptionSelected}` : '';
		const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple ? `hidden` : '';
		const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
		const selectOptionLink = selectOption.dataset.href || false;
		const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';
		let selectOptionHTML = selectOptionLink
			? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.selectOption}${selectOptionClass}${selectOptionSelected}">`
			: `<button ${selectOptionHide} class="${this.selectClasses.selectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}

	setOptions(selectItem, originalSelect) {
		const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.selectOptions).selectElement;
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}

	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.selectOptions).selectElement;
		const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.selectOptionsScroll).selectElement;
		const customMaxHeightValue = originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : '';
		const selectOptionsPosMargin = originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

		if (!selectItem.classList.contains(this.selectClasses.selectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight || parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
			const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;

			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
			const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add('select--show-top');
					selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
				} else {
					selectItem.classList.remove('select--show-top');
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else {
			setTimeout(() => {
				selectItem.classList.remove('select--show-top');
				selectItemScroll.style.maxHeight = customMaxHeightValue;
			}, +originalSelect.dataset.speed);
		}
	}

	optionAction(selectItem, originalSelect, optionItem) {
		const selectOptions = selectItem.querySelector(this.getSelectClass(this.selectClasses.selectOptions));
		if (!selectOptions.classList.contains('_slide')) {
			if (originalSelect.multiple) {
				optionItem.classList.toggle(this.selectClasses.selectOptionSelected);
				const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
				originalSelectSelectedItems.forEach(item => item.removeAttribute('selected'));
				const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.selectOptionSelected));
				selectSelectedItems.forEach(item => originalSelect.querySelector(`option[value="${item.dataset.value}"]`).setAttribute('selected', 'selected'));
			} else {
				if (!originalSelect.hasAttribute('data-show-selected')) {
					setTimeout(() => {
						const hiddenOption = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.selectOption)}[hidden]`);
						if (hiddenOption) hiddenOption.hidden = false;
						optionItem.hidden = true;
					}, this.config.speed);
				}
				originalSelect.value = optionItem.dataset.value || optionItem.textContent;
				this.selectAction(selectItem);
			}
			this.setSelectTitleValue(selectItem, originalSelect);
			this.setSelectChange(originalSelect);
		}
	}

	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}

	setSelectChange(originalSelect) {
		if (originalSelect.hasAttribute('data-validate')) {
			formValidate.validateInput(originalSelect);
		}
		if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
			const tempButton = document.createElement("button");
			tempButton.type = "submit";
			originalSelect.closest('form').append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		this.selectCallback(selectItem, originalSelect);
	}

	selectDisabled(selectItem, originalSelect) {
		const selectTitle = this.getSelectElement(selectItem, this.selectClasses.selectTitle).selectElement;
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.selectDisabled);
			selectTitle.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.selectDisabled);
			selectTitle.disabled = false;
		}
	}

	searchActions(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectInput = this.getSelectElement(selectItem, this.selectClasses.selectInput).selectElement;
		const selectOptions = this.getSelectElement(selectItem, this.selectClasses.selectOptions).selectElement;
		const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.selectOption}`);

		const debounceSearch = debounce(() => {
			const searchValue = selectInput.value.toUpperCase();
			selectOptionsItems.forEach(item => {
				item.hidden = !item.textContent.toUpperCase().includes(searchValue);
			});
			selectOptions.hidden = selectOptions.querySelectorAll(':not([hidden])').length === 0;
			if (!selectOptions.hidden) this.selectAction(selectItem);
		}, 200);

		selectInput.addEventListener("input", debounceSearch);
	}

	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(new CustomEvent("selectCallback", { detail: { select: originalSelect } }));
	}

	log(message, type = 'log') {
		if (this.config.logging) {
			console[type](`[SelectConstructor] ${message}`);
		}
	}
}

flsModules.select = new SelectConstructor({});
