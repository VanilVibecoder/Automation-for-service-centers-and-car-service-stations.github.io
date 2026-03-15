// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Плавный скроллинг к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Учитываем высоту фиксированного заголовка
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Валидация и отправка формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем все поля формы
            const nameInput = document.getElementById('name');
            const contactInput = document.getElementById('contact');
            const descriptionInput = document.getElementById('description');
            
            // Проверяем обязательные поля
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                hideError(nameInput);
            }
            
            if (!contactInput.value.trim()) {
                showError(contactInput, 'Пожалуйста, введите email или телефон');
                isValid = false;
            } else {
                hideError(contactInput);
            }
            
            if (!descriptionInput.value.trim()) {
                showError(descriptionInput, 'Пожалуйста, опишите ваш проект или проблему');
                isValid = false;
            } else {
                hideError(descriptionInput);
            }
            
            // Если все поля заполнены корректно
            if (isValid) {
                // Здесь можно добавить реальную логику отправки формы
                // Пока что просто покажем сообщение об успехе
                
                // Блокируем кнопку отправки на время "отправки"
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправляем...';
                submitBtn.disabled = true;
                
                // Имитация отправки формы
                setTimeout(() => {
                    alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
                    
                    // Сбрасываем форму
                    contactForm.reset();
                    
                    // Возвращаем кнопку в исходное состояние
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
    
    // Функция для отображения ошибки
    function showError(input, message) {
        // Удаляем предыдущее сообщение об ошибке
        hideError(input);
        
        // Добавляем класс ошибки
        input.classList.add('error');
        
        // Создаем элемент с сообщением об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.fontWeight = '600';
        
        // Вставляем сообщение об ошибке после поля ввода
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    
    // Функция для скрытия ошибки
    function hideError(input) {
        input.classList.remove('error');
        
        // Удаляем существующее сообщение об ошибке
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Добавляем обработчики событий для очистки ошибок при вводе
    if (contactForm) {
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    hideError(this);
                }
            });
        });
    }
    
    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками услуг и портфолио
    document.querySelectorAll('.service-card, .portfolio-item, .problem-card, .solution-card').forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
});

// Добавляем CSS для анимации при скролле
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Стили для полей с ошибками */
    .form-group .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
    
    /* Плавность для мобильного меню */
    .nav-menu.active {
        left: 0;
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active span:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);