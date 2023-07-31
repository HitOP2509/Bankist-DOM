'use strict';

const navbar = document.querySelector('.nav');
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.overlay');

const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');

const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnlearnMore = document.querySelector('.btn--scroll-to');
const btnTabbedContainer = document.querySelector('.operations__tab-container');

const allLazyImages = document.querySelectorAll('.lazy-img');

//1. MODAL
const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	modalOverlay.classList.remove('hidden');
};
const closeModal = function (e) {
	modal.classList.add('hidden');
	modalOverlay.classList.add('hidden');
};

//OPEN MODAL & OVERLAY
btnOpenModal.forEach((button) => {
	button.addEventListener('click', openModal);
});
// CLOSE MODAL & OVERLAY
btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
// CLOSE MODAL & OVERLAY ON KEYPRESS
document.addEventListener('keydown', (e) => (e.key === 'Escape' ? closeModal() : ''));

//2. NAVBAR

//STICKY MENU
const navObserver = new IntersectionObserver(
	(entries, navObserver) => {
		const [entry] = entries;
		if (!entry.isIntersecting) navbar.classList.add('sticky');
		else navbar.classList.remove('sticky');
	},
	{
		root: null,
		threshold: 0,
		rootMargin: '-100px',
	}
);
navObserver.observe(header);

//MENU ITEMS HOVER EFFECT
// GENERAL FUNCTION
const mouseHover = function (e, opacity) {
	const target = e.target;
	if (!target.classList.contains('nav__link')) return;
	const siblingLinks = target.closest('.nav__links').querySelectorAll('.nav__link');
	const logo = document.querySelector('.nav__logo');
	siblingLinks.forEach((link) => {
		if (link !== target) {
			//this points to the same element where we are adding event listener or in this case we are using bind method to specify this
			link.style.opacity = this;
			logo.style.opacity = this;
		}
	});
};
//WE can use this way only if we use "opacity" as a Parameter and use the same "opacity" parameter to change link.style.opacity
// navbar.addEventListener('mouseover', (e) => mouseHover(e, 0.25));
// navbar.addEventListener('mouseout', (e) => mouseHover(e, 1));

//USING bind METHOD TO SPECIFICALLY SET THE VALUE OF this. AS WE ALL KNOW WHATEVER WE PASS AS A ARGUMENT IN THE bind METHOD BECOMES THE VALUE FOR this KEYWORD
navbar.addEventListener('mouseover', mouseHover.bind(0.5));
navbar.addEventListener('mouseout', mouseHover.bind(1));

//SMOOTH SCROLLING
navbar.addEventListener('click', (e) => {
	e.preventDefault();

	if (!e.target.classList.contains('nav__link') || e.target.classList.contains('nav__link--btn'))
		return;

	const section = document.querySelector(e.target.getAttribute('href'));
	section.scrollIntoView({ behavior: 'smooth' });
});

//LEARN MORE SMOOTH SCROLLING
btnlearnMore.addEventListener('click', (e) => {
	e.preventDefault();
	section1.scrollIntoView({ behavior: 'smooth' });
});

//2. IMAGE LAZY LOADING ON SCROLL
const sectionObserver = new IntersectionObserver(
	(entries, imgObserver) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.setAttribute('src', entry.target.dataset.src);
			entry.target.classList.remove('lazy-img');

			imgObserver.unobserve(entry.target);
		});
	},
	{ threshold: 0.3 }
);
allLazyImages.forEach((img) => sectionObserver.observe(img));

//3. TABBED COMPONENTS
btnTabbedContainer.addEventListener('click', (e) => {
	e.preventDefault();
	const targetButton = e.target;
	let buttonDataSrc, allButtons, currentTab;

	if (!targetButton.classList.contains('operations__tab')) return;

	buttonDataSrc = targetButton.getAttribute('data-tab');
	allButtons = targetButton.closest('.operations__tab-container').querySelectorAll('button');
	const allTabbedContent = document.querySelectorAll('.operations__content');

	allButtons.forEach((button) => {
		button.classList.remove('operations__tab--active');
		targetButton.classList.add('operations__tab--active');
	});
	allTabbedContent.forEach((tabs) => {
		tabs.classList.remove('operations__content--active');

		currentTab = tabs.classList.contains('operations__content--' + buttonDataSrc);
		if (!currentTab) return;
		tabs.classList.add('operations__content--active');
	});
});

//4. SLIDER
const allSlides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
const btnLeftSlider = document.querySelector('.slider__btn--left');
const btnRightSlider = document.querySelector('.slider__btn--right');

const maxSlide = allSlides.length;
let currentSlide = 0;

//ADDING DOTS
const createDots = function () {
	allSlides.forEach((_, index) => {
		dotsContainer.insertAdjacentHTML(
			'beforeend',
			`<button class="dots__dot" data-slide="${index}"></button>`
		);
	});
};
createDots(); //CREATING DOTS

//DOT CHANGER FUNCTION
const dotChanger = function (slide) {
	document
		.querySelectorAll('.dots__dot')
		.forEach((dot) => dot.classList.remove('dots__dot--active'));

	const curDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`); //SELECTING DOT WHICH HAS THE PREDEFINED VALUE === CURRENT SLIDE
	curDot.classList.add('dots__dot--active');
};

//ACTIVATED DOT
dotsContainer.addEventListener('click', (e) => {
	if (!e.target.classList.contains('dots__dot')) return;
	const curSlide = e.target.getAttribute('data-slide');
	goToSlide(curSlide);
	currentSlide = curSlide;
	dotChanger(currentSlide);
});

const goToSlide = function (curSlide) {
	allSlides.forEach((item, index) => {
		item.style.transform = `translateX(${100 * (index - curSlide)}%)`;
	});
	dotChanger(curSlide);
};

goToSlide(currentSlide); //INITIALIZING SLIDES FROM 0th Position

const moveRight = function () {
	if (currentSlide < maxSlide - 1 ? currentSlide++ : (currentSlide = 0));
	goToSlide(currentSlide);
};

const moveLeft = function () {
	currentSlide < 1 ? (currentSlide = maxSlide - 1) : currentSlide--;
	goToSlide(currentSlide);
};

// moveRight();
btnRightSlider.addEventListener('click', moveRight);
btnLeftSlider.addEventListener('click', moveLeft);

//5. SECTION REVEAL ANIMATION
allSections.forEach((section) => (section.style.transform = 'translateY(8rem)'));

const allSectionObserver = new IntersectionObserver(
	(entries, allSectionObserver) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.remove('section--hidden');
			entry.target.style.transform = 'translateY(0rem)';
		});
	},
	{
		root: null,
		threshold: 0.1,
	}
);

allSections.forEach((section) => {
	allSectionObserver.observe(section);
	section.classList.add('section--hidden');
});
