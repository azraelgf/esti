import {isMobile} from "./functions.js";
import {flsModules} from "./modules.js";

if (window.matchMedia("(min-width: 991.98px)").matches) {
    document.addEventListener('mouseover', documentHovers);
}
document.addEventListener('click', documentActions);

function documentHovers(e) {
    const targetElement = e.target;
    if (targetElement.closest('[data-parent]')) {
        const activeInLink = document.querySelector('._insubmenu-open--active'),
            activeInBlock = document.querySelector('._insubmenu-open');
        activeInLink ? activeInLink.classList.remove('_insubmenu-open--active') : null
        activeInBlock ? activeInBlock.classList.remove('_insubmenu-open') : null
        const numMenu = targetElement.dataset.parent ? targetElement.dataset.parent : null,
            subMenu = document.querySelector(`[data-submenu="${numMenu}"]`);
        if (subMenu) {
            const activeLink = document.querySelector('._submenu-open--active'),
                activeBlock = document.querySelector('._submenu-open');
            if (activeLink && activeLink !== targetElement) {
                activeLink.classList.remove('_submenu-open--active');
                activeBlock ? activeBlock.classList.remove('_submenu-open') : null;
            }
            targetElement.classList.toggle('_submenu-open--active');
            subMenu.classList.toggle('_submenu-open');
        } else {
            console.log('Нет такого меню!');
        }
        e.preventDefault();
    }
    if (targetElement.closest('[data-inparent]')) {
        const numMenu = targetElement.dataset.inparent ? targetElement.dataset.inparent : null,
            subMenu = document.querySelector(`[data-insubmenu="${numMenu}"]`);
        if (subMenu) {
            const activeLink = document.querySelector('._insubmenu-open--active'),
                activeBlock = document.querySelector('._insubmenu-open');
            if (activeLink && activeLink !== targetElement) {
                activeLink.classList.remove('_insubmenu-open--active');
                activeBlock ? activeBlock.classList.remove('_insubmenu-open') : null;
            }
            targetElement.classList.toggle('_insubmenu-open--active');
            subMenu.classList.toggle('_insubmenu-open');
        } else {
            console.log('Нет такого меню!');
        }
        e.preventDefault();
    }
}

function documentActions(e) {
    const targetElement = e.target;
    if (targetElement.closest('[data-parent]')) {
        const activeInLink = document.querySelector('._insubmenu-open--active'),
            activeInBlock = document.querySelector('._insubmenu-open');
        activeInLink ? activeInLink.classList.remove('_insubmenu-open--active') : null
        activeInBlock ? activeInBlock.classList.remove('_insubmenu-open') : null
        const numMenu = targetElement.dataset.parent ? targetElement.dataset.parent : null,
            subMenu = document.querySelector(`[data-submenu="${numMenu}"]`);
        if (subMenu) {
            const activeLink = document.querySelector('._submenu-open--active'),
                activeBlock = document.querySelector('._submenu-open');
            if (activeLink && activeLink !== targetElement) {
                activeLink.classList.remove('_submenu-open--active');
                activeBlock ? activeBlock.classList.remove('_submenu-open') : null;
            }
            targetElement.classList.toggle('_submenu-open--active');
            subMenu.classList.toggle('_submenu-open');
        } else {
            console.log('Нет такого меню!');
        }
        e.preventDefault();
    }
    if (targetElement.closest('[data-inparent]')) {
        const numMenu = targetElement.dataset.inparent ? targetElement.dataset.inparent : null,
            subMenu = document.querySelector(`[data-insubmenu="${numMenu}"]`);
        if (subMenu) {
            const activeLink = document.querySelector('._insubmenu-open--active'),
                activeBlock = document.querySelector('._insubmenu-open');
            if (activeLink && activeLink !== targetElement) {
                activeLink.classList.remove('_insubmenu-open--active');
                activeBlock ? activeBlock.classList.remove('_insubmenu-open') : null;
            }
            targetElement.classList.toggle('_insubmenu-open--active');
            subMenu.classList.toggle('_insubmenu-open');
        } else {
            console.log('Нет такого меню!');
        }
        e.preventDefault();
    }
    if (targetElement.closest('.submenu-back')) {
        const activeSubMenu = document.querySelector('._submenu-open');
        activeSubMenu ? activeSubMenu.classList.remove('_submenu-open') : null;
    }
    if (targetElement.closest('.submenu-back-in')) {
        const activeSubMenu = document.querySelector('._insubmenu-open');
        activeSubMenu ? activeSubMenu.classList.remove('_insubmenu-open') : null;
    }
    if (targetElement.closest('.submenu-back-main')) {
        const activeSubMenu = document.querySelector('._submenu-active');
        activeSubMenu ? activeSubMenu.classList.remove('_submenu-active') : null;
    }
    if (window.matchMedia("(max-width: 991.98px)").matches) {
        if (targetElement.closest('.has-menu')) {
            const firstSubMenu = document.querySelector('.submenu-wrapper__item:first-child'),
                wrapperSub = document.querySelector('.submenu-wrapper');
            wrapperSub.classList.add('_submenu-active')
            firstSubMenu.classList.add('_submenu-open')
        }
        if (targetElement.closest('.has-menu-one')) {
            const wrapperSub = document.querySelector('.submenu-wrapper_one');
            wrapperSub.classList.add('_submenu-active')
        }

    }
    if (targetElement.closest('.header-top__search')) {
        const searchWrapper = document.querySelector('.header__search');
        searchWrapper.classList.add('search-open');
    }
    if (targetElement.closest('.form-close')) {
        const searchWrapperActive = document.querySelector('.search-open');
        searchWrapperActive ? searchWrapperActive.classList.remove('search-open') : null;
    }
}

//sortirovka
if (document.querySelector('.buttons')) {
    const buttons = document.querySelectorAll('.buttons button');
    const specialists = document.querySelectorAll('.team-item');

    // Функция для фильтрации специалистов
    function filterSpecialists(category) {
        specialists.forEach(specialist => {
            const specialistCategory = specialist.getAttribute('data-category');
            if (category === 'all' || specialistCategory === category) {
                specialist.classList.remove('hidden');
            } else {
                specialist.classList.add('hidden');
            }
        });
    }

    // Обработчик клика по кнопкам
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            // Убираем класс active у всех кнопок и добавляем только активной
            buttons.forEach(btn => btn.classList.remove('_tab-active'));
            button.classList.add('_tab-active');

            // Фильтруем специалистов
            filterSpecialists(category);
        });
    });

    // Активируем кнопку "Все" при загрузке страницы
    const allButton = document.querySelector('button[data-category="all"]');
    allButton.classList.add('_tab-active');
    filterSpecialists('all');
}
