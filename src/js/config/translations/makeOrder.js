import Translations from 'scanex-translations';


Translations.addText ('rus', {
    cart: {
        title: 'Корзина',
        clear: 'Очистить корзину',
        back: 'Назад',
        order: 'Перейти к оформлению заказа',        
        warning: 'Для редактирования контактной информации воспользуйтесь <label class="link">ссылкой</label>.\r\nПосле этого необходимо снова зайти в систему.',
        customer: 'Организация (заказчик)',
        project: {
            name: 'Название проекта',
            type: {
                title: 'Тип проекта',
                commercial: 'Коммерческий',
                internal: 'Внутренний',
                presale: 'Пресейл',
            },
            number: '№ Договора-контракта',
        },
        person: 'Имя и фамилия',        
        company: 'Компания',
        email: 'Электронная почта',
        comment: 'Комментарий',
        header: 'Оформление заказа',
        submit: 'Заказать',
        close: 'Закрыть',
        success: {
            header: 'Благодарим за оформление заказа!',
            content: 'На адрес электронной почты, указанный при регистрации было отправлено сообщение с ссылкой на детали заказа.',
            footer: 'В ближайшее время мы свяжемся с Вами и дадим подробную информацию о стоимости и характеристиках.',
        },
        invalid: 'Данное поле обязательно для заполнения'
    }
});

Translations.addText ('eng', {
    cart: {
        title: 'Cart',
        clear: 'Clear',
        back: 'Back',
        order: 'To order',        
        warning: 'To edit contact information use the link #. Afterwards it is necessary to login.',
        customer: 'Organization (customer)',
        project: {
            name: 'Project name',
            type: {
                title: 'Project type',
                commercial: 'Commercial',
                internal: 'Internal',
                presale: 'Presale',
            },
            number: 'Project number',
        },
        person: 'Name',
        company: 'Company',
        email: 'Email',
        comment: 'Comment',
        header: 'Place an order',
        submit: 'Submit',
        close: 'Close',
        success: {
            header: 'Thank you for order!',
            content: 'An email with the permanent link to your query has been sent to your address.',
            footer: 'We will soon send you more information concerning the cost and details.',
        },
        invalid: 'This field is required'
    }
});